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
      describe('And there is a valid order waiting for checkout', () => {          
        beforeAll(() => {
          provider.addInteraction({
            state: `there is an order with ID ${orderId} ready for checkout`,
            uponReceiving: `a request to start the checkout for the order ${orderId} `,
            withRequest: {
              path: `/orders/${orderId}/checkout`,
              method: 'POST'
            },
            willRespondWith: {
              body: {
                  customerId: Matchers.like('1234'),
                  orderId: orderId,
                  status: 'created'
              },
              headers: { 'Content-Type': 'application/json; charset=utf-8' },
              status: 200
            }
          });            
        });
        
        it('will create checkout', async () => {          
          const checkout = await checkoutRepository.createCheckout(orderId);
          expect(checkout.orderId).toEqual(orderId);
        });
      });

      describe('And there is not a valid order waiting for checkout', () => {          
        beforeAll(() => {
          provider.addInteraction({
            state: 'there is not any order ready for checkout',
            uponReceiving: `a request to start the checkout for the order ${orderId} `,
            withRequest: {
              path: `/orders/${orderId}/checkout`,
              method: 'POST'
            },
            willRespondWith: {
              status: 404
            }
          });            
        });
        
        it('will report an error for the checkout process', async () => {          
          try { 
            await checkoutRepository.createCheckout(orderId);
            fail('Should trhow an error');
          } catch (e) {
            expect(e).toEqual(Error(`Error processing checkoout for order ${orderId}`));
          }
        });
      });
    });    
});