function Person(name,age) {
    this.name = name;
    this.age = age;
}

Person.prototype.walk = (speed)=>{
    console.log(speed + ' km의 속도로 걸어갑니다.');
}

let person01 = new Person('소녀시대',20);
let person02 = new Person('걸스데이',22);

console.log(person01.name + '객체의 walk(10)을 호출합니다.');
person01.walk(10);