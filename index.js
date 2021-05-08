require('dotenv').config();

const load = require('./src/load');
const sandbox = require('./src/sandbox');
const logger = require('./src/logger');
const manageState = require('./src/state');
const Report = require('./src/report');
const Server = require('./src/server');

const { BOT_DIR, PORT } = process.env;
const server = Server(PORT);
const bots = load(BOT_DIR).map(sandbox);

const onStateChange = manageState(bots, Report(server));

module.exports = {
  async start(){
    for (let bot of bots){
      try {
        await bot.start(onStateChange, server);
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