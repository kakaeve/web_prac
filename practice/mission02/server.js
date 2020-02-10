const http = require('http');
const socket = require('socket');

const server = http.createServer((req,res)=>{
    http.request(options,(res)=>{
        res.on('data',(chunk)=>{
            console.log('BODY :'+chunk);
        });
    });
});
server.listen(7001,'127.0.0.1');