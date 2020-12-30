const { startServer }  = require('./server');

startServer(3001, () => {
    console.log('server listenning on port 3001');
});