//express 기본 모듈 불러오기
const express = require('express');
const http = require('http');
const path = require('path');
//express 미들웨어 불러오기
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const static = require('serve-static');
//express 에러 핸들러 불러오기
const errorHandler = require('errorHandler');
const expressErrorHandler = require('express-error-handler');
//express session관리 불러오기
const expressSession = require('express-session');
//mongodb 클라이언트 모듈 불러오기
const MongoClient = require('mongodb').MongoClient;

//익스프레스 생성
let app = express();

//port 설정
app.set('port',process.env.PORT||3000);

//body parser 사용해 urlencoded 파싱
app.use(bodyParser.urlencoded({extended:false}));

//body-parser 사용해 application/json 파싱
app.use(bodyParser.json());

//public 폴더 사용
app.use('/public',static(path.join(__dirname,'public')));

//cookie-parser 사용
app.use(cookieParser());

//session 설정
app.use(expressSession({
    secret : 'my key',
    resave : true,
    saveUninitialized : true

}));

//database 객체 변수
let database;

//데이터베이스 연결
let connectDB = ()=>{
    //연결 정보 mongodb://IP정보:port/DB이름
    let databaseUrl = 'mongodb://localhost:27017/local';

    //데이터베이스 연결
    MongoClient.connect(databaseUrl, (err,db)=>{
        if(err) throw err;

        console.log('데이터 베이스에 연결 되었습니다. :' + databaseUrl);

        //database 변수에 객체 할당 mongoDB 3.0이상에서는 db의 이름 지정
        database = db.db('local');
        //console.log(database);
    });
}

//유저 아이디 비교 authUser 함수 생성
let authUser = (database,id,password,callback)=>{
    console.log('authUser 호출됨');
    //console.dir(database);

    //콜렉션 참조
    let users = database.collection('users');
    console.dir(users);
    //database에서 아이디 비번 찾기
    users.find({"id":id,"password":password}).toArray((err,docs)=>{
        if(err){
            callback(err,null);
            return;
        }

        if(docs.length>0){
            console.log('아이디 [%s], 비밀번호[%s]가 일치하는 사용자 찾음',id,password);
            callback(null,docs);
        }
        else{
            console.log('일치하는 사용자를 찾지 못함.');
            callback(null,null);
        }
    });
}
//유저 추가
let addUser = (database,id,password,name,callback)=>{
    console.log('addUsers 호출됨 : ' + id + ' , ' + password + ' , ' + name);

    //db참조
    let users = database.collection('users');

    //id password name을 이용해 추가
    users.insertMany([{"id":id,"password":password,"name":name}],(err,result)=>{
        if(err){//error발생시 그냥 끝냄
            callback(err,null);
            return;
        }
        
        if(result.insertedCount>0){
            console.log("사용자 레크드 추가됨 : " + result.insertedCount);
        }
        else{
            console.log('추가된 레코드가 없음');
        }

        callback(null,result);
    });

    
}

//router 객체
let router = express.Router();

//로그인 라우팅
router.route('/process/login').post((req,res)=>{
    console.log('/process/login 호출됨');

    let paramId = req.param('id');
    let paramPassword = req.param('password');

    if(database){
        authUser(database,paramId,paramPassword,(err,docs)=>{
            if(err) {throw err};

            if(docs){
                console.dir(docs);

                let username = docs[0].name;
                res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
                res.write('<h1>로그인 성공</h1>');
                res.write('<div><p>사용자 아이디 : '+ paramId + '</p></div>');
                res.write('<div><p>사용자 이름 : '+ username + '</p></div>');
                res.write("<br><br><a href='/public/login.html'>다시로그인하기</a>");
                res.end();
            }
            else{
                res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
                res.write('<h1>로그인 실패</h1>');
                res.write('<div><p>아이디와 비밀번호를 확인하십시오.</p></div>');
                res.write("<br><br><a href='/public/login.html'>다시로그인하기</a>");
                res.end();
            }
        });
        
    }
    else{
        res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>데이터 베이스 연결 실패</h2>');
        res.write('<div><p>데이터베이스에 연결하지 못했습니다.</p></div>');
        res.end();
    }
});

//사용자 추가 라우팅
router.route('/process/adduser').post((req,res)=>{
    console.log('/process/adduser 호출됨');

    let paramId = req.body.id || req.query.id;
    let paramPassword = req.body.password || req.query.password;
    let paramName = req.body.name || req.query.name;

    console.log('요청 파라미터 : ' + paramId + ' , ' + paramPassword + ' , ' + paramName);

    if(database){
        addUser(database,paramId,paramPassword,paramName,(err,result)=>{
            if(err) {throw err;}

            if(result&&result.insertedCount>0){
                console.dir(result);

                res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
                
                res.write('<h1>사용자 추가 성공</h1>');
                res.end();
            }
            else{
                res.writeHead('200',{'Content-Type':'text/html;charset:=utf8'});
                res.write('<h1>사용자 추가 실패</h1>');
                res.end();
            }

        });
    }
    else{
        res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
        res.write('<h1>데이터베이스 연결 실패</h1>');
        res.end();
    }
});

//라우터 사용
app.use('/',router);



//errorHandler를 통해 에러 404페이지로 이동
let errorHandler_404 = expressErrorHandler({
    static:{
        '404': './public/404.html'
    }
});

//errorHandler 사용
app.use(expressErrorHandler.httpError(404));
app.use(errorHandler_404);

//서버 구동
http.createServer(app).listen(app.get('port'),()=>{
    console.log('서버가 시작되었습니다. port : ' + app.get('port'));

    //서버생성시 DB구동
    connectDB();
})