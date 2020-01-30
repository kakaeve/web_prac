//import * as clac2 from "./calc2";

var calc = require('./calc');

import "calc2";

//import * as calc2 from './calc2';

console.log('모듈로 분리한 후 - calc.add 함수 호출 결과 : %d', calc.add(10,10));

//import {add} from './calc2';



console.dir(calc);
console.dir(calc2);

console.log('모듈로 분리한 후 - calc2.add 함수 호출 결과 : %d ',calc2.add(10,10));
console.log('모듈로 분리한 후 - calc2.add 함수 호출 결과 : %d ',add(10,10));