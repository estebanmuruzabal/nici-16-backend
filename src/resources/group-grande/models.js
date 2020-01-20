/**
 * Imports
 */
 import config from '../../config';
import {rethinkdb, Decorators as DBDecorators} from '../../core/db';

/**
 * Database tables
 */
const tables = {
    GroupGrande: 'GroupGrande'
};

/**
 * GroupGrande model
 */
class GroupGrande {

    /**
     * Create a new GroupGrande
     */
    @DBDecorators.table(tables.GroupGrande)
    static async create({name, tags}) {

        let obj = {
            name,
            buyers: [],
            tags,
            updatedAt: new Date()
        };

        let insert = await this.table.insert(obj).run();

        // Get GroupGrande object and return it
        return await this.table.get(insert.generated_keys[0]).run();
    }


    @DBDecorators.table(tables.GroupGrande)
    static async find() {

        // Build query

        let query = this.table.filter({});

        // Execute query and return
        return await query.run();
    }


    /**
     * Return GroupGrande with given ID
     */
    @DBDecorators.table(tables.GroupGrande)
    static async get(groupGrandeId) {
        return await this.table.get(groupGrandeId).run();
    }

    /**
     * Delete GroupGrande
     */
    @DBDecorators.table(tables.GroupGrande)
    static async del(groupGrandeId) {

        // Update GroupGrande
        await this.table.get(groupGrandeId).delete().run();

        // Fetch GroupGrande's latest state and return.
        return await GroupGrande.get(groupGrandeId);
    }

    /**
     * Update GroupGrande images
     * @param groupGrandeId - the groupGrande unique ID
     * @param images - an array of image objects (that contain URL and other info)
     * @returns the saved groupGrande object
     */
    @DBDecorators.table(tables.GroupGrande)
    static async updateImages(groupGrandeId, images) {

        // Update GroupGrande
        await this.table.get(groupGrandeId).update({images, updatedAt: new Date()}).run();

        // Fetch groupGrande's latest state and return.
        return await GroupGrande.get(groupGrandeId);
    }

    /**
     * Update GroupGrande
     */
    @DBDecorators.table(tables.GroupGrande)
    static async update(groupGrandeId, {name, buyers, tags}) {
        let obj = {
            name,
            buyers,
            tags,
            updatedAt: new Date()
        };

        // Update GroupGrande
        await this.table.get(groupGrandeId).update(obj).run();

        // Fetch GroupGrande's latest state and return.
        return await GroupGrande.get(groupGrandeId);
    }
}

/**
 * Export
 */
export {tables, GroupGrande};
