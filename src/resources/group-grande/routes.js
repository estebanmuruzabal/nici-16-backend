/**
 * Imports
 */
import Joi from 'joi';

// API endpoint handlers
import {
    GroupGrandeHandler,
    GroupGrandeIdHandler
} from './handlers';

/**
 * Routes
 */
export default [
    {
        path: '',
        method: 'GET',
        config: {
            handler: {async: GroupGrandeHandler.get},
            auth: {
                mode: 'try',
                strategy: 'jwt'
            },
            description: 'Get all the groupGrandes',
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
            handler: {async: GroupGrandeHandler.post},
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            description: 'Create new groupGrande',
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
        path: '/{groupGrandeId}',
        method: 'GET',
        config: {
            handler: {async: GroupGrandeIdHandler.get},
            auth: {
                mode: 'try',
                strategy: 'jwt'
            },
            description: 'Get groupGrande',
            notes: 'Returns a groupGrande by the id passed in the path',
            tags: ['api'],
            validate: {
                headers: Joi.object({
                    'authorization': Joi.string().optional()
                }).unknown(),
                params: {
                    groupGrandeId: Joi.string().required().description('the id for the groupGrande'),
                }
            }
        }
    },
    {
        path: '/{groupGrandeId}',
        method: 'DELETE',
        config: {
            handler: {async: GroupGrandeIdHandler.delete},
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            description: 'Delete groupGrande',
            tags: ['api'],
            validate: {
                headers: Joi.object({
                    'authorization': Joi.string().required()
                }).unknown(),
                params: {
                    groupGrandeId: Joi.string().required().description('the id for the groupGrande'),
                }
            }
        }
    },
    {
        path: '/{groupGrandeId}',
        method: 'PUT',
        config: {
            handler: {async: GroupGrandeIdHandler.put},
            auth: {
                mode: 'try',
                strategy: 'jwt'
            },
            description: 'Update groupGrande',
            tags: ['api'],
            validate: {
                headers: Joi.object({
                    'authorization': Joi.string().required()
                }).unknown(),
                params: {
                    groupGrandeId: Joi.string().required().description('the id for the groupGrande'),
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
