/**
 * Imports
 */
 import config from '../../config';
import {rethinkdb, Decorators as DBDecorators} from '../../core/db';

/**
 * Database tables
 */
const tables = {
    GroupChico: 'GroupChico'
};

/**
 * Group model
 */
class GroupChico {

    /**
     * Create a new Group
     */
    @DBDecorators.table(tables.GroupChico)
    static async create({name, tags}) {

        let obj = {
            name,
            buyers: [],
            tags,
            updatedAt: new Date()
        };

        let insert = await this.table.insert(obj).run();

        // Get Group object and return it
        return await this.table.get(insert.generated_keys[0]).run();
    }


    @DBDecorators.table(tables.GroupChico)
    static async find() {

        // Build query

        let query = this.table.filter({});

        // Execute query and return
        return await query.run();
    }


    /**
     * Return Group with given ID
     */
    @DBDecorators.table(tables.GroupChico)
    static async get(groupChicoId) {
        return await this.table.get(groupChicoId).run();
    }

    /**
     * Delete Group
     */
    @DBDecorators.table(tables.GroupChico)
    static async del(groupChicoId) {

        // Update Group
        await this.table.get(groupChicoId).delete().run();

        // Fetch Group's latest state and return.
        return await GroupChico.get(groupChicoId);
    }

    /**
     * Update Group images
     * @param groupId - the group unique ID
     * @param images - an array of image objects (that contain URL and other info)
     * @returns the saved group object
     */
    @DBDecorators.table(tables.GroupChico)
    static async updateImages(groupId, images) {

        // Update Group
        await this.table.get(groupChicoId).update({images, updatedAt: new Date()}).run();

        // Fetch group's latest state and return.
        return await GroupChico.get(groupChicoId);
    }

    /**
     * Update Group
     */
    @DBDecorators.table(tables.GroupChico)
    static async update(groupChicoId, {name, buyers, tags}) {
        let obj = {
            name,
            buyers,
            tags,
            updatedAt: new Date()
        };

        // Update Group
        await this.table.get(groupChicoId).update(obj).run();

        // Fetch Group's latest state and return.
        return await GroupChico.get(groupChicoId);
    }
}

/**
 * Export
 */
export {tables, GroupChico};
