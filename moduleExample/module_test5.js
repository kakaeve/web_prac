const user = require('./user5');

let showUser = ()=>{
    return user.getUser().name + ' , ' + user.group.name;
}
//exports의 그룹은 무시됨.
console.log('사용자 정보 : %s',showUser());
