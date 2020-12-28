const http = require('http');
const OpenApiValidator = require('express-openapi-validator');
const bodyParser = require('body-parser');
const logger = require('morgan');
const path = require('path');

function errorHandler(error, req, res, next) {
    if (res.headersSent) { // important to allow default error handler to close connection if headers already sent
        return next(error);
    }
    if (error) {
        res.status(error.status || 500).json({
            message: error.message,
            errors: error.errors,
        });
        console.error(`Error: ${error.message}`);
        console.error(error);
    } else {
        next(error);
    }
}

async function configure(app, apiSpec, port) {
    app.use(bodyParser.json());
    app.use(logger('dev'));

    const openApiValidator = OpenApiValidator.middleware({
        apiSpec,
        operationHandlers: path.join(__dirname, '../../interfaces'),
        validateRequests: true,
        validateFormats: 'full',
        coerceTypes: false
    });
    app.use(openApiValidator);

    app.use(errorHandler);

    http.createServer(app).listen(port);

    return app;
}

module.exports = {
    configure: configure
}