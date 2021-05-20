
const fetch = require('node-fetch');

class CheckoutRepository {

    constructor() {
        this.checkoutURL = process.env.CHECKOUT_URL || 'http://localhost:3001';

    }

    async createCheckout (orderId) {
        const response = await fetch(`${this.checkoutURL}/orders/${orderId}/checkout`, {
            method: 'post',
            body: ''
        });
        
        if (response.status === 200) {
            return await response.json();
        }
        else {
            throw new Error(`Error processing checkoout for order ${orderId}`);
        }
    }
}

module.exports = {
    CheckoutRepository
};