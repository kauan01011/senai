const mysql = require('mysql2')
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  waitForConnections: true,   // Espera por conexões disponíveis
  connectionLimit: 10,        // Limite máximo de conexões no pool
  queueLimit: 0               // Número máximo de conexões em espera (0 = ilimitado)
})

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting: ' + err.stack)
    return
  }
  console.log('Connected as id ' + connection.threadId)

  // Libera a conexão de volta para o pool após o uso
  connection.release()
})

module.exports = pool