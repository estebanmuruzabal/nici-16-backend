/**
 * Imports
 */
import Joi from 'joi';

// API endpoint handlers
import {
    GroupMedianoHandler,
    GroupMedianoIdHandler
} from './handlers';

/**
 * Routes
 */
export default [
    {
        path: '',
        method: 'GET',
        config: {
            handler: {async: GroupMedianoHandler.get},
            auth: {
                mode: 'try',
                strategy: 'jwt'
            },
            description: 'Get all the groupMediano',
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
            handler: {async: GroupMedianoHandler.post},
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            description: 'Create new GroupMediano',
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
        path: '/{groupMedianoId}',
        method: 'GET',
        config: {
            handler: {async: GroupMedianoIdHandler.get},
            auth: {
                mode: 'try',
                strategy: 'jwt'
            },
            description: 'Get GroupMediano',
            notes: 'Returns a GroupMediano by the id passed in the path',
            tags: ['api'],
            validate: {
                headers: Joi.object({
                    'authorization': Joi.string().optional()
                }).unknown(),
                params: {
                    groupMedianoId: Joi.string().required().description('the id for the GroupMediano'),
                }
            }
        }
    },
    {
        path: '/{groupMedianoId}',
        method: 'DELETE',
        config: {
            handler: {async: GroupMedianoIdHandler.delete},
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            description: 'Delete GroupMediano',
            tags: ['api'],
            validate: {
                headers: Joi.object({
                    'authorization': Joi.string().required()
                }).unknown(),
                params: {
                    groupMedianoId: Joi.string().required().description('the id for the GroupMediano'),
                }
            }
        }
    },
    {
        path: '/{groupMedianoId}',
        method: 'PUT',
        config: {
            handler: {async: GroupMedianoIdHandler.put},
            auth: {
                mode: 'try',
                strategy: 'jwt'
            },
            description: 'Update GroupMediano',
            tags: ['api'],
            validate: {
                headers: Joi.object({
                    'authorization': Joi.string().required()
                }).unknown(),
                params: {
                    groupMedianoId: Joi.string().required().description('the id for the GroupMediano'),
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
