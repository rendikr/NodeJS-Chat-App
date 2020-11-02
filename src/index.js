const http = require('http')
const app = require('./app')
const socket = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')
const port = process.env.PORT || 3000

const server = http.createServer(app)
const io = socket(server)

io.on('connection', (socket) => {
  console.log('New WebSocket connection')

  socket.on('join', (options, callback) => {
    const { error, user } = addUser({ id: socket.id, ...options })

    if (error) {
      return callback(error)
    }

    socket.join(user.room)

    socket.emit('message', generateMessage('Welcome!'))
    socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has joined the chat room!`))

    callback()
  })

  socket.on('sendMessage', (message, callback) => {
    const filter = new Filter()

    if (filter.isProfane(message)) {
      return callback('Profanity is not allowed!')
    }

    io.emit('message', generateMessage(message))
    callback()
  })

  socket.on('sendLocation', (location, callback) => {
    io.emit('locationMessage', generateLocationMessage(location.latitude,location.longitude))
    callback()
  })

  socket.on('disconnect', () => {
    const user = removeUser(socket.id)

    if (user) {
      io.to(user.room).emit('message', generateMessage(`${user.username} has left the chat room`))
    }

  })
})

server.listen(port, () => {
  console.log('Server is up on port ' + port)
})
