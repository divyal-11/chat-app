const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.resolve("./public")));

app.get("/", (req, res) => {
    res.sendFile(path.resolve("./public/index.html"));
});

io.on('connection', (socket) =>{
    io.emit('user-count',io.engine.clientsCount);
    
    //handle user joining or switching rooms
    socket.on('join-room',({room,userName})=>{
        socket.userName = userName
        
        //if the user was already in a room ,leave it and notify that roomm
        if(socket.currentRoom){
            socket.leave(socket.currentRoom)
            socket.to(socket.currentRoom).emit('system-message',`${socket.userName} left #${socket.currentRoom}`)
        }

        //join new room
        socket.join(room)
        socket.currentRoom = room
        //notify others in the new room
        socket.to(room).emit('system-message',`${socket.userName} has joined #${room}`)
        

    })




    socket.on('user-message', (message) => {
        if(socket.currentRoom){
            io.to(socket.currentRoom).emit('message',{
                ...message,
                senderId: socket.id
            })
        }
    })

    socket.on('disconnect',()=>{
        io.emit('user-count',io.engine.clientsCount)

        if(socket.userName && socket.currentRoom){
            socket.to(socket.currentRoom).emit('system-message',`${socket.userName} has left the chat`)
        }
    })

    socket.on('typing',()=>{
        if(socket.currentRoom){
            socket.to(socket.currentRoom).emit('user-typing',socket.userName);
        }
    })

    socket.on('stop-typing',()=>{
        if(socket.currentRoom){
            socket.to(socket.currentRoom).emit('user-stop-typing',socket.userName)
        }
    })
})

server.listen(8000, () =>{
    console.log("Server is running on PORT:8000");
});


