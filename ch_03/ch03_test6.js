let Person = {};

Person['age'] = 20;
Person['name'] = '소녀시대';

let oper = (a,b) => {
    return a+b;
};

Person['add'] = oper;

console.log('더하기 : %d',Person.add(10,10));