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
//mysql
const mysql = require('mysql');

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

//mysql 연결 설정
let pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'rmeofmfakssk.1A',
    database: 'test',
    debug: false
});

//database 객체 변수
let database;

//데이터베이스 연결
let connectDB = () => {
    //연결 정보 mongodb://IP정보:port/DB이름
    let databaseUrl = 'mongodb://localhost:27017/local';

    //데이터베이스 연결
    MongoClient.connect(databaseUrl, (err, db) => {
        if (err) throw err;

        console.log('데이터 베이스에 연결 되었습니다. :' + databaseUrl);

        //database 변수에 객체 할당 mongoDB 3.0이상에서는 db의 이름 지정
        database = db.db('local');
        //console.log(database);
    });
}

//유저 아이디 비교 authUser 함수 생성
let authUser = (id, password, callback) => {
    console.log('authUser 호출됨');

    pool.getConnection((err, conn) => {
        if (err) {
            if (conn) {
                conn.release();//반드시 해제
            }
            callback(err, null);
            return;
        }
        console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId);

        let colums = ['id', 'name', 'age'];
        let tablename = 'users';

        let exec = conn.query("select ?? from ?? where id = ? and password = ?",
            [colums, tablename, id, password], (err, rows) => {
                conn.release();//반드시 해제
                console.log('실행 대상 SQL : ' + exec.sql);

                if (rows.length > 0) {
                    console.log('아이디 [%s], 패스워드 [%s]가 일치하는 사용자 찾음.', id, password);
                    callback(null, rows);
                }
                else {
                    console.log('일치하는 사용자를 찾지 못함.');
                    callback(null, null);
                }
            });
        });
}
//유저 추가
let addUser = (id, name, age, password, callback) => {
    console.log('addUser 호출됨.');

    //커넥션 풀에 연결객체 가져옴
    pool.getConnection((err, conn) => {
        if (err) {
            if (conn) {
                conn.release();
            }

            callback(err, null);
            return;
        }
        console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId);

        let data = { id: id, name: name, age: age, password: password };
        //sql 쿼리문 실행
        let exec = conn.query('insert into users set ?', data, (err, result) => {
            conn.release();//반드시라는데 왜지?
            console.log('실행 대상 SQL : ' + exec.sql);

            if (err) {
                console.log('SQL 실행 시 오류 발생함.');
                console.dir(err);

                callback(err, null);

                return;
            }

            callback(null, result);
        });
    })

}

//router 객체
let router = express.Router();

//로그인 라우팅
router.route('/process/login').post((req, res) => {
    console.log('/process/login 호출됨');

    let paramId = req.body.id || req.query.id;
    let paramPassword = req.body.password || req.query.password;

    if (pool) {
        authUser(paramId, paramPassword, (err, rows) => {
            if (err) {
                console.log('사용자 로그인 중 오류 발생 : ' + err.stack);
                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h2>사용자 로그인 중 오류 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();
                return;
            }
            if (rows) {
                console.dir(rows);

                let username = rows[0].name;

                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h1>로그인 성공</h1>');
                res.write('<div><p>사용자 아이디 : ' + paramId + '</p></div>');
                res.write('<div><p>사용자 이름 : ' + username + '</p></div>');
                res.write("<br><br><a href='/public/login2.html'>다시로그인하기</a>");
                res.end();
            }
        })
    }
    else {
        res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
        res.write('<h2>데이터 베이스 연결 실패</h2>');
        res.write('<div><p>데이터베이스에 연결하지 못했습니다.</p></div>');
        res.end();
    }
});

router.route('/process/adduser').post((req, res) => {
    console.log('/process/adduser 호출됨.');

    let paramId = req.body.id || req.query.id;
    let paramPassword = req.body.password || req.body.password;
    let paramName = req.body.name || req.query.name;
    let paramAge = req.body.age || req.query.age;

    console.log('요청 파라미터 : ' + paramId + ', ' + paramPassword + ', ' + paramName + ', ' + paramAge);

    //커넥션 풀이 초기화 된 경우 adduser함수 호출하여 사용자 추가
    if (pool) {
        addUser(paramId, paramName, paramAge, paramPassword, (err, addedUser) => {
            //동일한 id로 추가할 때 오류 
            if (err) {
                console.log('사용자 추가 중 오류 발생 : ' + err.stack);

                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h2>사용자 추가 중 오류 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();

                return;
            }

            if (addedUser) {
                console.dir(addedUser);

                console.log('inserted ' + addedUser.affectedRows + ' rows');

                let insertId = addedUser.insertId;
                console.log('추가한 레코드의 아이디 : ' + insertId);

                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h2>사용자 추가 성공</h2>');
                res.end();
            }
            else {
                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h2>사용자 추가 실패</h2>');
                res.end();
            }
        });
    }
    else {
        res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.end();
    }
});

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
})