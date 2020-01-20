/**
 * Imports
 */
import {Checkout} from './models';

/**
 * Return the available shipping options for given checkout
 */
function getShippingOptions(checkout) {

    let options = [];

    if (new Checkout(checkout).getSubTotal() <= 199) {
        options.push({
            value: 'free-pickup',
            name: {
                en: 'To take pick-up in our shop',
                es: 'A retirar por Guemes 765.'
            },
            price: 0,
            vat: 0,
            currency: 'ARS'
        },
        {
          value: 'zona-1',
          name: {
            en: 'Shipping to address in Zone 1',
            es: 'Envío a domicilio en Zona 1'
          },
          price: 25.00,
          vat: 0,
          currency: 'ARS'
        },
        {
            value: 'zona-2',
            name: {
              en: 'Shipping to address in Zone 2',
              es: 'Envío a domicilio en Zona 2'
            },
            price: 30.00,
            vat: 0,
            currency: 'ARS'
        }
      );
    } else {
        options.push({
          value: 'free-pickup',
          name: {
              en: 'To take pick-up in our shop',
              es: 'A retirar por Guemes 765.'
          },
          price: 0,
          vat: 0,
          currency: 'ARS'
        },
        {
          value: 'zona-1-free',
          name: {
              en: 'Shipping to address in Zone 1',
              es: 'Envío gratis dentro de la Zona 1.',
          },
          price: 0,
          vat: 0,
          currency: 'ARS'
        },
        {
            value: 'zona-2',
            name: {
              en: 'Shipping to address in Zone 2',
              es: 'Envío a domicilio en Zona 2'
            },
            price: 10,
            vat: 0,
            currency: 'ARS'
        }
      );
    }

    return options;
}

/**
 * Exports
 */
export {getShippingOptions};
