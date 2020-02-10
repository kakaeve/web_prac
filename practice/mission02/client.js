/* const http = require('http');
const socket = require('socket');

const server = http.createServer((req,res)=>{
    http.request(options,(res)=>{
        res.on('data',(chunk)=>{
            console.log('Server :'+chunk);
        });
    });
});
server.listen(7001,'127.0.0.1'); */

const http = require('http');

http.createServer((req,res)=>{
    res.on('data',(chunk)=>{
        res.send('chunk');
    });
});

http.listen(7001,'127.0.0.1',()=>{
    console.log('socket licked');
});