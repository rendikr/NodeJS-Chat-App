const http = require('http')
const app = require('./app')
const socket = require('socket.io')
const port = process.env.PORT || 3000

const server = http.createServer(app)
const io = socket(server)

io.on('connection', () => {
  console.log('New WebSocket connection')
})

server.listen(port, () => {
  console.log('Server is up on port ' + port)
})
