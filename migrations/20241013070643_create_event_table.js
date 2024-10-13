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
    table.string('user_id').comment('the user id who trigger the event');
    table.string('test_id').comment('the test id this event is related to');
    table.timestamp('event_time').comment('the time when the event is triggered');
    table
      .jsonb('properties')
      .nullable()
      .comment('the event properties');
    table.timestamps(true, true);

    // indexing
    table.index('user_id');
    table.index('test_id');
    table.index('event_time');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('event');
};
