const server  = require('./server');

server.start(3001, () => {
    console.log('server listenning on port 3001');
});