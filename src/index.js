const http = require('http')
const app = require('./app')
const socket = require('socket.io')
const port = process.env.PORT || 3000

const server = http.createServer(app)
const io = socket(server)

let count = 0

io.on('connection', (socket) => {
  console.log('New WebSocket connection')

  socket.emit('countUpdated', count)

  socket.on('increment', () => {
    count++
    io.emit('countUpdated', count)
  })
})

server.listen(port, () => {
  console.log('Server is up on port ' + port)
})
