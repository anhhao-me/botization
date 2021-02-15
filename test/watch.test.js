const fs = require('fs');
const path = require('path');
const { expect } = require('chai');

const Watch = require('../watch');

describe('Watch test', () => {
  const DIR = path.join(__dirname, './tmp');
  let watcher;

  beforeEach(() => {
    if (fs.existsSync(DIR))
      fs.rmSync(DIR, { recursive: true });

    fs.mkdirSync(DIR);
    watcher = Watch(DIR);
    watcher.load();
  });

  afterEach(() => {
    fs.rmSync(DIR, { recursive: true });
    watcher.close();
  });

  it('should watch dir sucessfully', async () => {
    expect(watcher).to.has.property('files');
  });

  it('should handle new file was added', (done) => {
    const fileName = 'foo.txt';

    watcher.on('create', name => {
      expect(name, fileName);
      done();
    });

    fs.writeFileSync(path.join(DIR, fileName), 'log("bar")');
  });

  it('should handle file was changed', (done) => {
    const fileName = 'foo.txt';
    const ws = fs.createWriteStream(path.join(DIR, fileName));

    watcher.on('create', name => {
      expect(name, fileName);
      ws.write('log("change");');
    });

    watcher.on('change', name => {
      expect(name, fileName);
      ws.close();
      done();
    });

    ws.write('log("bar");\n');
  }).timeout(10000);

  it('should handle file was removed', (done) => {
    const fileName = 'foo.txt';

    watcher.on('create', name => {
      fs.rmSync(path.join(DIR, fileName));
      expect(name, fileName);
    });

    watcher.on('remove', name => {
      expect(name, fileName);
      done();
    });

    fs.writeFileSync(path.join(DIR, fileName), 'log("bar")');
  });

  it('should handle two new file was added', (done) => {
    const fileName1 = 'foo.txt';
    const fileName2 = 'bar.txt';

    watcher.on('create', name => {
      if (name === fileName2){
        done();
        return;
      }

      fs.writeFileSync(path.join(DIR, fileName2), 'log("bar")');
    });

    fs.writeFileSync(path.join(DIR, fileName1), 'log("bar")');
  });
});