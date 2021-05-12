const vm = require('vm');
const logger = require('./logger');
const cron = require('node-cron');
const unirest = require('unirest');
const { URL } = require('url');
const crypto = require('crypto');
const moment = require('moment');

module.exports = (name, server) => {
  const lastReport = {};
  server.on('connection', socket => {
    for (let key in lastReport)
      socket.emit('report', lastReport[key]);
  });

  const context = vm.createContext({
    // system methods
    _crons: [],
    setState: new Function(),
    schedule(expression, fn){ 
      const wrappedFn = async () => {
        setState('running');
        try {
          // replaced code
        } catch(err){
          log(err.stack, 'error');
          setState('s-error');
          return;
        }
        setState('idle');
      }

      const code = wrappedFn
      .toString()
      .replace('// replaced code', `await (${fn.toString()})();`);

      context._crons.push(cron.schedule(expression, () => {
        vm.runInContext(`(${code})()`, context);
      }));
    },
    log(msg, type = 'info'){ 
      if (msg instanceof Error){
        type = 'error';
        msg = msg.message;
        return;
      }

      if (typeof msg === 'object'){
        msg = JSON.stringify(msg, 0, 2);
      }

      logger[type](`${name} > ${msg}`);
    },
    report(r){
      lastReport[r.id] = Object.assign({}, {
        type: 'raw',
        updatedAt: new Date()
      }, r);
      
      server.io.emit('report', lastReport[r.id]);
    },
    // http methods
    get: unirest.get,
    http: unirest,
    URL,
    // crypto methods
    hash(text){
      const al = crypto.createHash('sha256');
      al.update(text);
      return al.digest('hex');
    },
    // utils
    moment
  });

  return context;
}