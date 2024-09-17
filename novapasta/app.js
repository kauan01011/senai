const express = require("express")
const app = express()
const port = 8080

function lidarComRequisicao(Req, Res){
    Res.send("teste")
}

app.get('/sobre', (req, res) =>{
    res.send("<h1>titulo</h1>")
})

app.listen(port, ()=>{
    console.log("ta rodando")
})