let Person = {};

Person['age'] = 20;
Person['name'] = '소녀시대';
Person.add =  (a,b) => {
    return a+b;
};
console.log('더하기 : %d', Person.add(10,10));