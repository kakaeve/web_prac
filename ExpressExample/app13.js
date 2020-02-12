const express = require('express');
const http = require('http');
const path = require('path');

const bodyParser = require('body-parser');
const static = require('serve-static');

const expressErrorHandler = require('express-error-handler');

const cookieParser = require('cookie-parser');
const expressSession = require('express-session');

const multer = require('multer');
const fs = require('fs');

const cors = require('cors');

let app = express();

app.set('port',process.env.PORT||3000);

app.use(bodyParser.urlencoded({extended:false}));

app.use(bodyParser.json());

app.use('/public',static(path.join(__dirname,'public')));
app.use('/uploads',static(path.join(__dirname,'uploads')));

app.use(cookieParser());

app.use(expressSession({
    secret:'my key',
    resave: true,
    saveUninitialized: true
}));

app.use(cors());

let storage = multer.diskStorage({
    destination: (req,file,callback)=>{
        callback(null,'uploads')
    },
    filename : (req,file,callback)=>{
        callback(null,file.originalname + Date.now());
    }
});

let uploads = multer({
    storage: storage,
    limit: {
        files : 10,
        fileSize: 1024 * 1024 * 1024
    }
});

let router = express.Router();

router.route('/process/photo').post(uploads.array('photo',1),(req,res)=>{
    console.log('/process/photo 호출됨.');


    try{
        let files = req.files;

        console.dir('#====업로드된 첫번째 파일 정보 ======#');
        console.dir(req.files[0]);
        console.dir('#=====#');

        let originalname ='',
        filename='',
        mimetype='',
        size = 0;

        if(Array.isArray(files)){
            console.log("배열에 들어가 있는 파일 갯수 : %d",files.length);

            for(let index = 0;index < files.length;index++){
                originalname = files[index].originalname;
                filename = files[index].filename;
                mimetype = files[index].mimetype;
                size = files[index].size;
            }
        }else{
            console.log("파일 갯수 : 1");

            originalname = files[index].originalname;
                filename = files[index].filename;
                mimetype = files[index].mimetype;
                size = files[index].size;
        }

        console.log('현재 파일 정보 : ' + originalname + ', ' + filename + ', ' + mimetype + ', ' + size);

        res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
        res.write('<h3>파일 업로드 성공</h3>');
        res.write('<hr/>');
        res.write('<p>원본 파일 이름 : ' + originalname + ' -> 저장 파일명 : ' + filename + '</p>');
        res.write('<p>MIME TYPE : ' + mimetype + '</p>');
        res.write('<p>파일 크기 : ' + size + '</p>');
        res.end();
    }catch(err){
        console.dir(err.stack);
    }
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

http.createServer(app).listen(3000,()=>{
    console.log('Express 서버가 3000번 포트에서 시작됨.');
});