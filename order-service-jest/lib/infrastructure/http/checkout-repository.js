
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
            
        return await response.json();
    }
}

module.exports = {
    CheckoutRepository
};