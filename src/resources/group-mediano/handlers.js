/**
 * Imports
 */
import {GroupMediano} from './models';
import log from './logging';

/**
 * API handler for groups groupMediano endpoint
 */
class GroupMedianoHandler {

    /**
     * Process GET request
     * Return the GroupMediano's GroupMediano
     */
    static async get(request, reply) {
        return reply({items: await GroupMediano.find({
            tags: request.query.tags ? request.query.tags.split(',') : null
        })});
    }

    /**
     * Process POST request
     * Create a new GroupMediano
     */

    static async post(request, reply) {
        try {
            let group = await GroupMediano.create(request.payload);
            return reply(group).code(201);
        } catch (err) {
            if (err) {
                return reply(BadRequest.invalidParameters('payload', {[err.param]: [err.message]})).code(400);
            } else {
                log.error(err, 'Unable to create groupMediano');
                return reply().code(500);
            }
        }

    }
}

/**
 * API handler for GroupMediano ID endpoint
 */
class GroupMedianoIdHandler {

    /**
     * Process GET request
     */
    static async get(request, reply) {
        let group = await GroupMediano.get(request.params.groupMedianoId);

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

        // Check if groupMediano with given ID exists
        let group = await GroupMediano.get(request.params.groupMedianoId);
        if (!group) {
            return reply().code(404);
        }
        group = await GroupMediano.update(request.params.groupMedianoId, request.payload);
        return reply(group);
    }


    /**
     * Process DELETE request
     */
    static async delete(request, reply) {

        // Check if groupMediano with given ID exists
        let group = await GroupMediano.get(request.params.groupMedianoId);
        if (!group) {
            return reply().code(404);
        }

        // delete the groupMediano
        try {
            group = await GroupMediano.del(request.params.groupMedianoId, request.payload);
            return reply().code(201);
        } catch (err) {
            if (err.name === ErrorName.VALIDATION_ERROR) {
                return reply(BadRequest.invalidParameters('payload', {[err.param]: [err.message]})).code(400);
            } else {
                log.error(err, 'Unable to delete groupMediano');
                return reply().code(500);
            }
        }
    }

}

/**
 * Exports
 */
export {GroupMedianoHandler, GroupMedianoIdHandler};
