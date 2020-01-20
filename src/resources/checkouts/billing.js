/**
 * Return the available payment options for given checkout
 */
function getPaymentOptions(checkout) {
    return [
        {
            id: 'mercadopago',
            label: {
                es: 'Tarjeta de Crédito/Débito (Se le enviará un link a su mail para pagar desde la pagina de Mercado Pago)',
                en: 'Payment through Mercado Pago'
            }
        },
        {
            id: 'cash',
            label: {
                en: 'Payment on delivery',
                es: 'Con efectivo. Pagás cuando recibís la mercadería'
            }
        }
    ];
}

/**
 * Exports
 */
export {getPaymentOptions};
