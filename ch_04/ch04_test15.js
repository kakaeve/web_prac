const winston = require('winston');
const winstonDaily = require('winston-daily-rotate-file');
const moment = require('moment');

let timeStampFormat = ()=>{
    return moment().format('YYYY-MM-DD HH:mm:ss.SSS ZZ');

};

let logger = new (winston.Logger)({
    transports:[
        new (winstonDaily)({
            name: 'info-file',
            dataPatten: './log/server',
            colorize: false,
            maxsize: 50000000,
            maxFiles: 1000,
            level: 'info',
            showLevel: true,
            json: false,
            timestamp: timeStampFormat
        }),
        new (winston,transports.Console)({
            name: 'debug-console',
            colorize: true,
            level: 'debug',
            showLevel: true,
            json: false,
            timestamp: timeStampFormat
        })
    ],
    exceptionHandlers:[
        new (winstonDaily)({
            name: 'exception-file',
            filename: './log/exception',
            dataPatten: '_yyy-MM-dd.log',
            colorize: false,
            maxsize: 50000000,
            maxFiles: 1000,
            level: 'error',
            showLevel: 'true',
            json: false,
            timestamp: timeStampFormat
        }),
        new (winston.transports.Console)({
            name: 'exception-console',
            colorize: true,
            level: 'debug',
            showLevel: true,
            json: false,
            timestamp:timeStampFormat
        })
    ]
});