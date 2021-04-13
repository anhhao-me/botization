require('dotenv').config();

const load = require('./src/load');
const sandbox = require('./src/sandbox');
const logger = require('./src/logger');
const manageState = require('./src/state');
const Report = require('./src/report');
const Server = require('./src/server');

const { BOT_DIR, PORT } = process.env;
const bots = load(BOT_DIR).map(sandbox);

const onStateChange = manageState(bots, Report(Server(PORT)));

module.exports = {
  async start(){
    for (let bot of bots){
      try {
        await bot.start(onStateChange);
      } catch(err){
        logger.error(err);
      }
    }
  },

  async stop(){
    for (let bot of bots){
      try {
        await bot.stop();
      } catch(err){
        logger.error(err);
      }
    }

    process.exit(1);
  }
}

if (require.main === module) {
  module.exports.start();
}