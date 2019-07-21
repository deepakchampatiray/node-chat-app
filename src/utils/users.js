const users = [];

const addUser = ({id, username, room}) => {
    if(!username || !room)
        return {
            error: 'User Name and Room are required'
        };
        
    // Clean Data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase();

    // Validate data
    if(!username || !room)
        return {
            error: 'User Name and Room are required'
        };
    // Check for Existing user
    const existingUser = users.find((user)=> {
        return (    
                user.room === room && 
                user.username === username)
    })
    if(existingUser)
        return {
            error: `One user by the name ${username} is already present.`
        }

    // Store User 
    const user = {
        id,
        username,
        room
    };
    users.push(user);
    return {user};
}

const removeUser = (userId) => {
    const index = users.findIndex((user) => user.id === userId);
    if(index !== -1)
        return users.splice(index, 1)[0];
}

const getUser = (userId) => {
    return users.find(user => user.id === userId);
}

const getUsersInRoom = (room) => {
    return users.filter(user => user.room === room.toLowerCase());
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}
