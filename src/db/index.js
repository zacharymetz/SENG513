const  { Pool,Client } = require('pg');


const pool = new Client({
  user: 'postgres',
  host: '96.51.140.32',
  database: 'webapp',
  password: 'DUBTmNiaWMe9v6dqNnhiOQTrZEWmI1x34CfZOziWvHfWNpAKRBDIZ5KLmTCX0CZre7l03a7NeYM3LGuHLerl6hjgorTmFHW0',
  port: 5432,
});

pool.connect();

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  }
}
