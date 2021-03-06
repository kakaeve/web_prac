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
//mongoose 모듈 불러오기
const mongoose = require('mongoose');

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

//mongoose 유저 스키마
let UserSchema;

//유저 모델
let UserModel;

//데이터베이스 연결
let connectDB = ()=>{
    //연결 정보 mongodb://IP정보:port/DB이름
    let databaseUrl = 'mongodb://localhost:27017/local';

    //데이터베이스 연결
    console.log('데이터베이스 연결을 시도합니다.');
    mongoose.Promise = global.Promise;
    //워닝때문에 뒤에 부분 추가
    mongoose.connect(databaseUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    database = mongoose.connection;

    database.on('error',console.error.bind(console,'mongoose connection error.'));
    database.on('open',()=>{
        console.log('데이터베이스에 연결되었습니다. : ' + databaseUrl);

        //스키마 정의
        UserSchema = mongoose.Schema({
            id: {type:String,required:true,unique:true},
            name: {type:String,index:'hashed'},
            password: {type:String,required:true},
            age: Number,
            created_at: {type:Date,index:{unique:false,expire:'1d'}},
            updated_at: Date
        });
        console.log('UserSchema 정의함.');

        //모델 정의
        UserModel = mongoose.model("users",UserSchema);
        console.log('UserModel 정의함.');
    });

    //연결 끊어지면 5초 후 재연결
    database.on('disconnected',()=>{
        console.log('연결이 끊어졌습니다. 5초 후 다시 연결합니다.');
        setInterval(connectDB,5000);
    });
}

//유저 아이디 비교 authUser 함수 생성
let authUser = (database,id,password,callback)=>{
    console.log('authUser 호출됨 : ' + id + ' , ' + password);
    
    //find()함수로 찾기 객체를 넘겨주면 찾음
    UserModel.find({"id":id,"password":password},(err,results)=>{
        if(err){
            callback(err,null);
            return;
        }

        console.log('아이디 [%s], 비밀번호 [%s]로 사용자 검색 결과',id,password);
        console.dir(results);

        if(results.length>0){
            console.log('일치하는 사용자 찾음 : ', id, password);
            callback(null,results);
        }else{
            console.log('일치하는 사용자를 찾지 못함');
            callback(null,null);
        }
    });
};
//유저 추가
let addUser = (database,id,password,name,callback)=>{
    console.log('addUsers 호출됨 : ' + id + ' , ' + password + ' , ' + name);

    //UserModel 인스턴스 생성
    let user = new UserModel({"id":id,"password":password,"name":name});

    //.save()로 저장
    user.save((err)=>{
        if(err){
            callback(err,null);
            return;
        }
        console.log("사용자 데이터 추가함");
        callback(null,user);
    });  
};

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
                res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
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