const Remover = require('./lib/Remover')
const fs = require('fs')

const code = fs.readFileSync('./custom_test/testcode.js', 'utf8')


let remove = new Remover(code)

remove.remove()