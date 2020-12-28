const path = require('path')
const { Verifier, Matchers } = require('@pact-foundation/pact');
const { startServer } = require('../../lib/index')

describe('When the Checkout API is called', () => {          
    let pactVerifier;
    let server;

    beforeAll((done) => {    
        pactVerifier = new Verifier({
            providerBaseUrl: 'http://localhost:8080',
            pactUrls: [path.resolve(__dirname, '../../../order-service/pact/pacts/orderservice-checkoutservice.json')],
        });
    
        startServer(8080, (s) => {
            server = s;
            done();
        })    
    });

    afterAll(() => {
        server.close();
    })

    it('will create checkout for valid requests', async () => {          
        await pactVerifier.verifyProvider();
    });
});
