const users = []

const addUser = ({ id, username, room }) => {
  // Clean the data
  username = username.trim().toLowerCase()
  room = room.trim().toLowerCase()

  // Validate the data
  if (!username || !room) {
    return {
      error: 'Invalid username or room'
    }
  }

  // Check for existing user
  const existingUser = users.find((user) => {
    return user.room === room && user.username === username
  })

  // Validate username
  if (existingUser) {
    return {
      error: 'Username already in use'
    }
  }

  // Store the user
  const user = { id, username, room }
  users.push(user)
  return { user }
}

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id)

  if (index !== -1) {
    return users.splice(index, 1)[0]
  }
}

const getUser = () => {

}

const getUsersInRoom = () => {

}

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
}
