const express = require("express");
const { v4: uuidv4 } = require("uuid");
const app = express();

var customers = [];

app.use(express.json());

app.post("/account", (req, res) => {
    const { cpf, name } = req.body;
    const id = uuidv4();
    customers.push({
        cpf,
        name,
        id,
        statement: []
    });

    console.log(customers);
    return res.status(201).send();
});

app.listen(3000, (err) => {
    if (!err) {
        console.log("Servidor rodando na porta 3000");
    }
});
