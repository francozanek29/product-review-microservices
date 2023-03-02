import { existsSync, mkdirSync } from 'fs';
import { Logger, createLogger, LoggerOptions, format, transports } from 'winston';

const logDir = 'logs';
const level = 'debug';

if (!existsSync(logDir)) {
  mkdirSync(logDir);
}

const outputFormat = (info: any) => `${info.timestamp} ${info.level}: ${info.message}`;

const options: LoggerOptions = {
  level,
  exitOnError: false,
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(outputFormat)
  ),
  transports: [new transports.Console()],
};

const logger: Logger = createLogger(options);

export default logger;