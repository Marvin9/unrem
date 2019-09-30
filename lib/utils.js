function _substr(str, start, end) {
    return str.substr(start, end - start)
}

function getLineno(code, str) {
    for(var i = 0, i_bound = code.length; i < i_bound; i++) {
        let line = code[i], lineno = i + 1
        // let regex = new RegExp(`${str.split('\n')[0]}`)
        if(line.indexOf(str) !== -1) return lineno
    }
}

module.exports = {
    _substr,
    getLineno
}