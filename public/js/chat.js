const socket = io()

socket.on('message', (message) => {
  console.log(message)
})

document.querySelector('#frmMessage').addEventListener('submit', (e) => {
  e.preventDefault()
  const message = e.target.elements.message.value // get the input value by an element name
  socket.emit('sendMessage', message)
})
