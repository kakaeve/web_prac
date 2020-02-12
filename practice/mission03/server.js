const express = require('express');
const http = require('http');


const bodyParser = require('body-parser');
const static = require('serve-static');

const multer = require('multer');
const fs = require('fs');

const cors = require('cors');

app.set('port',pocess.env.PORT||3000);

app.use(bodyParser.urlencoded({extended:false}));

app.use(bodyParser.json());

app.use('/save',static(path.join(__dirname,'save')));
app.use('/uploads',static(path.join(__dirname,'uploads')));

app.use(cors());

let memo_storage = multer.diskStorage({
    destination: (req,file,callback)=>{
        callback(null,'uploads')
    },
    filename : (req,file,callback)=>{
        callback(null,file.originalname + Date.now());
    }
});

let memo_uploads = multer({
    storage: memo_storage,
    limit: {
        files : 10,
        fileSize: 1024 * 1024 * 1024
    }
});

let router = express.Router();

router.route('/process/save').post(memo_uploads.array('memo',1),(req,res)=>{
    console.log('/process/save 호출됨');
    
    fs.writeFile(req.)

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