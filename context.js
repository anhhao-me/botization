const vm = require('vm');
const logger = require('./logger');
const cron = require('node-cron');
const unirest = require('unirest');
const { URL } = require('url');
const crypto = require('crypto');

module.exports = name => {
  const context = vm.createContext({
    _crons: [],
    schedule(expression, fn){ 
      context._crons.push(cron.schedule(expression, () => {
        try {
          vm.runInContext(`(${fn.toString()})()`, context);
        } catch(err){
          logger.error(err);      
        }
      }));
    },
    log(msg){
      if (msg instanceof Error){
        logger.error(`${name} - ${msg.message}`);
        return;
      }

      if (typeof msg === 'object'){
        logger.info(`${name} - ${JSON.stringify(msg, 0, 2)}`);
        return;  
      }

      logger.info(`${name} - ${msg}`);
    },
    get: unirest.get,
    URL,
    hash(text){
      const al = crypto.createHash('sha256');
      al.update(text);
      return al.digest('hex');
    }
  });

  return context;
}