/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('test', (table) => {
    table.increments('id').comment('ID');
    table
      .string('name')
      .comment('test name');
    table.string('type').comment('test type: eg: price, title...');
    table.timestamps(true, true);

    // indexing
    table.index('user_id');
    table.index('name');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('event');
};
