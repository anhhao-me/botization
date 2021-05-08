const http = require('http');
const fs = require('fs');
const path = require('path');

module.exports = PORT => {
  const _event = {};

  const server = http.createServer((_, res) => {
    res.writeHead(200);
    res.write(fs.readFileSync(path.join(__dirname, '../public/index.html')));
    res.end();
  });

  const io = require('socket.io')(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', socket => {
    if (!_event['connection']){
      _event['connection'] = [];
    }

    for (let event of _event['connection']){
      event(socket);
    }
  });

  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  return {
    io,
    on: (name, fn) => {
      if (!_event[name])
        _event[name] = []
      _event[name].push(fn);
    }
  }
}