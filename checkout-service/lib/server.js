const express = require('express');
const http = require('http');

const server = express();

server.post('/orders/:orderId/checkout', (req, res, next) => {
    res.send({
        customerId: '123456789',
        orderId: req.params.orderId,
        status: 'created'
    });
});

module.exports = {
    startServer: (port, cb) => {
        http.createServer(server).listen(port, cb);
    }
};
  