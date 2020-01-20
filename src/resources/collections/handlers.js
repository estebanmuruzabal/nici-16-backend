/**
 * Imports
 */
import {Collection} from './models';

/**
 * API handler for Collections collection endpoint
 */
class CollectionsHandler {

    /**
     * Process GET request
     * Return the collections's collection
     */
    static async get(request, reply) {

        // Only authenticated Admins can see collections that are not enabled
        let isAdmin = request.auth.credentials && request.auth.credentials.scope && request.auth.credentials.scope.indexOf('admin') !== -1;
        let enabled = !isAdmin;

        return reply({items: await Collection.find({
            tags: request.query.tags ? request.query.tags.split(',') : null
        }, enabled)});
    }

    /**
     * Process POST request
     * Create a new collection
     */
    static async post(request, reply) {
        let collection = await Collection.create(request.payload);
        return reply(collection).code(201);
    }
}

/**
 * API handler for Collection ID endpoint
 */
class CollectionIdHandler {

    /**
     * Process GET request
     */
    static async get(request, reply) {
        let collection = await Collection.get(request.params.collectionId);
        // Note: Only authenticated Admins can see collections that are not enabled
        let isAdmin = request.auth.credentials && request.auth.credentials.scope && request.auth.credentials.scope.indexOf('admin') !== -1;
        if (collection && (collection.enabled === true || isAdmin)) {
            return reply(collection);
        } else {
            return reply().code(404);
        }
    }

    /**
     * Process PUT request
     */
    static async put(request, reply) {

        // Check if collection with given ID exists
        let collection = await Collection.get(request.params.collectionId);
        if (!collection) {
            return reply().code(404);
        }

        // Update collection
        collection = await Collection.update(request.params.collectionId, request.payload);
        return reply(collection);
    }

    /**
     * Process DELETE request
     */
    static async delete(request, reply) {

        // Check if collection with given ID exists
        let collection = await Collection.get(request.params.collectionId);
        if (!collection) {
            return reply().code(404);
        }

        // delete the collection
        try {
            collection = await Collection.del(request.params.collectionId, request.payload);
            return reply().code(201);
        } catch (err) {
            if (err.name === ErrorName.VALIDATION_ERROR) {
                return reply(BadRequest.invalidParameters('payload', {[err.param]: [err.message]})).code(400);
            } else {
                log.error(err, 'Unable to delete collection');
                return reply().code(500);
            }
        }
    }

}

/**
 * Exports
 */
export {CollectionsHandler, CollectionIdHandler};
