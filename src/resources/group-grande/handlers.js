/**
 * Imports
 */
import {GroupGrande} from './models';
import log from './logging';

/**
 * API handler for GroupGrandes GroupGrande endpoint
 */
class GroupGrandeHandler {

    /**
     * Process GET request
     * Return the GroupGrande's GroupGrande
     */
    static async get(request, reply) {
        return reply({items: await GroupGrande.find({
            tags: request.query.tags ? request.query.tags.split(',') : null
        })});
    }

    /**
     * Process POST request
     * Create a new GroupGrande
     */

    static async post(request, reply) {
        try {
            let group = await GroupGrande.create(request.payload);
            return reply(group).code(201);
        } catch (err) {
            if (err) {
                return reply(BadRequest.invalidParameters('payload', {[err.param]: [err.message]})).code(400);
            } else {
                log.error(err, 'Unable to create GroupGrande');
                return reply().code(500);
            }
        }

    }
}

/**
 * API handler for GroupGrande ID endpoint
 */
class GroupGrandeIdHandler {

    /**
     * Process GET request
     */
    static async get(request, reply) {
        let group = await GroupGrande.get(request.params.groupGrandeId);

        if (group) {
            return reply(group);
        } else {
            return reply().code(404);
        }
    }

    /**
     * Process PUT request
     */
    static async put(request, reply) {

        // Check if GroupGrande with given ID exists
        let group = await GroupGrande.get(request.params.groupGrandeId);
        if (!group) {
            return reply().code(404);
        }
        group = await GroupGrande.update(request.params.groupGrandeId, request.payload);
        return reply(group);
    }


    /**
     * Process DELETE request
     */
    static async delete(request, reply) {

        // Check if GroupGrande with given ID exists
        let group = await GroupGrande.get(request.params.groupGrandeId);
        if (!group) {
            return reply().code(404);
        }

        // delete the GroupGrande
        try {
            group = await GroupGrande.del(request.params.groupGrandeId, request.payload);
            return reply().code(201);
        } catch (err) {
            if (err.name === ErrorName.VALIDATION_ERROR) {
                return reply(BadRequest.invalidParameters('payload', {[err.param]: [err.message]})).code(400);
            } else {
                log.error(err, 'Unable to delete GroupGrande');
                return reply().code(500);
            }
        }
    }

}

/**
 * Exports
 */
export {GroupGrandeHandler, GroupGrandeIdHandler};
