let output = '안녕 1!';
let buffer1 = new Buffer(10);
let len = buffer1.write(output,'utf8');
console.log('첫 번째 버퍼의 문자열 : %s',buffer1.toString());

let buffer2 = new Buffer('안녕 2!','utf8');
console.log('두 번째 버퍼의 문자열 : %s',buffer2.toString());

console.log('버퍼의 객체 타입 : %s',Buffer.isBuffer(buffer1));


let byteLen = Buffer.byteLength(output);
let str1 = buffer1.toString('utf8',0,byteLen);
let str2 = buffer2.toString('utf8');

buffer1.copy(buffer2,0,0,len);
console.log('두 번재 버퍼에 복사한 후의 문자열 : %s',buffer2.toString('utf8'));

let buffer3 = Buffer.concat([buffer1,buffer2]);
console.log('두 개의 버퍼를 붙인 후의 문자열 : %s',buffer3.toString('utf8'));