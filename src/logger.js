const { format, transports, createLogger } = require('winston');
const { LOG_PATH } = process.env;

const trs = [
  new transports.Console()
]

if (LOG_PATH)
  trs.push(new transports.File({ filename: LOG_PATH }))


const logger = createLogger({
  format: format.simple(),
  defaultMeta: { service: 'botization' },
  transports: trs
});

module.exports = logger;