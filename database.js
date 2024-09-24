
const sqlite3 = require('sqlite3').verbose();

// Abrindo o banco de dados
const db = new sqlite3.Database('db.sqlite', (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados', err.message);
    return;
  }
  console.log('Banco de dados conectado');

  // Criando a tabela "user"
  db.run(`
    CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(50),
      email VARCHAR(50) UNIQUE,
      password VARCHAR(50)
    )
  `, (error) => {
    if (error) {
      console.error('Erro ao criar a tabela', error.message);
      return;
    }
    console.log('Tabela "user" criada com sucesso.');

    // Inserindo dados na tabela "user"
    const insertQuery = 'INSERT INTO user (name, email, password) VALUES (?, ?, ?)';

    db.run(insertQuery, ["usuario1", "usuario1@email.com", "123456"], (err) => {
      if (err) {
        console.error('Erro ao inserir "usuario1"', err.message);
        return;
      }
      console.log('Usuario1 inserido com sucesso.');
    });

    db.run(insertQuery, ["admin", "admin@email.com", "123456"], (err) => {
      if (err) {
        console.error('Erro ao inserir "admin"', err.message);
        return;
      }
      console.log('Admin inserido com sucesso.');
    });

    console.log('Rodou os SQLs');
  });
});

module.exports = db
