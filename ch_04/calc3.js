const util = require('util');
const EventEmitter = require('events').EventEmitter;

let Calc = function() {
    const self = this;
    this.on('stop',()=>{
        console.log('Calc에 stop event 전달됨.');
    });
};

util.inherits(Calc,EventEmitter);

Calc.prototype.add = (a,b) => a+b;

module.exports = Calc;
module.exports.title = 'calculator';

//export default Calc;