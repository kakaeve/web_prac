class User{
    constructor(id,name){
        this.id = id;
        this.name = name;
        this.group = {id: 'group01',name:'친구'}
        //class의 멤버변수는 constructor 안에서
    }
    getUser(){
        return {id:this.id,name:this.name};
    }
    printUser(){
        console.log('user이름 : %s, group이름 : %s',this.name,this.group.name);
    }
}

exports.User = User;