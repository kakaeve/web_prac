const express = require('express');
const http = require('http');
const path = require('path');

const bodyParser = require('body-parser');
const static = require('serve-static');

const expressErrorHandler = require('express-error-handler');

const cookieParser = require('cookie-parser');

let app = express();

let router = express.Router();





app.set('port',process.env.PORT||3000);

app.use(bodyParser.urlencoded({extended:false}));

app.use(bodyParser.json());

//app.use('/public',static(path.join(__dirname,'public')));
app.use(express.static('public'));

app.use(cookieParser());

router.route('/process/showCookie').get((req,res)=>{
    console.log('/process/showCookie 호출됨');

    res.send(req.cookies);
});

router.route('/process/setUserCookie').get((req,res)=>{
    console.log('/process/setUserCookie 호출됨');

    res.cookie('user',{
        id: 'mike',
        name : '소녀시대',
        authorized : true
    });

    res.redirect('/process/showCookie');
});

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

router.route('/process/users/:id').get((req,res)=>{
    console.log('/process/users/:id 처리함.');

    let paramId = req.params.id;

    console.log('./process/users와 토큰 %s를 이용해 처리함',paramId);

    res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
    res.write('<h1>Express 서버에서 응답한 결과 입니다.</h1>');
    res.write('<div><p>Param id : ' + paramId + '</p></div>');
    res.end();
});

app.use('/',router);

let errorHandler = expressErrorHandler({
    static:{
        '404': './public/404.html'
    }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

app.all('*',(req,res)=>{
    res.status(404).send('<h1>ERROR - 페이지를 찾을 수 없습니다.</h1>');
});

/* app.use((req,res,next)=>{
    console.log('첫 번째 미들웨어에서 요청을 처리함.');

    let paramId = req.body.id||req.query.id;
    let paramPassword = req.body.password || req.query.password;

    res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
    res.write('<h1>Express 서버에서 응답한 결과 입니다.</h1>');
    res.write('<div><p>Param id : ' + paramId + '</p></div>');
    res.write('<div><p>Param password : ' + paramPassword + '</p></div>');
    res.end();
}); */



http.createServer(app).listen(3000,()=>{
    console.log('Express 서버가 3000번 포트에서 시작됨.');
});