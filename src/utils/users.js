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
  // Find user index
  const index = users.findIndex((user) => user.id === id)

  // Remove the user if found
  if (index !== -1) {
    return users.splice(index, 1)[0]
  }
}

const getUser = (id) => {
  // Get the user by the id
  return users.find((user) => user.id === id)
}

const getUsersInRoom = (room) => {
  // Get users in the room
  room = room.trim().toLowerCase()
  return users.filter((user) => user.room === room)
}

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
}
