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

const user = require('./routes/user');


//익스프레스 생성
let app = express();

//port 설정
app.set('port', process.env.PORT || 3000);






//body parser 사용해 urlencoded 파싱
app.use(bodyParser.urlencoded({ extended: false }));

//body-parser 사용해 application/json 파싱
app.use(bodyParser.json());

//public 폴더 사용
app.use('/public', static(path.join(__dirname, 'public')));

//cookie-parser 사용
app.use(cookieParser());

//session 설정
app.use(expressSession({
    secret: 'my key',
    resave: true,
    saveUninitialized: true

}));

//database 객체 변수
let database;

let UserSchema;

//유저 모델
let UserModel;

//데이터베이스 연결
let connectDB = () => {
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

    database.on('error', console.error.bind(console, 'mongoose connection error.'));
    database.on('open', () => {
        console.log('데이터베이스에 연결되었습니다. : ' + databaseUrl);



        
        createUserSchema();

        
    });

    //연결 끊어지면 5초 후 재연결
    database.on('disconnected', () => {
        console.log('연결이 끊어졌습니다. 5초 후 다시 연결합니다.');
        setInterval(connectDB, 5000);
    });
}
let createUserSchema = ()=>{
    //user_schema.js 모듈 require
    UserSchema = require('./database/user_schema').createSchema(mongoose);

    //모델 정의
    UserModel = mongoose.model("users3", UserSchema);
    console.log('UserModel 정의함.');

    //user에서 사용하는것
    user.init(database,UserSchema,UserModel);

}




//router 객체
let router = express.Router();

//로그인 라우팅
router.route('/process/login').post(user.login);

//사용자 추가 라우팅
router.route('/process/adduser').post(user.adduser);

router.route('/process/listuser').post(user.listuser);


//라우터 사용
app.use('/', router);



//errorHandler를 통해 에러 404페이지로 이동
let errorHandler_404 = expressErrorHandler({
    static: {
        '404': './public/404.html'
    }
});

//errorHandler 사용
app.use(expressErrorHandler.httpError(404));
app.use(errorHandler_404);

//서버 구동
http.createServer(app).listen(app.get('port'), () => {
    console.log('서버가 시작되었습니다. port : ' + app.get('port'));

    //서버생성시 DB구동
    connectDB();
});