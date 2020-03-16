const user = require('./user3');

let showUser = ()=>{
    return user.getUser().name + ', ' + user.group.name;
}

console.log(showUser());
