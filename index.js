require('dotenv').config();

const debug = require('debug')('botization:index');
const vm = require('vm');
const fs = require('fs');
const path = require('path');
const cron  = require('node-cron');

const logger = require('./logger');
const Watch = require('./watch');
const { BOT_DIR } = process.env;

const watcher = Watch(BOT_DIR);
const bots = {};

const create = name => {
  debug(`Real create ${name}`);

  const bot = {};
  bots[name] = bot;

  const script = new vm.Script(fs.readFileSync(path.join(BOT_DIR, name)));
  bot.script = script;

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
  bot.context = context;
  
  try {
    script.runInContext(context);
  } catch(err){
    logger.error(err);
  }
}

const remove = name => {
  debug(`Real remove ${name}`);

  if (!bots[name])
    return;

  const bot = bots[name];
  for (let cron of bot.context._crons){
    cron.destroy();
  }

  delete bots[name];
}

watcher.on('create', name => {
  debug(`Create ${name}`);
  create(name);
});

watcher.on('change', name => {
  debug(`Change ${name}`);
  remove(name);
  create(name);
});

watcher.on('remove', name => {
  debug(`Remove ${name}`);
  remove(name);
});

watcher.load();