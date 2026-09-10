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
    console.log("A user connected", socket.id);

    socket.on('user-message', (message) => {
        io.emit('message',message);
    })
})

server.listen(8000, () =>{
    console.log("Server is running on PORT:8000");
});


