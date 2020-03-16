const require = path=>{
    let exports = {
        getUser : ()=>{
            return {id:'test01',name:'소녀시대'};
        },
        group : {id:'group01',name:'친구'}
    }

    return exports;
}

let user = require('...');

let showUser = ()=>{
    return user.getUser().name + ' , '+ user.group.name;
}

console.log('사용자 정보 : %s',showUser());