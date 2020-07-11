  
const path = require("path")

module.exports = function (chicken) {
    chicken.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, "../public/index.html"))
    })
    chicken.get('/notes', function (req, res) {
        res.sendFile(path.join(__dirname, "../public/notes.html"))
    })
}