const fs = require('fs');
const moment = require('moment');

let lastOutput = [];
let isReport = false;

module.exports = server => {
  server.on('connection', socket => {
    socket.emit('report', lastOutput);
  });

  setInterval(() => {
    if (!isReport)
      return;

    server.io.emit('report', lastOutput);
    isReport = false;
  }, 1000);

  return output => {
    isReport = true;
    lastOutput = output;

    fs.writeFileSync('./.report', 
      output.map(item => `${item.name}\t\t: ${item.state} [${moment(item.updatedAt).format('YYYY-MM-DD HH:mm:ss')}]`)
      .join('\n')
    );
  }
}