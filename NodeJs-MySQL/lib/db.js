let mysql = require('mysql');
let conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '*aksen1090314',
  database: 'opentutorials'
});
conn.connect();
module.exports = conn;