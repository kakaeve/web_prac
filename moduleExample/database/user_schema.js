//crypto 모듈 불러오기
const crypto = require('crypto');

//mongoose 유저 스키마
let Schema = {};

Schema.createSchema = mongoose =>{
    //스키마 정의
    let UserSchema = mongoose.Schema({
        id: { type: String, required: true, unique: true, 'default': '' },
        hashed_password: { type: String, required: true, 'default': '' },
        salt: { type: String, required: true },
        name: { type: String, index: 'hashed', 'default': ' ' },
        age: { type: Number, 'default': -1 },
        created_at: { type: Date, index: { unique: false }, 'default': Date.now },
        updated_at: { type: Date, index: { unique: false }, 'default': Date.now }
    });

    //password를 virtual로 주기
    UserSchema
        .virtual('password')
        .set(function (password){
            this._password = password;
            console.log(this === UserSchema);
            console.log(this === UserModel);
            this.salt = this.makeSalt();
            this.hashed_password = this.encryptPassword(password);
            console.log('virtual password 호출됨 : ' + this.hashed_password);
        })
        .get(function(){ return this._password });
    //비밀번호 암호화
    UserSchema.method('encryptPassword', function(plainText, inSalt){
        if (inSalt) {
            return crypto.createHmac('sha1', inSalt).update(plainText).digest('hex');
        }
        else {
            return crypto.createHmac('sha1', this.salt).update(plainText).digest('hex');
        }
    });
    //Salt만드는 메소드
    UserSchema.method('makeSalt', () => {
        return Math.round((new Date().valueOf() + Math.random())) + '';
    });
    //인증 비교해서 참 거짓 
    UserSchema.method('authenticate', function(plainText, inSalt, hashed_password){
        if (inSalt) {
            console.log('authenticate 호출됨 : %s -> %s : %s', plainText,
                this.encryptPassword(plainText, inSalt), hashed_password);
            return this.encryptPassword(plainText, inSalt) === hashed_password;
        }
        else {
            console.log('authenticate 호출됨 : %s -> %s : %s', plainText,
                this.encryptPassword(plainText), this.hashed_password);
            return this.encryptPassword(plainText) === hashed_password;
        }
    });
    UserSchema.static('findById', (id, callback) => {
        return UserModel.find({ id: id }, callback);
    });

    UserSchema.static('findAll', (callback) => {
        return UserModel.find({}, callback);
    });
    UserSchema.path('id').validate(id => {
        return id.length;
    }, 'id 값이 없습니다.');
    UserSchema.path('name').validate(name => {
        return name.length;
    }, 'name 값이 없습니다.');

    console.log('UserSchema 정의함.');

    return UserSchema;
}

module.exports = Schema;