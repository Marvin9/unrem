const acorn = require('acorn')
const chalk = require('chalk')
const log = console.log
const trackDeclaration = require('./helpers/trackDeclaration')
const trackUsedVars = require('./helpers/trackUsedVariables')
const findUnusedVars = require('./helpers/findUnusedVars')
const { _substr } = require('./utils')

class Remover {
    constructor(code) {
        this.code = code
        try {
            this.ast = acorn.parse(code)
        } catch (parseErr) {
            log(chalk.red.bgBlack('Parsing Error'))
            process.exit(0)
        }

        this.variableInsideArgument = {}
        this.unusedVariables = {}
        this.usedVariables = {}
        this.ITERATOR_LEVEL = -1
    }

    async iterator(node) {
        if (node) {
            switch (node.type) {
                case "Program": case "BlockStatement": case "ClassBody":
                    this.ITERATOR_LEVEL++
                    for (var i = 0, i_bound = node.body.length; i < i_bound; i++) this.iterator(node.body[i]);
                    this.ITERATOR_LEVEL--
                    break;

                case "VariableDeclaration":
                    trackDeclaration(node, this)
                    break;
                
                case "TemplateLiteral" :
                    for(var i = 0, i_bound = node.expressions.length; i < i_bound; i++) this.iterator(node.expressions[i])
                    break;

                case "FunctionDeclaration": case "ArrowFunctionExpression": case "FunctionExpression":
                    for(var i =0, i_bound = node.params.length; i < i_bound; i++) {
                        let argument = node.params[i].name 
                        if(this.variableInsideArgument[argument]) {
                            this.variableInsideArgument[argument]++
                        } else {
                            this.variableInsideArgument[argument] = 1
                        }
                    }
                    this.iterator(node.body)
                    for(var i =0, i_bound = node.params.length; i < i_bound; i++) {
                        let argument = node.params[i].name 
                        this.variableInsideArgument[argument]--
                    }
                    break;

                case "ForStatement":
                    this.iterator(node.init)
                    this.iterator(node.test)
                    this.iterator(node.update)
                    this.iterator(node.body)
                    break;

                case "UpdateExpression":
                    this.iterator(node.argument)
                    break;


                case "WhileStatement": case "DoWhileStatement":
                    this.iterator(node.test)
                    this.iterator(node.body)
                    break;

                case "ForOfStatement": case "ForInStatement":
                    this.iterator(node.left)
                    this.iterator(node.right)
                    this.iterator(node.body)
                    break;

                case "ExpressionStatement":
                    this.iterator(node.callee)
                    this.iterator(node.expression);
                    break;

                case "CallExpression":
                    this.iterator(node.callee)
                    for (var i = 0, i_bound = node.arguments.length; i < i_bound; i++) this.iterator(node.arguments[i])
                    break;

                case "MemberExpression":
                    this.iterator(node.object)
                    this.iterator(node.property)
                    break;

                case "ClassDeclaration":
                    this.iterator(node.superClass)
                    this.iterator(node.body)
                    break;

                case "MethodDefinition":
                    this.iterator(node.value)
                    break;
                
                case "CatchClause" :
                    this.iterator(node.body)
                    break;

                case "IfStatement": case "ConditionalExpression":
                    this.iterator(node.test)
                    this.iterator(node.consequent)
                    this.iterator(node.alternate)
                    break;

                case "LogicalExpression": case "BinaryExpression":
                    this.iterator(node.left)
                    this.iterator(node.right)
                    break;

                case "AssignmentExpression":
                    this.iterator(node.right)
                    break;

                case "UnaryExpression":
                    this.iterator(node.argument)
                    break;

                case "TryStatement":
                    this.iterator(node.block)
                    this.iterator(node.handler)
                    break;

                case "ThrowStatement" :
                    this.iterator(node.argument)
                    break;

                case "SwitchStatement":
                    this.iterator(node.disciminant)
                    for (var i = 0, i_bound = node.cases.length; i < i_bound; i++) this.iterator(node.cases[i])
                    break;

                case "SwitchCase":
                    for (var i = 0, i_bound = node.consequent.length; i < i_bound; i++) this.iterator(node.consequent[i])
                    break;

                case "ReturnStatement":
                    this.iterator(node.argument)
                    break;

                case "ObjectExpression":
                    for (var i = 0, i_bound = node.properties.length; i < i_bound; i++) this.iterator(node.properties[i].value)
                    break;

                case "NewExpression":
                    this.iterator(node.callee)
                    for (var i = 0, i_bound = node.arguments.length; i < i_bound; i++) this.iterator(node.arguments[i])
                    break;

                case "ArrayExpression":
                    for (var i = 0, i_bound = node.elements.length; i < i_bound; i++) this.iterator(node.elements[i])
                    break;

                case "Identifier":
                    let identifierName = node.name
                    if(this.variableInsideArgument[identifierName] && this.variableInsideArgument[identifierName] > 0) break;
                    let itrLevel = this.ITERATOR_LEVEL
                    if (this.usedVariables[identifierName] && typeof this.usedVariables[identifierName] === "object") {
                        this.usedVariables[identifierName].push(itrLevel)
                    } else {
                        this.usedVariables[identifierName] = [itrLevel]
                    }
                    break;

                // default : 
                //     log(chalk.red(`${node.type}`))
            }
        }
    }

    // main
    remove() {
        try {
        this.iterator(this.ast)
            .then(() => {

                const removerNeeded = findUnusedVars(this)

                log(JSON.stringify(this.unusedVariables, null, ' '))
                // if(removerNeeded) {

                //     let unused = this.unusedVariables
                //     // iterate all levels
                //     for(const level in unused) {
                //         let variables = unused[level]
                //         for(const variable in variables) {
                //             let varArray = variables[variable]

                //             varArray.forEach(varDetails => {
                //                 let mainLine = _substr(this.code, varDetails.mainStart, varDetails.mainEnd)
                //                 let declaration = _substr(this.code, varDetails.personalStart, varDetails.personalEnd)

                //                 log(this.code.match(declaration))
                //             })

                //         }
                //     }


                // } else {

                // }

            })
        } catch(err) {
            throw new Error(err)
        }
    }

    fetchStartEndOfDeclarations(node, declarator, property = null) {
        let details = {
            mainStart: node.start,
            mainEnd: node.end,
            personalStart: declarator.start,
            personalEnd: declarator.end
        }

        if (property) {
            Object.assign(details, {
                personalStart: property.start,
                personalEnd: property.end,
                parentStart: declarator.start,
                parentEnd: declarator.end
            })
            return details
        } else return details
    }

    pushToUnusedVariables(identifierName, varObject) {
        let level = this.ITERATOR_LEVEL
        if (this.unusedVariables.hasOwnProperty(level)) {
            if (this.unusedVariables[level].hasOwnProperty(identifierName)) {
                this.unusedVariables[level][identifierName].push(varObject)
            }
            this.unusedVariables[level][identifierName] = [varObject]
        } else {
            this.unusedVariables[level] = {}
            this.unusedVariables[level][identifierName] = [varObject]
        }
    }
}

module.exports = Remover