/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('posts',function(table){
        table.increments();
        table.string('name').notNullable();
        table.string('description').notNullable();
        table.string('cover_image').notNullable();
        table.boolean('status').notNullable();
        table.integer('user_id').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.collate('utf8_unicode_ci');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('posts');
};
