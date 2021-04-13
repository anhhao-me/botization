const vm = require('vm');
const createContext = require('./context');

module.exports = bot => {
  bot.start = function(onStateChange = new Function()){
    // state management
    this._state = 'preparing';
    Object.defineProperty(this, 'state', {
      get(){
        return this._state;
      },
      set(value){
        this._state = value;
        onStateChange(this);
      }
    });
    this.state = 'running';

    // context in bot
    const context = createContext(this.name);
    context.setState = state => this.state = state;
    this.context = context;

    // run
    try {
      const script = new vm.Script(this.content);
      this.script = script;
      script.runInContext(context);
    } catch(err){
      context.log(err.stack, 'error');
      this.stop();
      this.state = 'm-error';
      return;
    }

    // if schedule
    if (!bot.context._crons.length)
      this.state = 'stopped';
    else
      this.state = 'idle';
  }
  
  bot.stop = function(){
    for (let cron of bot.context._crons){
      cron.destroy();
    }
  }

  return bot;
}