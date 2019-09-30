function _substr(str, start, end) {
    return str.substr(start, end - start)
}

function getLineno(code, str) {
    for(var i = 0, i_bound = code.length; i < i_bound; i++) {
        let line = code[i].trim(), lineno = i + 1
        if(line.indexOf(str.split('\r\n')[0]) !== -1) return lineno
    }
}

module.exports = {
    _substr,
    getLineno
}