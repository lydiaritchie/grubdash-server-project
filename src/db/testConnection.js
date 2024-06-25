const knex = require('./connection');

async function testConnection() {
  try {
    const result = await knex.raw('SELECT 1+1 as result');
    if (result.rows.length > 0 && result.rows[0].result === 2) {
      console.log('Database connection successful');
    } else {
      console.log('Unexpected result from database:', result.rows);
    }
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
  } finally {
    await knex.destroy(); // Close the database connection
  }
}

testConnection();
