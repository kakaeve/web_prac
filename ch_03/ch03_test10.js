let Users = [{name:'소녀시대',age : 20},{name:'걸스데이',age:22},{name:'티아라',age:20}];

console.log('배열 요수의 수 : %d',Users.length);
for(let i=0;i<Users.length;i++){
    console.log('배열 요소 #'+ i + ' : %s',Users[i].name);
}

console.log('\nforEach 구문 사용하기');
Users.forEach((item,index)=>{
    console.log('배열 요소 #'+ index + ' : %s',item.name);
})