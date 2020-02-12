const express = require('express');
const http = require('http');
const path = require('path');

const bodyParser = require('body-parser');
const static = require('serve-static');

let app = express();

let router = express.Router();





app.set('port',process.env.PORT||3000);

app.use(bodyParser.urlencoded({extended:false}));

app.use(bodyParser.json());

//app.use('/public',static(path.join(__dirname,'public')));
app.use(express.static('public'));



router.route('/process/login').post((req,res)=>{
    console.log('/process/login 처리함.');

    let paramId = req.body.id || req.query.id;
    let paramPassword = req.body.password || req.query.password;

    res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
    res.write('<h1>Express 서버에서 응답한 결과 입니다.</h1>');
    res.write('<div><p>Param id : ' + paramId + '</p></div>');
    res.write('<div><p>Param password : ' + paramPassword + '</p></div>');
    res.write("<br><br><a href='../login2.html'>로그인 페이지로 돌아가기</a>");
    res.end();
});

app.use('/',router);

app.all('*',(req,res)=>{
    res.status(404).send('<h1>ERROR - 페이지를 찾을 수 없습니다.</h1>');
});

app.use((req,res,next)=>{
    console.log('첫 번째 미들웨어에서 요청을 처리함.');

    let paramId = req.body.id||req.query.id;
    let paramPassword = req.body.password || req.query.password;

    res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
    res.write('<h1>Express 서버에서 응답한 결과 입니다.</h1>');
    res.write('<div><p>Param id : ' + paramId + '</p></div>');
    res.write('<div><p>Param password : ' + paramPassword + '</p></div>');
    res.end();
});



http.createServer(app).listen(3000,()=>{
    console.log('Express 서버가 3000번 포트에서 시작됨.');
});