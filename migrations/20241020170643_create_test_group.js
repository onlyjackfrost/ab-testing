/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('test_group', (table) => {
    table.increments('id').comment('ID');
    table
      .string('name')
      .comment('test group name');
    table.jsonb('properties').comment('the settings of the test group, including price, title, ...');
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('event');
};
