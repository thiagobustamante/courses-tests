const path = require('path')
const { Verifier, Matchers } = require('@pact-foundation/pact');
const checkoutServer  = require('../../lib/server')
const version = require('../../package.json').version;

describe('When the Checkout API is called', () => {          
    let pactVerifier;
    let server;

    beforeAll((done) => {    
        pactVerifier = new Verifier({
            providerBaseUrl: 'http://localhost:8080',
            // pactUrls: [path.resolve(__dirname, '../../../order-service/pact/pacts/orderservice-checkoutservice.json')],
            pactBrokerUrl: 'http://localhost:9292',
            provider: 'CheckoutService',
            providerVersion: version,
            publishVerificationResult: true,
            stateHandlers: {
                'there is an order with ID 1234 ready for checkout': async () => {
                    checkoutServer.validOrders.add(1234);
                },
                'there is not any order ready for checkout': async () => {
                    checkoutServer.validOrders.clear();
                }
            }
        });
    
        checkoutServer.start(8080, (s) => {
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
