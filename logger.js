const { format, transports, createLogger } = require('winston');
const { LOG_PATH } = process.env;

const logger = createLogger({
  format: format.simple(),
  defaultMeta: { service: 'botization' },
  transports: [
    new transports.Console(),
    new transports.File({ filename: LOG_PATH }),
  ]
});

module.exports = logger;