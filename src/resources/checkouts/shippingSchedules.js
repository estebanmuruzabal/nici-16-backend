/**
 * Imports
 */
import {Checkout} from './models';

/**
 * Return the available shipping options for given checkout
 */
function getShippingScheduleOptions() {

    let options = [];

    options.push({
        day: {
            en: 'Monday 24',
            es: 'Lunes 24'
        },
        time: {
            es: '10:00',
            en: '10:00'
        }
      },

      {
        day: {
            en: 'Tuesday 24',
            es: 'Martes 24'
        },
        time: {
            es: '10:00',
            en: '10:00'
        }
      },

      {
        day: {
            en: 'Wednesday 25',
            es: 'Miércoles 25'
        },
        time: {
            es: '10:00',
            en: '10:00'
        }
      },

      {
        day: {
            en: 'Thursday 26',
            es: 'Jueves 26'
        },
        time: {
            es: '10:00',
            en: '10:00'
        }
      },

      {
        day: {
            en: 'Friday 27',
            es: 'Viernes 27'
        },
        time: {
            es: '10:00',
            en: '10:00'
        }
      }
      
  );
  return options;
};

/**
 * Exports
 */
export {getShippingScheduleOptions};
