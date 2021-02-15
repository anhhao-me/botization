const fs = require('fs');
const path = require('path');
const debug = require('debug')('botization:watch');

module.exports = dir => {
  let isLoad = false;
  const files = [];
  const objs = [];
  const _event = {
    create: new Function(),
    remove: new Function(),
    change: new Function()
  };

  const fileChange = name => _ => {
    debug('Emit file change');
    _event['change'](name);
  }

  const loadFile = () => {
    const currentFiles = fs.readdirSync(dir);
    for (let file of currentFiles){
      if (files.indexOf(file) === -1){
        debug('Add new file');
        files.push(file);
        _event['create'](file);
        fs.watchFile(path.join(dir, file), fileChange(file));
      }
    }

    let i = 0;
    while (i < files.length){
      let file = files[i];
      if (currentFiles.indexOf(file) === -1){
        files.splice(i, 1);
        _event['remove'](file);
        fs.unwatchFile(path.join(dir, file));
        continue;
      }
      i++;
    }
  }

  const watcher = fs.watch(dir, (event) => {
    if (isLoad && event === 'rename')
      loadFile();
  });

  return {
    files,
    objs,
    on(name, fn){
      _event[name] = fn;
    },
    load(){
      isLoad = true;
      loadFile();
    },
    close(){
      for (let name of files){
        fs.unwatchFile(path.join(dir, name));
      }
      watcher.close();
    }
  }
}