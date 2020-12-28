const uuid = require('uuid').v4;
const { OrdersRepository } = require('../infrastructure/database/orders-repository');
const { CheckoutRepository } = require('../infrastructure/http/checkout-repository');

class Order {
    constructor(id) {
        if (!id) {
            id = uuid();
        }
        this._id = id;
        this._items = new Array();
        this.ordersRepository = new OrdersRepository();
        this.checkoutRepository = new CheckoutRepository();
    }

    get id() {
        return this._id;
    }

    get customerId() {
        return this._customerId;
    }

    set customerId(customerId) {
        this._customerId = customerId || undefined;
    }

    get items() {
        return this._items.slice();
    }

    addItem(item) {
        if (item && item.productId) {
            const existentItem = this._items.find(i => i.productId === item.productId);
            if (existentItem) {
                existentItem.amount += item.amount;
            } else {
                this._items.push(item);
            }
            return true;
        }
        return false;
    }

    updateItem(item) {
        let updated = false;
        if (item && item.productId) {
            const existentItem = this._items.find(i => i.productId === item.productId);
            if (existentItem) {
                existentItem.amount += item.amount;
                updated = true;
            }
        }
        return updated;
    }

    removeItem(productId) {
        let removed = false;
        if (productId) {
            const itemIndex = this._items.findIndex(i => i.productId === productId);
            if (itemIndex > -1) {
                this._items.splice(itemIndex, 1);
            }
        }
        return removed;
    }

    async save() {
        return this.ordersRepository.persist({
            id: this.id,
            customerId: this.customerId,
            items: this.items
        });
    }

    async load() {
        const orderData = await this.ordersRepository.load(this.id);
        this._items = orderData.items || [];
        this.customerId = orderData.customerId;
        return this;
    }

    async createCheckout() {
        return await this.checkoutRepository.createCheckout(this.id);
    }
}

module.exports = {
    Order
};