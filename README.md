# unrem

[![Build Status](https://travis-ci.com/Marvin9/unrem.svg?branch=master)](https://travis-ci.com/Marvin9/unrem)

👍 Find unused variables of javascript code. No transpiling dependecies. Under development.

### Clone repository

```
npm install
```

```
npm link
```

#### Now go to any project directory

```
cleanup-js .
```

#### It will iterate through all .js files residing in that directory and stats in terminal about unused variables

```javascript
let a, b = 10

a = setInterval(() => {
  console.log("a is considered unused variable")
}, 1000)

console.log(`${b} -> b is considered as used variable`)

```

## Demo - Babel's 4000+ files

![Babel Demo](https://github.com/Marvin9/unrem/blob/master/demo.gif)
