const express = require('express')
const app = express()
const port = 8080
const path = require('path');


// Serve the 'index.html' file from the root

// Middleware para habilitar o parsing de JSON no body
app.use(express.json());

app.get('/api-tester', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/', (req, res) => {
  res.send('Funcionou essa p****!')
})

//Cole sua rota POST aqui
app.post('/', (req, res) => {
    console.log('Dados recebidos no body:', req.body);
    res.json({ message: 'Dados recebidos com sucesso!', body: req.body });
})

app.listen(port, () => {
console.log(`Example app listening on port ${port}`)
})