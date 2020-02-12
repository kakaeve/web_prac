const http = require('http');
const socket = require('socket.io');
const express = require('express');
let app = express();

const server = http.createServer(app);

const io = socket(server);;







app.use('/', function(req, res) {
    res.sendFile(__dirname + '/client.html');
});

server.listen(3000,(socket)=>{
    console.log('3000번 포트 연결됨');
});

/* io.socket.on('connection',(socket)=>{
    console.log("브라우저 연결 : " + socket.id);
    socket.join("chat");
}) */

app.on('connection',(socket)=>{
    console.log('연결됨');
    let id = socket.id;

    socket.on('msg',(data)=>{
        console.log(data);
        socket.emit('recMsg',{comment:id + ' : ' + data.comment + '\n'});
    });
});

