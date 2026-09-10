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

    socket.on('user-joined',(name)=>{
        socket.userName=name;
        socket.broadcast.emit('system-message',`${name} has joined the chat`)
    })

    socket.on('user-message', (message) => {
        io.emit('message',message);
    })

    socket.on('disconnect',()=>{
        io.emit('user-count',io.engine.clientsCount)

        if(socket.userName){
            io.emit('system-message',`${socket.userName} has left the chat`)
        }
    })

    socket.on('typing',()=>{
        socket.broadcast.emit('user-typing',socket.userName);
    })

    socket.on('stop-typing',()=>{
        socket.broadcast.emit('user-stop-typing');
    })
})

server.listen(8000, () =>{
    console.log("Server is running on PORT:8000");
});


