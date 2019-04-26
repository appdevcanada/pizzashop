console.log()
console.log("OLD APP_JWTKEY value: ", process.env.APP_JWTKEY)

var newKey = [...Array(30)].map(e => ((Math.random() * 36) | 0).toString(36)).join('')
process.env.APP_JWTKEY = newKey

console.log("NEW APP_JWTKEY value: ", process.env.APP_JWTKEY, "already set as ENV variable!")
console.log()
