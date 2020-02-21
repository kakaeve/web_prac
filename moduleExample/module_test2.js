const user = require('./user2');

console.dir(user);

let showUser = ()=>{
    return user.getUser().name + ', ' + user.group.name;
}

console.log(showUser());

//exports객체를 새로 만들면 전역exports가 아닌 지역 exports가 됨. 