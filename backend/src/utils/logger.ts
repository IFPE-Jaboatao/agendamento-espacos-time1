import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';


const isProduction = process.env.NODE_ENV === 'production';
const logLevel = isProduction ? 'warn' : 'debug';

const fileFormat = winston.format.combine(
  winston.format.timestamp(),         
  winston.format.errors({ stack: true }), 
  winston.format.json()               
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),          
  winston.format.timestamp({ format: 'HH:mm:ss' }), 
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
    return `[${timestamp}] ${level}: ${message} ${metaStr}`;
  })
);

const appTransport = new DailyRotateFile({
  filename: 'logs/app-%DATE%.log',    
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',                     
  maxFiles: '14d',                    
  level: 'info',                      
  format: fileFormat
});

const errorTransport = new DailyRotateFile({
  filename: 'logs/error-%DATE%.log',  
  datePattern: 'YYYY-MM-DD',
  maxSize: '10m',
  maxFiles: '30d',                    
  level: 'error',                     
  format: fileFormat
});

const consoleTransport = new winston.transports.Console({
  format: consoleFormat,
  silent: isProduction               
});

export const logger = winston.createLogger({
  level: logLevel,                   
  transports: [
    appTransport,                    
    errorTransport,                  
    consoleTransport                 
  ],

  // Captura exceções não tratadas 
  exceptionHandlers: [
    new DailyRotateFile({
      filename: 'logs/exceptions-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '30d'
    })
  ],

  // Captura Promise rejeitadas sem .catch()
  rejectionHandlers: [
    new DailyRotateFile({
      filename: 'logs/rejections-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '30d'
    })
  ]
});