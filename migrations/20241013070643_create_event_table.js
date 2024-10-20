/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('event', (table) => {
    table.increments('id').comment('ID');
    table
      .string('type')
      .comment('event type');
    table.string('test_id').comment('the test id this event is related to');
    table
      .jsonb('properties')
      .nullable()
      .comment('the event properties');
    table.timestamps(true, true);

    // indexing
    table.index('test_id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('event');
};
