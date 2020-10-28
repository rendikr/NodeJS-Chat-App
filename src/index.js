const http = require('http')
const app = require('./app')
const socket = require('socket.io')
const port = process.env.PORT || 3000

const server = http.createServer(app)
const io = socket(server)

io.on('connection', (socket) => {
  console.log('New WebSocket connection')

  socket.emit('message', 'Welcome!')
  socket.broadcast.emit('message', 'A new user has joined the chat room!')

  socket.on('sendMessage', (message) => {
    io.emit('message', message)
  })

  socket.on('sendLocation', (location) => {
    io.emit('message', `https://google.com/maps?q=${location.latitude},${location.longitude}`)
  })

  socket.on('disconnect', () => {
    io.emit('message', 'A user has left the chat room')
  })
})

server.listen(port, () => {
  console.log('Server is up on port ' + port)
})
