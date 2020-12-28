const { pactWith } = require('jest-pact');
const { Pact, Matchers } = require('@pact-foundation/pact');
const { CheckoutRepository } = require('../../../../lib/infrastructure/http/checkout-repository'); 

const pactConfig = {
  port: 3001,
  consumer: 'OrderService',
  provider: 'CheckoutService'
};
pactWith(pactConfig, provider => {
    const checkoutRepository = new CheckoutRepository();
    const orderId = '1234';

    describe('When the Checkout API is called', () => {          
        beforeAll(() => {
          provider.addInteraction({
            state: 'there is an order ready for checkout',
            uponReceiving: 'a request to start a checkout',
            withRequest: {
              path: `/orders/${orderId}/checkout`,
              method: 'POST'
            },
            willRespondWith: {
              body: {
                  customerId: Matchers.like('1234'),
                  orderId: Matchers.like(orderId),
                  status: Matchers.string('created')
              },
              headers: { 'Content-Type': 'application/json; charset=utf-8' },
              status: 200
            }
          });            
        });

        it('will create checkout for valid requests', async () => {          
            const checkout = await checkoutRepository.createCheckout(orderId);
            expect(checkout.orderId).toEqual(orderId);
        });
    });
});