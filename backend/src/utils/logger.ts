import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const transport = new DailyRotateFile({
  filename: 'logs/security-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '14d'
});

export const logger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    transport,
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});