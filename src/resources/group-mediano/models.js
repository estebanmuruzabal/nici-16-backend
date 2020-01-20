/**
 * Imports
 */
 import config from '../../config';
import {rethinkdb, Decorators as DBDecorators} from '../../core/db';

/**
 * Database tables
 */
const tables = {
    GroupMediano: 'GroupMediano'
};

/**
 * GroupMediano model
 */
class GroupMediano {

    /**
     * Create a new GroupMediano
     */
    @DBDecorators.table(tables.GroupMediano)
    static async create({name, tags}) {

        let obj = {
            name,
            buyers: [],
            tags,
            updatedAt: new Date()
        };

        let insert = await this.table.insert(obj).run();

        // Get GroupMediano object and return it
        return await this.table.get(insert.generated_keys[0]).run();
    }


    @DBDecorators.table(tables.GroupMediano)
    static async find() {

        // Build query

        let query = this.table.filter({});

        // Execute query and return
        return await query.run();
    }


    /**
     * Return GroupMediano with given ID
     */
    @DBDecorators.table(tables.GroupMediano)
    static async get(groupMedianoId) {
        return await this.table.get(groupMedianoId).run();
    }

    /**
     * Delete GroupMediano
     */
    @DBDecorators.table(tables.GroupMediano)
    static async del(groupMedianoId) {

        // Update GroupMediano
        await this.table.get(groupMedianoId).delete().run();

        // Fetch GroupMediano's latest state and return.
        return await GroupMediano.get(groupMedianoId);
    }

    /**
     * Update GroupMediano images
     * @param groupmedianoid - the GroupMediano unique ID
     * @param images - an array of image objects (that contain URL and other info)
     * @returns the saved GroupMediano object
     */
    @DBDecorators.table(tables.GroupMediano)
    static async updateImages(groupMedianoId, images) {

        // Update GroupMediano
        await this.table.get(groupMedianoId).update({images, updatedAt: new Date()}).run();

        // Fetch GroupMediano's latest state and return.
        return await GroupMediano.get(groupMedianoId);
    }

    /**
     * Update GroupMediano
     */
    @DBDecorators.table(tables.GroupMediano)
    static async update(groupMedianoId, {name, buyers, tags}) {
        let obj = {
            name,
            buyers,
            tags,
            updatedAt: new Date()
        };

        // Update GroupMediano
        await this.table.get(groupMedianoId).update(obj).run();

        // Fetch GroupMediano's latest state and return.
        return await GroupMediano.get(groupMedianoId);
    }
}

/**
 * Export
 */
export {tables, GroupMediano};
