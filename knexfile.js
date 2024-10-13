/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
if (!process.env.PG_URL) {
    console.error("PG_URL is not set");
    process.exit(1);
}
console.log('Using Postgres');
module.exports = {
    client: 'pg',
    connection: process.env.PG_URL,
};
