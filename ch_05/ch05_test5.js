const http = require('http');
const fs = require('fs');

const server = http.createServer();

let port = 3000;
server.listen(port,()=>{
    console.log('웹 서버가 연결 되었습니다 : %d',port);
});

server.on('connection',(socket)=>{
    let addr = socket.address();
    console.log('클라이 언트가 접속했습니다. : %s %d',addr,port);
});

server.on('request',(req,res)=>{
    console.log('클라이언트 요청이 들어 왔습니다.');
    
    let filename = 'house.jpg';
    fs.readFile(filename,(err,data)=>{
        res.writeHead(200, {"Content-Type":"image/jpg"});
        res.write(data);
        res.end();
    });
});

server.on('close',()=>{
    console.log('서버가 종료됩니다.');
});