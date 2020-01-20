/**
 * Imports
 */
import Joi from 'joi';

import config from '../../config';
import log from './logging';
import {sanitizeEmailAddress, sendTemplate as sendEmailTemplate, EmailTemplate} from '../../core/email';
import {ErrorName} from '../../core/errors';
import {BadRequest} from '../../core/responses';
import {hasKeys} from '../../core/utils';
import {Cart} from '../carts/models';
import {isReady as isCheckoutReady} from '../checkouts/helpers';
import {Checkout} from '../checkouts/models';
import {CheckoutSerializer} from '../checkouts/serializers';
import {Order, OrderStatus, PaymentProvider} from './models';
import {OrderSerializer} from './serializers';

/**
 * API handler for Order collection endpoint
 */
class OrdersHandler {

    /**
     * Process GET request
     * Return the orders's collection
     */
    static async get(request, reply) {

        let filters = {};

        //
        // IMPORTANT:
        // Only authenticated Admins can see all orders.
        // >>> If user is not Admin, we should force User ID filtering! <<<
        //
        let isAdmin = request.auth.credentials && request.auth.credentials.scope && request.auth.credentials.scope.indexOf('admin') !== -1;
        if (!isAdmin) {
            filters.userId = request.auth.credentials.id;
        }

        //
        // Find and filter Orders collection
        //

        // IMPORTANT:
        // Only filter by userID if there isn't already one "locked" in the filter
        // >>> The user is NOT admin, thus, only his orders should be returned <<<
        if (!filters.userId && request.query.userId) {
            filters.userId = request.query.userId;
        } else if (request.query.userId && request.query.userId !== filters.userId) {
            return reply(BadRequest.invalidParameters('query', {userId: 'Invalid'})).code(400);
        }

        // Filter by opened/closed status
        let open = request.query.open;
        if (open) {
            open = open.toLowerCase();
            if (open !== 'true' && open !== 'false') {
                return reply(BadRequest.invalidParameters('query', {open: 'Must be a boolean'})).code(400);
            } else {
                filters.open = open === 'true';
            }
        }

        // Fetch orders
        let results = await Order.find(filters);

        // Serialize items
        let serializedItems = await * results.items.map(order => new OrderSerializer(order).serialize({}));

        //
        // Return
        //
        return reply({
            items: serializedItems,
            filters: filters,
            pagination: {
                totalItems: results.count,
                totalPages: null,
                perPage: null,
                page: null
            }
        });
    }

    /**
     * Process POST request
     * Create a new order
     */
    static async post(request, reply) {

        // Validate checkout/permissions
        let checkout;
        try {
            checkout = await Checkout.getIfAllowed(request.payload.checkoutId, request.auth.credentials, request.query.accessToken);
            if (!checkout) {
                log.warn({
                    checkoutId: request.payload.checkoutId,
                    credentials: request.auth.credentials,
                    accessToken: request.query.accessToken
                }, 'Cannot create order because checkout ID is invalid');
                return reply(BadRequest.invalidParameters('payload', {checkoutId: ['Invalid #1']})).code(400);
            } else if (checkout.archived === true) {
                log.warn({checkout}, 'Cannot create order because checkout is archived');
                return reply(BadRequest.invalidParameters('payload', {checkoutId: ['Archived']})).code(400);
            } else if (!await isCheckoutReady(checkout)) {
                log.warn({checkout}, 'Cannot create order because checkout is not ready');
                return reply(BadRequest.invalidParameters('payload', {checkoutId: ['Not ready']})).code(400);
            }
        } catch (err) {
            if (err.name === ErrorName.PERMISSION_DENIED) {
                return reply(BadRequest.invalidParameters('payload', {checkoutId: ['Invalid #2']})).code(400);
            } else {
                log.error({where: 'OrdersHandler.post'}, 'Unable to get checkout');
                log.error(err);
                return reply().code(500);
            }
        }

        // Create order
        let customerDetails = await new Checkout(checkout).getCustomerDetails();
        let order = await Order.create({
            checkoutId: checkout.id,
            customer: customerDetails
        });

        // Archive cart and checkout
        await Cart.archive(checkout.cart.id);
        await Checkout.archive(checkout.id);

        // Return
        return reply(order).code(201);
    }
}

/**
 * API handler for Order ID endpoint
 */
class OrderIdHandler {

    /**
     * Return order with given ID
     */
    static async get(request, reply) {

        // ID validation should have been done in route prerequisites
        let order = request.pre.order;

        // IMPORTANT
        // >>> If user is NOT admin, check if order belongs to him <<<
        let isAdmin = request.auth.credentials && request.auth.credentials.scope && request.auth.credentials.scope.indexOf('admin') !== -1;
        if (!isAdmin && order.customer.userId !== request.auth.credentials.id) {
            log.warn({
                user: request.auth.credentials,
                orderId: request.pre.order.id
            }, 'User tried to fetch order that does not belong to him');
            return reply().code(403);
        }

        // Appropriate ID/permission validations should have been done in route prerequisites
        return reply(await new OrderSerializer(request.pre.order).serialize({appendCheckout: true}));
    }

