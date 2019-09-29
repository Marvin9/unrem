function trackDeclaration(node, remover) {
    for (var i = 0, i_bound = node.declarations.length; i < i_bound; i++) {

        let declarator = node.declarations[i]
        remover.iterator(declarator.init)

        switch (node.declarations[i].id.type) {

            case "ObjectPattern":
                for (var j = 0, j_bound = declarator.id.properties.length; j < j_bound; j++) {
                    let property = declarator.id.properties[j],
                        identifierName = property.key.name,
                        varObject = remover.fetchStartEndOfDeclarations(node, declarator, property)

                    remover.pushToUnusedVariables(identifierName, varObject)

                }
                break;

            case "Identifier":
                let identifierName = declarator.id.name,
                    varObject = remover.fetchStartEndOfDeclarations(node, declarator)

                remover.pushToUnusedVariables(identifierName, varObject)

                break;
        }

    }
}

module.exports = trackDeclaration