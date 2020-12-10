jest.mock('express');
jest.mock('../../lib/infrastructure/server/server');
jest.spyOn(global.console, 'log').mockImplementation(() => {});
jest.spyOn(global.console, 'error').mockImplementation(() => {});

const express = require('express');
const server = require('../../lib/infrastructure/server/server');
const flushPromises = () => new Promise(setImmediate);

describe('Index file', () => {
    
    beforeEach(() => {
        server.configure.mockClear();
        console.log.mockClear();
        console.error.mockClear();
    });
    
    it('should report errors when server fail to start', async () => {
        const error = new Error('Server error');
        server.configure.mockRejectedValue(error);
        let index;
        jest.isolateModules(() => {
            index = require('../../lib/index');
        });
        await flushPromises();
        expect(console.error).toBeCalledWith('Error starting server.');
        expect(console.error).toBeCalledWith(error);
    });

    it('should configure server correctly', async () => {
        const expressApp = jest.fn();
        const port = 3000;
        
        server.configure.mockResolvedValue('');
        express.mockReturnValue(expressApp);
        let index;
        jest.isolateModules(() => {
            index = require('../../lib/index');
        });
        await flushPromises();
        expect(server.configure).toBeCalledWith(expressApp, expect.stringMatching('open-api.yaml'), port);
        expect(console.log).toBeCalledWith(`Listening on port ${port}`);
        expect(index).toEqual(expressApp);
    });
});