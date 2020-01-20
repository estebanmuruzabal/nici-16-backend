/**
 * Imports
 */
import Joi from 'joi';

// API endpoint handlers
import {
    GroupChicoHandler,
    GroupChicoIdHandler
} from './handlers';

/**
 * Routes
 */
export default [
    {
        path: '',
        method: 'GET',
        config: {
            handler: {async: GroupChicoHandler.get},
            auth: {
                mode: 'try',
                strategy: 'jwt'
            },
            description: 'Get all the group chico',
            tags: ['api'],
            validate: {
                headers: Joi.object({
                    'authorization': Joi.string().optional()
                }).unknown(),
                query: {
                    tags: Joi.string().optional()
                }
            }
        }
    },
    {
        path: '',
        method: 'POST',
        config: {
            handler: {async: GroupChicoHandler.post},
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            description: 'Create new group chico',
            tags: ['api'],
            validate: {
                headers: Joi.object({
                    'authorization': Joi.string().required()
                }).unknown(),
                payload: {
                    name: Joi.object().required(),
                    buyers: Joi.array().required(),
                    tags: Joi.array().optional()
                }
            },
            response: {
                schema: {
                    id: Joi.string(),
                    name: Joi.object(),
                    buyers: Joi.array(),
                    tags: Joi.array()
                }
            }
        }
    },
    {
        path: '/{groupChicoId}',
        method: 'GET',
        config: {
            handler: {async: GroupChicoIdHandler.get},
            auth: {
                mode: 'try',
                strategy: 'jwt'
            },
            description: 'Get group',
            notes: 'Returns a group by the id passed in the path',
            tags: ['api'],
            validate: {
                headers: Joi.object({
                    'authorization': Joi.string().optional()
                }).unknown(),
                params: {
                    groupChicoId: Joi.string().required().description('the id for the group'),
                }
            }
        }
    },
    {
        path: '/{groupChicoId}',
        method: 'DELETE',
        config: {
            handler: {async: GroupChicoIdHandler.delete},
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            description: 'Delete group',
            tags: ['api'],
            validate: {
                headers: Joi.object({
                    'authorization': Joi.string().required()
                }).unknown(),
                params: {
                    groupChicoId: Joi.string().required().description('the id for the group'),
                }
            }
        }
    },
    {
        path: '/{groupChicoId}',
        method: 'PUT',
        config: {
            handler: {async: GroupChicoIdHandler.put},
            auth: {
                mode: 'try',
                strategy: 'jwt'
            },
            description: 'Update group',
            tags: ['api'],
            validate: {
                headers: Joi.object({
                    'authorization': Joi.string().required()
                }).unknown(),
                params: {
                    groupChicoId: Joi.string().required().description('the id for the group'),
                },
                payload: {
                    name: Joi.object({
                        en: Joi.string().required(),
                        es: Joi.string().required()
                    }).required(),
                    buyers: Joi.array({
                        buyer: Joi.string().required()
                    }).required(),
                    tags: Joi.array().required()
                }
            }
        }
    }
];
