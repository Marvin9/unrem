const fs = require('fs')
const chalk = require('chalk')
const log = console.log
const rm = require('./lib/Remover')
const path = require('path')

if (process.argv.length < 3) {
    log(chalk.red(`node index paht/to/file.js\nnode index .     To Scan all .js files from this directory`))
} else {
    let filepath = process.argv[2]

    if (filepath === ".") {
        iterateDir()
    } else {

        let code = fs.readFileSync(filepath, 'utf8')
        let remover = new rm(code)
        remover.process()

    }
}

function isDir(path) {
    return fs.lstatSync(path).isDirectory()
}

function iterateDir(currPath = __dirname) {
    if(isDir(currPath)) {
        let dirList = fs.readdirSync(currPath)
        for(var i = 0, i_bound = dirList.length; i < i_bound; i++) {
            if(dirList[i] === "node_modules" || dirList[i] === ".git") continue; 
            iterateDir(path.resolve(currPath, dirList[i]))
        }
    } else {
        let fileExtenstion = path.extname(currPath)
        if(fileExtenstion === ".js") processFile(currPath)
    }
}

function  processFile(currPath) {
    try {
        let code = fs.readFileSync(currPath, 'utf8')
        let remover = new rm(code)
        let str = `${path.dirname(currPath)}\\${chalk.green.bold(path.basename(currPath))} Stats : `
        remover.process(str)
    } catch(err) {
        throw new Error(err)
    }
} 