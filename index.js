#!/usr/bin/env node
const fs = require('fs')
const chalk = require('chalk')
const log = console.log
const rm = require('./lib/Remover')
const path = require('path')
let processedFiles = 0

try {
    console.time("PROCESS TIME")
    if (process.argv.length < 3) {
        log(chalk.red(`cleanup-js path/to/file.js\ncleanup-js .     To Scan all .js files from this directory`))
    } else if (process.argv.length === 3) {
        let filepath = process.argv[2]

        if (filepath === ".") {
            iterateDir().then(() => {
                log(`\nNUMBER OF FILES PROCESSED : ${processedFiles}`)
                console.timeEnd("PROCESS TIME")
            })
        } else {

            processFile(filepath)
            console.timeEnd("PROCESS TIME")
        }
    } else {
        for (var i = 2, i_bound = process.argv.length; i < i_bound; i++) {
            let filepath = process.argv[i]
            processFile(filepath)
        }
        console.timeEnd("PROCESS TIME")
    }
} catch (err) {
    throw new Error(err)
}
function isDir(path) {
    return fs.lstatSync(path).isDirectory()
}

async function iterateDir(currPath = process.cwd()) {
    if (isDir(currPath)) {
        let dirList = fs.readdirSync(currPath)
        for (var i = 0, i_bound = dirList.length; i < i_bound; i++) {
            if (dirList[i] === "node_modules" || dirList[i] === ".git") continue;
            iterateDir(path.resolve(currPath, dirList[i]))
        }
    } else {
        let fileExtenstion = path.extname(currPath)
        if (fileExtenstion === ".js") processFile(currPath)
    }
}

function processFile(currPath) {
    try {
        let code = fs.readFileSync(currPath, 'utf8')
        let remover = new rm(code)
        let str = `${path.dirname(currPath)}\\${chalk.green.bold(path.basename(currPath))} Stats : `
        remover.process(str)
        processedFiles++
    } catch (err) {
        if (err.parsingError) {
            // log(chalk.red(`Parsing Error : ${currPath}`))
        }
    }
} 