console.log("11");

var path = require('path');

console.log("22");
//디렉터리 이름 합치기
var directories = ['users',"mike","docs"];
var docsDirectory = derectories.join(path.sep);
console.log('문서 디렉터리 : %s',docsDirectory);

//디렉터리 이름과 파일 이름 합치기
var curPath = path.join('/Users/mike','notepad.exe');
console.log('파일패스 : %s',curPath);

var filename = "C:\\Users\\mike\\notepad.exe";
var dirname = path.dirname(filename);
var basename = path.basename(filename);
var extname = path.extname(filename);

console.log('디렉터리 : %s, 파일 이름 : %s, 확장자 : %s ', dirname,basenname, extname);