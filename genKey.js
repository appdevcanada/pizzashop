console.log()
console.log("OLD APP_JWTKEY value: ", process.env.APP_JWTKEY)

var newKey = [...Array(30)].map(e => ((Math.random() * 36) | 0).toString(36)).join('')
process.env.APP_JWTKEY = newKey

console.log("Use: export APP_JWTKEY=" + process.env.APP_JWTKEY, "to set the new value to memory...")
console.log()
