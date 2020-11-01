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

socket.on('message', (message) => {
  console.log(message)
  const html = Mustache.render(messageTemplate, {
    message
  })
  $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', (url) => {
  console.log(url)
  const html = Mustache.render(locationMessageTemplate, {
    url
  })
  $messages.insertAdjacentHTML('beforeend', html)
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
