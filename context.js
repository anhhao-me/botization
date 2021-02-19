const vm = require('vm');
const logger = require('./logger');
const cron = require('node-cron');
const unirest = require('unirest');

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
      logger.info(`${name} - ${msg}`);
    },
    get: unirest.get
  });

  return context;
}