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
    lastOutput = {
      id: 'bot-state',
      title: 'Bot State',
      type: 'table',
      columns: ['name', 'state', 'updated at'],
      data: output.map(item => ([ 
        item.name, 
        { 
          style: `font-weight: bold; color: ` + (
            item.state === 'm-error' ? '#c62828' 
            : item.state === 's-error' ? '#E91E63'
            : item.state === 'idle' ? '#2E7D32'
            : item.state === 'running' ? '#1565C0'
            : '#424242')
          ,
          text: item.state 
        }, 
        moment(item.updatedAt).format('MMM DD - HH:mm') 
      ]))
    };

    fs.writeFileSync('./.report', 
      output.map(item => `${item.name}\t\t: ${item.state} [${moment(item.updatedAt).format('YYYY-MM-DD HH:mm:ss')}]`)
      .join('\n')
    );
  }
}