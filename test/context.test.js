const { expect } = require('chai');
const createContext = require('../src/context');
const vm = require('vm');

describe('Context test', () => {
  let context;

  beforeEach(() => {
    context = createContext('test');
  });

  afterEach(() => {
    for (let cron of context._crons){
      cron.destroy();
    }
  });

  it('shoult create context', async () => {
    expect(Object.keys(context).length).to.be.not.equal(0);
  });

  it('should schedule', done => {
    context.done = () => done();
    vm.runInNewContext(`
      schedule('0,5,10,15,20,25,30,35,40,45,50,55 * * * * *', () => {
        done();
      });    
    `, context);
  }).timeout(10000);

  it('should schedule with error', done => {
    context.done = () => done();
    vm.runInNewContext(`
      schedule('0,5,10,15,20,25,30,35,40,45,50,55 * * * * *', () => {
        done();
        throw new Error("This is error");
      });    
    `, context);
  }).timeout(10000);
});