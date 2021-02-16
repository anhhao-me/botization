const vm = require('vm');
const logger = require('./logger');
const cron  = require('node-cron');

module.exports = () => {
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
    log: logger.info
  });

  return context;
}