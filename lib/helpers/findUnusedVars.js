const chalk = require('chalk')
const log = console.log 

function findUnusedVars(remover) {
    let usedVar = remover.usedVariables

    // iterate thro all used variables
    Object.keys(usedVar).forEach(variable => {

        // iteration level (if same name variables are used at different level)
        let itrationlevelsArr = [...usedVar[variable]]

        // iterate thro all level
        itrationlevelsArr.forEach(itr => {
            let itrLevel = itr

            // find that variable declaration at nearest level
            while (itrLevel >= 0) {
                let checkIfLevelExist = remover.unusedVariables.hasOwnProperty(itrLevel)
                let checkIfVariableExistInThatLevel = checkIfLevelExist && remover.unusedVariables[itrLevel].hasOwnProperty(variable)

                // if that declaration is found then remove that variable from unusedVariables list
                if (checkIfVariableExistInThatLevel) {
                    remover.unusedVariables[itrLevel][variable].pop()
                    if (remover.unusedVariables[itrLevel][variable].length === 0) {
                        delete remover.unusedVariables[itrLevel][variable]
                        if (!Object.keys(remover.unusedVariables[itrLevel]).length) delete remover.unusedVariables[itrLevel]
                        // log(chalk.blue(`${variable} was declared and used`))
                    }
                }

                itrLevel--
            }
        })
    })

    let unused = remover.unusedVariables
    if (!Object.keys(unused).length) return 0//log(chalk.green(`ALL VARIABLES ARE USED`))
    else {
        return 1
        // for (const levels in unused) {
        //     let variables = unused[levels]
        //     for (const variable in variables) {
        //         log(chalk.red(`${variable} was declared but not used`))
        //     }
        // }
    }
}

module.exports = findUnusedVars