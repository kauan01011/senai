const express = require('express');
const app = express();
const port = 8080;
const path = require('path');
const db = require("../database");

// Middleware para habilitar o parsing de JSON no body
app.use(express.json());

// Serve the 'index.html' file from the root
app.get('/api-tester', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Rota de teste
app.get('/', (req, res) => {
  res.send('Funcionou essa p****!');
});

// Rota para listar todas as tarefas
app.get('/tasks', (req, res) => {
  db.query('SELECT * FROM tasks', (err, rows) => {
    if (err) {
      console.error('Error: ' + err);
      return res.status(500).json({ error: 'Erro ao listar tarefas.' });
    }
    res.json(rows);
  });
});

// Rota para criar uma nova tarefa
app.post('/tasks', (req, res) => {
  const { titulo, descricao, status = 'pendente' } = req.body; // status padrão é "pendente"

  // Verifica se o título foi fornecido
  if (!titulo) {
    return res.status(400).json({ error: 'O título é obrigatório.' });
  }

  const newTask = { titulo, descricao, status };

  // Insere a nova tarefa na tabela 'tasks'
  db.query('INSERT INTO tasks SET ?', newTask, (err, result) => {
    if (err) {
      console.error('Error: ' + err);
      return res.status(500).json({ error: 'Erro ao criar a tarefa.' });
    }
    
    // Retorna a tarefa criada, incluindo o ID gerado
    newTask.id = result.insertId;
    res.status(201).json(newTask);
  });
});

// Inicializa o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
