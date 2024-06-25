// Update with your config settings.
const path = require('path');
require("dotenv").config();
const {DATABASE_URL} = process.env;

console.log(DATABASE_URL);
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'postgresql',
    connection: DATABASE_URL,
  },
};
