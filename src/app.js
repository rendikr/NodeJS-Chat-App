const express = require('express')

const app = express()

app.use(express.json()) // automatically parse any json

module.exports = app
