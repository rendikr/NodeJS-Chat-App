const socket = io()

socket.on('countUpdated', (count) => {
  console.log('The count has been updated!', count)
})

document.querySelector('#btnIncrement').addEventListener('click', () => {
  console.log('Clicked!')
  socket.emit('increment')
})
