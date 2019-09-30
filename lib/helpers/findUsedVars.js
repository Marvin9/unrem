function findUsedVars(remover, level, identifierName) {
    let itrLevel = level
    if (remover.usedVariables[identifierName] && typeof remover.usedVariables[identifierName] === "object") {
        remover.usedVariables[identifierName].push(itrLevel)
    } else {
        remover.usedVariables[identifierName] = [itrLevel]
    }
}

module.exports = findUsedVars