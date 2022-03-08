const express = require("express");
const app = express();
const { v4: uuidv4 } = require("uuid");

app.use(express.json());

const customers = [];

// Middleware
function verifyIfAccountExists(req, res, next) {
    const { cpf } = req.headers;
    const customer = customers.find((customer) => customer.cpf === cpf);

    if (!customer) {
        return res.status(401).json({ error: "Customer not found" });
    }

    req.customer = customer; // Declarando que o customer para requisição é o customer

    return next();
}

function getBalance(statement) {
    const balance = statement.reduce((acc, operation) => {
        if (operation.type === "credit") {
            return acc += operation.amount;
        } else {
            return acc -= operation.amount;
        }
    }, 0)

    return balance;
}

app.post("/account", (req, res) => {
    const { cpf, name } = req.headers;

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

app.get("/statement", verifyIfAccountExists, (req, res) => {
    const { customer } = req;

    return res.json(customer.statement);
})

app.get("/statement/date", verifyIfAccountExists, (req, res) => {
    const { date } = req.query;
    const { customer } = req;

    const dateFormat = new Date(date + " 00:00");

    const statement = customer.statement.find((statement) => statement.date.toDateString() === dateFormat.toDateString())

    console.log(statement)
    return res.json(statement);
})

app.post("/deposit", verifyIfAccountExists, (req, res) => {
    const { description, amount } = req.body;
    const { customer } = req;

    customer.statement.push({
        description,
        amount,
        date: new Date(),
        type: "credit"
    });
    return res.status(201).send();
})

app.post("/withdraw", verifyIfAccountExists, (req, res) => {
    const { amount } = req.body;
    const { customer } = req;

    const balance = getBalance(customer.statement);

    if (amount > balance) {
        return res.status(401).json({ error: "Insufficient funds" });
    }

    customer.statement.push({
        amount,
        date: new Date(),
        type: "debit"
    })

    return res.status(201).send();
})

app.listen(3000, (err) => {
    if (!err) {
        console.log("Servidor rodando na porta 3000");
    }
});
