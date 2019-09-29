function trackUsedVars(node, remover) {
    let identifierName = node.name, itrLevel = remover.ITERATOR_LEVEL
    if (remover.usedVariables.hasOwnProperty(identifierName)) {
        remover.usedVariables[identifierName].push(itrLevel)
    } else {
        remover.usedVariables[identifierName] = [itrLevel]
    }
}

module.exports = trackUsedVars