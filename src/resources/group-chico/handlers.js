/**
 * Imports
 */
import {GroupChico} from './models';
import log from './logging';

/**
 * API handler for groups group endpoint
 */
class GroupChicoHandler {

    /**
     * Process GET request
     * Return the Group's Group
     */
    static async get(request, reply) {
        return reply({items: await GroupChico.find({
            tags: request.query.tags ? request.query.tags.split(',') : null
        })});
    }

    /**
     * Process POST request
     * Create a new Group
     */

    static async post(request, reply) {
        try {
            let group = await GroupChico.create(request.payload);
            return reply(group).code(201);
        } catch (err) {
            if (err) {
                return reply(BadRequest.invalidParameters('payload', {[err.param]: [err.message]})).code(400);
            } else {
                log.error(err, 'Unable to create group');
                return reply().code(500);
            }
        }

    }
}

/**
 * API handler for Group ID endpoint
 */
class GroupChicoIdHandler {

    /**
     * Process GET request
     */
    static async get(request, reply) {
        let group = await GroupChico.get(request.params.groupChicoId);

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

        // Check if group with given ID exists
        let group = await GroupChico.get(request.params.groupChicoId);
        if (!group) {
            return reply().code(404);
        }
        group = await GroupChico.update(request.params.groupChicoId, request.payload);
        return reply(group);
    }


    /**
     * Process DELETE request
     */
    static async delete(request, reply) {

        // Check if group with given ID exists
        let group = await GroupChico.get(request.params.groupChicoId);
        if (!group) {
            return reply().code(404);
        }

        // delete the group
        try {
            group = await GroupChico.del(request.params.groupChicoId, request.payload);
            return reply().code(201);
        } catch (err) {
            if (err.name === ErrorName.VALIDATION_ERROR) {
                return reply(BadRequest.invalidParameters('payload', {[err.param]: [err.message]})).code(400);
            } else {
                log.error(err, 'Unable to delete group');
                return reply().code(500);
            }
        }
    }

}

/**
 * Exports
 */
export {GroupChicoHandler, GroupChicoIdHandler};
