const fs = require('fs')
const files = fs.readdirSync('./')
const pictures = files.map(fileName => fs.readFileSync(fileName).toString('base64'))
fs.writeFileSync('pictures.json', JSON.stringify(pictures))