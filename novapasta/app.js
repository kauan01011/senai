const express = require('express')
const app = express()
const port = 8080
const path = require('path');
const db = require("../database")

// Middleware para habilitar o parsing de JSON no body
app.use(express.json());

// Serve the 'index.html' file from the root
app.get('/api-tester', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/', (req, res) => {
  res.send('Funcionou essa p****!')
})

// Listar todas as tarefas
app.get('/tasks', (req, res) => {
  db.query('SELECT * FROM tasks', (err, rows) => {
    if (err) {
      console.log('Error: ' + err)
      return res.status(500).json({ error: 'Erro ao listar as tarefas.' });
    }
    res.json(rows);
  });
});

// Listar uma tarefa por ID
app.get('/tasks/:id', (req, res) => {
  const parametro = req.params.id;
  db.query(`SELECT * FROM tasks WHERE id = ${parametro}`, (err, rows) => {
    if (err) {
      console.log('Error: ' + err)
      return res.status(500).json({ error: 'Erro ao buscar a tarefa.' });
    }
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Tarefa não encontrada.' });
    }
    res.json(rows[0]);
  });
});

// Criar uma nova tarefa
app.post('/tasks', (req, res) => {
  const { titulo, descricao = '', status = 'pendente' } = req.body;

  if (!titulo) {
    return res.status(400).json({ error: 'O título é obrigatório.' });
  }

  const query = 'INSERT INTO tasks (titulo, descricao, status) VALUES (?, ?, ?)';
  db.query(query, [titulo, descricao, status], (err, result) => {
    if (err) {
      console.log('Error: ' + err);
      return res.status(500).json({ error: 'Erro ao criar a tarefa.' });
    }

    const newTask = {
      id: result.insertId,
      titulo,
      descricao,
      status
    };

    res.status(201).json(newTask);
  });
});

// Editar uma tarefa existente
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { titulo, descricao, status } = req.body;

  if (!titulo && !descricao && !status) {
    return res.status(400).json({ error: 'Forneça pelo menos um campo para atualizar.' });
  }

  let fields = [];
  if (titulo) fields.push(`titulo = '${titulo}'`);
  if (descricao) fields.push(`descricao = '${descricao}'`);
  if (status) fields.push(`status = '${status}'`);

  const query = `UPDATE tasks SET ${fields.join(', ')} WHERE id = ${id}`;

  db.query(query, (err, result) => {
    if (err) {
      console.error('Error: ' + err);
      return res.status(500).json({ error: 'Erro ao atualizar a tarefa.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Tarefa não encontrada.' });
    }

    res.json({ message: 'Tarefa atualizada com sucesso!' });
  });
});

// Excluir uma tarefa
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM tasks WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Error: ' + err);
      return res.status(500).json({ error: 'Erro ao excluir a tarefa.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Tarefa não encontrada.' });
    }

    res.json({ message: 'Tarefa excluída com sucesso!' });
  });
});

// Inicia o servidor na porta definida
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
