const socket = io()

// Elements
const $messageForm = document.querySelector('#frmMessage')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#btnLocation')
const $messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#messageTemplate').innerHTML
const locationMessageTemplate = document.querySelector('#locationMessageTemplate').innerHTML
const sidebarTemplate = document.querySelector('#sidebarTemplate').innerHTML

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoScroll = () => {
  // New message element
  const $newMessage = $messages.lastElementChild

  // Get the height of the new message
  const newMessageStyles = getComputedStyle($newMessage)
  const newMessageMargin = parseInt(newMessageStyles.marginBottom)
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

  // Visible height
  const visibleHeight = $messages.offsetHeight

  // Height of messages container
  const containerHeight = $messages.scrollHeight

  // How far have I scrolled?
  const scrollOffset = $messages.scrollTop + visibleHeight

  if (containerHeight - newMessageHeight <= scrollOffset) {
    // check if the windows is already at the bottom before new message comes in
    $messages.scrollTop = $messages.scrollHeight
  }
}

socket.on('message', (message) => {
  console.log(message)
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format('h:mm a')
  })
  $messages.insertAdjacentHTML('beforeend', html)
  autoScroll()
})

socket.on('locationMessage', (message) => {
  console.log(message)
  const html = Mustache.render(locationMessageTemplate, {
    username: message.username,
    url: message.url,
    createdAt: moment(message.createdAt).format('h:mm a')
  })
  $messages.insertAdjacentHTML('beforeend', html)
  autoScroll()
})

socket.on('roomData', ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users
  })
  document.querySelector('#sidebar').innerHTML = html
})

$messageForm.addEventListener('submit', (e) => {
  e.preventDefault()
  // disable button
  $messageFormButton.setAttribute('disabled', 'disabled')

  const message = e.target.elements.message.value // get the input value by an element name
  socket.emit('sendMessage', message, (error) => {
    // enable button
    $messageFormButton.removeAttribute('disabled')
    // clear input value
    $messageFormInput.value = ''
    $messageFormInput.focus()

    if (error) {
      return console.log(error)
    }

    console.log('Message delivered!')
  })
})

$sendLocationButton.addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocation is not supported by your browser')
  }

  // disable button
  $sendLocationButton.setAttribute('disabled', 'disabled')

  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit('sendLocation', ({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    }), (error) => {

      // enable button
      $sendLocationButton.removeAttribute('disabled')

      if (error) {
        return console.log(error)
      }

      console.log('Location shared!')
    })
  })
})

socket.emit('join', { username, room }, (error) => {
  if (error) {
    alert(error)
    location.href = '/'
  }
})
