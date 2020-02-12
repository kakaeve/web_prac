const express = require('express');
const http = require('http');

let app = express();

app.use((req,res,next)=>{
    console.log('첫 번째 미들웨어에서 요청을 처리함.');

    let userAgent = req.header('User-Agent');
    let paramName = req.query.name;

    res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
    res.write('<h1>Express 서버에서 응답한 결과입니다.</h1>');
    res.write('<div><p>User-Agent : '+userAgent +'</p></div>');
    res.write('<div><p>Param name : ' + paramName + '</p></div>');
    res.end();
    
});
app.use('/',(req,res,next)=>{
    console.log('두 번째 미들웨어에서 요청을 처리함.');

    res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
    res.end('<h1>Express 서버에서 '+ req.user + '가 응답한 결과입니다.</h1>');
})

http.createServer(app).listen(3000,()=>{
    console.log('Express 서버가 3000번 포트에서 시작됨.');
});