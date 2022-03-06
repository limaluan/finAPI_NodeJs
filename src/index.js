const express = require("express");
const app = express();
const { v4: uuidv4 } = require("uuid");

app.use(express.json());

const customers = [];

app.post("/account", (req, res) => {
    const { cpf, name } = req.body;

    const customerAlreadyExists = customers.some((customer) => customer.cpf === cpf);

    if (customerAlreadyExists) {
        return res.status(400).json({ error: "Customer already exists." })
    }

    customers.push({
        cpf,
        name,
        id: uuidv4(),
        statement: []
    });
    console.log(customers);

    return res.status(201).send();
})

app.get("/statement/:cpf", (req, res) => {
    const { cpf } = req.params;
    const customer = customers.find((customer) => customer.cpf === cpf);

    return res.json(customer.statement);
})

app.listen(3000, (err) => {
    if (!err) {
        console.log("Servidor rodando na porta 3000");
    }
});