    /**
     * Update certain parts of the order
     */
    static async patch(request, reply) {

        // Appropriate ID/permission validations should have been done in route prerequisites
        let orderId = request.pre.order.id;
        let order = request.pre.order;

        // Check if order is still open
        if ([OrderStatus.CANCELED, OrderStatus.SHIPPED].indexOf(order.status) !== -1) {
            return reply({statusCode: 400, error: 'BadRequest', message: 'Order is closed'}).code(400);
        }

        // Validate payload and make respective updates
        if (hasKeys(request.payload, ['status', 'description'])) {
            if (request.payload.status === '') {
                return reply(BadRequest.invalidParameters('payload', {status: ['This field is required']})).code(400);
            } else if (request.payload.description === '') {
                return reply(BadRequest.invalidParameters('payload', {description: ['This field is required']})).code(400);
            } else {
                try {
                    order = await Order.updateStatus(orderId, request.payload.status, request.payload.description);
                } catch (err) {
                    if (err.name === ErrorName.VALIDATION_ERROR) {
                        return reply(BadRequest.invalidParameters('payload', {[err.param]: [err.message]})).code(400);
                    } else {
                        log.error(err, `Unable to update order "${orderId}" status`);
                        return reply().code(500);
                    }
                }
            }
        } else {
            return reply({message: 'Invalid payload'}).code(400);
        }

        // Return
        return reply(await new OrderSerializer(order).serialize({appendCheckout: true}));
    }
}

/**
 * API handler for Order Email Templates endpoint
 */
class OrderEmailHandler {

    /**
     * Process POST request
     */
    static async post(request, reply) {

        //
        // 1) Sanitize & validate email address
        //
        request.payload.email = sanitizeEmailAddress(request.payload.email);
        if (Joi.string().email().validate(request.payload.email).error) {
            return reply(BadRequest.invalidParameters('payload', {'email': ['"email" must be a valid email']})).code(400);
        }

        //
        // 2) Check if order with given ID exists
        //
        let order = await Order.get(request.params.orderId);
        if (!order) {
            return reply().code(404);
        }

        //
        // 3) Validate payload
        //
        if ([EmailTemplate.ORDER_CREATED.id, EmailTemplate.ORDER_PAID.id, EmailTemplate.ORDER_PENDING_PAYMENT.id, EmailTemplate.ORDER_PENDING_PAYMENT_MERCADOPAGO.id, EmailTemplate.ORDER_PENDING_PAYMENT_CC.id].indexOf(request.payload.template) === -1) {
            return reply(BadRequest.invalidParameters('payload', {template: ['Invalid']})).code(400);
        }

        // Check if email is applicable to the order status
        if (request.payload.template === EmailTemplate.ORDER_PAID.id && order.status !== OrderStatus.PAID) {
            return reply(BadRequest.invalidParameters('payload', {template: ['Order is not paid']})).code(400);
        } else if (request.payload.template === EmailTemplate.ORDER_PENDING_PAYMENT && order.status !== OrderStatus.PENDING_PAYMENT) {
            return reply(BadRequest.invalidParameters('payload', {template: ['Order is not pending payment']})).code(400);
        }

        //
        // 4) Process Details
        //

        let template;
        let to = request.payload.email;
        let data;
        let subject = request.payload.subject;
        let paymentlink = request.payload.paymentlink;


        // a) Order Created
        if (request.payload.template === EmailTemplate.ORDER_CREATED.id) {

            // Grab additional details
            let checkout = new Checkout(await Checkout.get(order.checkoutId));
            let checkoutSerialized = await new CheckoutSerializer(checkout.model).serialize();
            log.debug({paymentLog: order.paymentLog}, 'Payment log');

            template = EmailTemplate.ORDER_CREATED;
            data = {
                customerDetails: order.customer,
                checkout: checkoutSerialized,
                shippingDetails: checkout.getShippingDetails(),
                order: order
            };
        }

        // b) Order Paid
        else if (request.payload.template === EmailTemplate.ORDER_PAID.id) {
            template = EmailTemplate.ORDER_PAID;
            data = {
                order: order
            };
        }

        // c) Order Pending Payment
        else if (request.payload.template === EmailTemplate.ORDER_PENDING_PAYMENT.id) {
            template = EmailTemplate.ORDER_PENDING_PAYMENT;
            data = {
                order: order
            };
        }

        // c) Order Pending Payment Mercado Pago
        else if (request.payload.template === EmailTemplate.ORDER_PENDING_PAYMENT_MERCADOPAGO.id) {
            template = EmailTemplate.ORDER_PENDING_PAYMENT_MERCADOPAGO;
            let checkout = new Checkout(await Checkout.get(order.checkoutId));
            let checkoutSerialized = await new CheckoutSerializer(checkout.model).serialize();
            data = {
                customerDetails: order.customer,
                checkout: checkoutSerialized,
                shippingDetails: checkout.getShippingDetails(),
                order: order,
                paymentlink: paymentlink
            };
        }

        // c) Order Pending Payment PayPal
        else if (request.payload.template === EmailTemplate.ORDER_PENDING_PAYMENT_CC.id) {
            template = EmailTemplate.ORDER_PENDING_PAYMENT_CC;
            let checkout = new Checkout(await Checkout.get(order.checkoutId));
            let checkoutSerialized = await new CheckoutSerializer(checkout.model).serialize();
            data = {
                customerDetails: order.customer,
                checkout: checkoutSerialized,
                shippingDetails: checkout.getShippingDetails(),
                order: order,
                paymentlink: paymentlink
            };
        }

        //
        // 5) Send email
        //
        log.debug(`Sending "${template.id}" email`);
        sendEmailTemplate(template, to, data, subject).then(function () {
            return reply().code(201);
        }, function (err) {
            log.error(err, `Unable to send "${template.id}" email`);
            return reply().code(500);
        });
    }
}

/**
 * Exports
 */
export {
    OrdersHandler,
    OrderIdHandler,
    OrderEmailHandler
};
