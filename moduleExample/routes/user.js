let database;
let UserSchema;
let UserModel;

let init = (db,schema,model)=>{
    console.log('init 호출됨.');

    database = db;
    UserSchema = schema;
    UserModel = model;
    //console.dir(UserModel);
}

let login = (req,res)=>{
    console.log('/process/login 호출됨');

    let paramId = req.param('id');
    let paramPassword = req.param('password');

    if (database) {
        authUser(database, paramId, paramPassword, (err, docs) => {
            if (err) { throw err; }

            if (docs) {
                console.dir(docs);

                let username = docs[0].name;
                //res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h1>로그인 성공</h1>');
                res.write('<div><p>사용자 아이디 : ' + paramId + '</p></div>');
                res.write('<div><p>사용자 이름 : ' + username + '</p></div>');
                res.write("<br><br><a href='/public/login.html'>다시 로그인하기</a>");
                res.end();
            }
            else {
                //res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h1>로그인 실패</h1>');
                res.write('<div><p>아이디와 비밀번호를 확인하십시오.</p></div>');
                res.write("<br><br><a href='/public/login.html'>다시 로그인하기</a>");
                res.end();
            }
        });

    }
    else {
        res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
        res.write('<h2>데이터 베이스 연결 실패</h2>');
        res.write('<div><p>데이터베이스에 연결하지 못했습니다.</p></div>');
        res.end();
    }
};

let adduser = (req,res)=>{
    console.log('/process/adduser 호출됨');

    let paramId = req.body.id || req.query.id;
    let paramPassword = req.body.password || req.query.password;
    let paramName = req.body.name || req.query.name;

    console.log('요청 파라미터 : ' + paramId + ' , ' + paramPassword + ' , ' + paramName);

    if (database) {
        addUser(database, paramId, paramPassword, paramName, (err, result) => {
            if (err) { throw err; }

            if (result) {
                console.dir(result);

                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h1>사용자 추가 성공</h1>');
                res.end();
            }
            else {
                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h1>사용자 추가 실패</h1>');
                res.end();
            }

        });
    }
    else {
        res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
        res.write('<h1>데이터베이스 연결 실패</h1>');
        res.end();
    }
};

let listuser = (req,res)=>{
    console.log('/process/listuser 호출됨');

    //findAll() 함수 이용
    if (database) {
        console.log(UserModel);
        UserModel.findAll((err, results) => {
            if (err) {
                console.log('사용자 리스트 조회 중 오류 발생 : ', err.stack);

                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h2>사용자 리스트 조회 중 오류발생</h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();

                return;
            }
            //결과 객체 있으면 리스트 전송
            if (results) {
                console.dir(results);

                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h2>사용자 리스트</h2>');
                res.write('<div><ul>');

                for (let i = 0; i < results.length; i++) {
                    let curId = results[i]._doc.id;
                    let curName = results[i]._doc.name;
                    res.write(' <li>#' + i + ' : ' + curId + ' , ' + curName + ' </li>');
                }
                res.write('</ul></div>');
                res.end();
            }
            else {
                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h2>사용자 리스트 조회 실패</h2>');
                res.end();
            }
        });
    }
    else {
        res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
        res.write('<h1>데이터베이스 연결 실패</h1>');
        res.end();
    }
};

//사용자 인증함수 : 아이디로 먼저찾고 비밀번호 비교
let authUser = (database, id, password, callback) => {
    console.log('authUser 호출됨.');

    //아이디 이용
    UserModel.findById(id, (err, results) => {
        if (err) {
            callback(err, null);
            return;
        }

        console.log('아이디 [%s]로 사용자 검색 결과 : ', id);
        console.dir(results);

        if (results.length > 0) {
            console.log('아이디와 일치하는 사용자 찾음.');

            let user = new UserModel({ id: id });
            let authenticated = user.authenticate(password, results[0]._doc.salt, results[0]._doc.hashed_password);


            if (authenticated) {
                console.log('비밀번호 일치함');
                callback(null, results);
            }
            else {
                console.log('비밀번호 일치하지 않음');
                callback(null, null);
            }
        }
        else {
            console.log('아이디와 일치하는 사용자를 찾지 못함.');
            callback(null, null);
        }
    });

    //find()함수로 찾기 객체를 넘겨주면 찾음
    UserModel.find({ "id": id, "password": password }, (err, results) => {
        if (err) {
            callback(err, null);
            return;
        }

        console.log('아이디 [%s], 비밀번호 [%s]로 사용자 검색 결과', id, password);
        console.dir(results);

        if (results.length > 0) {
            console.log('일치하는 사용자 찾음 : ', id, password);
            callback(null, results);
        } else {
            console.log('일치하는 사용자를 찾지 못함');
            callback(null, null);
        }
    });
};
//유저 추가
let addUser = (database, id, password, name, callback) => {
    console.log('addUsers 호출됨.');

    //UserModel 인스턴스 생성
    let user = new UserModel({ "id": id, "password": password, "name": name });

    //.save()로 저장
    user.save((err) => {
        if (err) {
            console.log("사용자 데이터 실패함");
            callback(err, null);
            return; 
        }
        console.log("사용자 데이터 추가함");
        callback(null, user);
    });
};

module.exports.init = init;
module.exports.login = login;
module.exports.adduser = adduser;
module.exports.listuser = listuser;