//비밀번호 암호화 테스트

//모듈
const mongodb = require('mongodb');
const mongoose = require('mongoose');

//crypto 모듈
const crypto = require('crypto');

//디비 연결
let database;
let UserSchema;
let UserModel;

//데이터베이스에 연결하고 응답 객체의 속성으로 db추가
let connectDB = ()=>{
    let databaseUrl = "mongodb://localhost:27017/local";

    //데이터베이스 연결
    mongoose.connect(databaseUrl);
    database = mongoose.connection;

    database.on('error',console.error.bind(console, 'mongoose connection error.'));
    database.on('open',()=>{
        console.log('데이터베이스에 연결했습니다. : '+ databaseUrl);

        createUserSchema();

        doTest();
    });
    database.on('disconnected',connectDB);
}

let createUserSchema = ()=>{
    //스키마 정의

    UserSchema = mongoose.Schema({
        id : {type:String, required : true,unique:true},
        name : {type:String,index:'hashed','default':''},
        age : {type: Number,'default':-1},
        create_at : {type:Date,index:{unique:false},'default':Date.now},
        update_at : {type:Date,index:{unique:false},'default':Date.now}
    });

    //info 정의
    UserSchema.virtual('info').set(function(info){
        let splitted = info.split(' ');
        this.id = splitted[0];
        this.name = splitted[1];
        //this가 mongoose.model("users4",UserSchema);이걸 가르켜야 하는데 모르겠다 으아아ㅏ 일단 애로우 취소함 바인드 새로 알아볼것!
        console.log('virtual info 설정함 : %s %s', this.id,this.name);
    }).get(()=>{
        return this.id + ' ' + this.name;
    });

    console.log('UserSchema 정의함');
    UserModel = mongoose.model("users4",UserSchema);
    
    console.log("UserModel 정의함");
}

let doTest = ()=>{
    //UserModel 인스턴스 생성

    let user = new UserModel({"info" : 'test01 소녀시대'});
    //console.log(user.get());

    //저장
    user.save((err)=>{
        if(err) {throw err;}

        console.log("사용자 데이터 추가함.");
        
        findAll();
    }); 

    console.log("info 속성에 값 할당.");
    console.log('id: %s, name: %s',user.id,user.name);
}

let findAll = ()=>{
    UserModel.find({},(err,results)=>{
        if(err) {throw err;}

        if(results){
            console.log('조회된 user 문서 객체 #0 -> id : %s, name: %s',
                        results[0]._doc.id,results[0]._doc.name);
        }
    });
}

connectDB(); 


