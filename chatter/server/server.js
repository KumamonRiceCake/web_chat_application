const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const publicPath = path.join(__dirname, '../public');
const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketIO(server);

const {generateMessage} = require('./utils/message');
const {Users} = require('./utils/users');
const {Rooms} = require('./utils/rooms');
const users = new Users();
const rooms = new Rooms();

//Middleware
app.use(express.static(publicPath));


io.on('connection', (socket) => {
    console.log('User connected: ', socket.id);

    //Send the latest room list to the client
    socket.on('requestRoomList', () => {
        io.emit("updateRoomList", rooms.getRoomList());
    });

    //Join a room
    socket.on('joinRoom', (params, callback) => {
        let name = 'anonymous';   //User name is anonymous by default
        let room = '';
        let password = '';

        if (params.name.trim().length > 0) {
            name = params.name;
        }

        //Room name is required
        if (params.room.trim().length > 0) {
            room = params.room;
        }
        else {
            return callback('Please Enter the room name!');
        }

        if (params.password.trim().length > 0) {
            password = params.password;
        }

        //Create a new room
        if (typeof rooms.getRoom(room) === "undefined") {
            rooms.addRoom(room, password);
        }
        //Join an existing room
        else {
            if (!rooms.isValid(room, password)) {
                return callback('Incorrect Password!');
            }
            else {
                rooms.increment(room);    //Increment participant number
            }
        }

        socket.join(params.room); //Join a room

        //Refresh old user list
        users.removeUser(socket.id);
        users.addUser(socket.id, name, params.room);

        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        //Welcome message to the entered participant
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat room: ' + room));
        //Broadcasting a new participant joined
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${name} has joined`));

        callback();
    });

    //Create a new message
    socket.on('createMessage', (message, callback) => {
        let user = users.getUser(socket.id);

        //Send the message to all participants
        if(user && message.text.trim().length > 0){
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text), socket.id);
        }

        callback(); //we can call it with an argument
    });

    //Disconnection
    socket.on('disconnect', () => {
        let user = users.removeUser(socket.id);

        if(user){
        //update user list
        io.to(user.room).emit('updateUserList', users.getUserList(user.room));
        //Broadcast someone left
        io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));

        rooms.decrement(user.room);   //Decrement participant number
        //If no one left in the room, remove the room from the list
        if (rooms.getRoom(user.room).participants == 0) {
            rooms.removeRoom(user.room);
        }
    }
    console.log('User was disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${3000}`);
});
