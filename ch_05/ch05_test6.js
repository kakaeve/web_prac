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
    let infile = fs.createReadStream(filename,{flags:'r'});
    let filelength = 0;
    let curlength = 0;

    fs.stat(filename,(err,stats)=>{
        filelength = stats.size;
    });

    res.writeHead(200,{"Content-Type":"image/jpg"});

    infile.on('readable',()=>{
        let chunk;
        while(null!=(chunk = infile.read())){
            console.log('읽어 들인 데이터의 크기 : %d 바이트',chunk.length);
            curlength += chunk.length;
            res.write(chunk,'utf-8',(err)=>{
                console.log('파일 부분 쓰기 완료 : %d, 파일 크기 : %d',curlength,filelength);
                if(curlength>=filelength){
                    res.end();
                }
            });
        }
    });


});

server.on('close',()=>{
    console.log('서버가 종료됩니다.');
});