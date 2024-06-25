// Update with your config settings.
require("dotenv").config();
const path = require('path');
const {DATABASE_URL} = process.env;

console.log("in knexfile");
console.log(process.env);
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: 'postgresql',
    connection: DATABASE_URL,
  },
};
