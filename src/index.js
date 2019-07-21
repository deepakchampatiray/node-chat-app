const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const BadWords = require('bad-words')
const {generateMessage, generateLocationMessage} = require('./utils/message');
const {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users');

const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.use(express.static(__dirname + '/../public'))
const port = process.env.PORT || 3000

const badWordFilter = new BadWords();

io.on('connection', (socket) => {
    console.log("New Connection", socket.id)
    
    socket.on('join', ({username, room}) => {
        console.log(username, 'joined ', room);
        const {error, user} = addUser({id: socket.id, username, room});
        if(error) {
            socket.emit('message', generateMessage(`Sorry, could not sign in into the chat room. ${error}`));
        }
        else {
            socket.join(user.room);
            socket.emit('message', generateMessage(`Welcome to Let's Chat.`));
            socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has joined.`));
            io.to(user.room).emit('room-data', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })

    socket.on('client-message', (message, callback) => {
        const user = getUser(socket.id);
        if(!user) {
            return;
        }
        if(!badWordFilter.isProfane(message))
            io.to(user.room).emit('message', generateMessage(message, getUser(socket.id)));
        else {
            if(callback)
                callback(`Please refrain from using profanity laced language.`);
        }
    })
    socket.on('sendLocation', (positon)=>{
        const user = getUser(socket.id);
        if(!user) {
            return;
        }
        socket.broadcast.to(user.room).emit('locationMessage', generateLocationMessage(`https://www.google.com/maps?q=${positon.lat},${positon.long}`, getUser(socket.id)));
    })
    socket.on('disconnect', ()=> {
        //console.log(socket);
        const user = removeUser(socket.id);
        if(user) {
            socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has left.`));
            io.to(user.room).emit('room-data', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
})

server.listen(port, ()=>{
    console.log('App Running on port ' + port);
});