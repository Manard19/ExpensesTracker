require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const app = express();
app.use(cors());
app.use(express.json());
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

async function getExpenses(req, res) {
    const query = `
        SELECT
            id,
            title,
            amount::float8 AS amount,
            category,
            to_char(date, 'YYYY-MM-DD') AS date
        FROM expenses
        ORDER BY id
    `;

    try {
        const result = await pool.query(query);

        res.status(200).json(result.rows);
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to get expenses"
        });
    }
}

async function getExpenseById(req, res) {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(404).json({
            message: "Expense not found"
        });
    }

    const query = `
        SELECT
            id,
            title,
            amount::float8 AS amount,
            category,
            to_char(date, 'YYYY-MM-DD') AS date
        FROM expenses
        WHERE id = $1
    `;

    try {
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        res.status(200).json(result.rows[0]);
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to get expense"
        });
    }
}

async function createExpense(req, res) {
    const title = req.body.title;
    const amount = req.body.amount;
    const category = req.body.category;
    const date = req.body.date;

    if (typeof title !== "string" || title.trim() === "") {
        return res.status(400).json({
            message: "Title is required"
        });
    }

    if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
        return res.status(400).json({
            message: "Amount must be a number greater than 0"
        });
    }

    const categories = [
        "Food",
        "Transport",
        "Bills",
        "Entertainment",
        "Other"
    ];

    if (!categories.includes(category)) {
        return res.status(400).json({
            message: "Invalid category"
        });
    }

    if (typeof date !== "string" || date.trim() === "") {
        return res.status(400).json({
            message: "Date is required"
        });
    }

    const query = `
        INSERT INTO expenses (title, amount, category, date)
        VALUES ($1, $2, $3, $4)
        RETURNING
            id,
            title,
            amount::float8 AS amount,
            category,
            to_char(date, 'YYYY-MM-DD') AS date
    `;

    try {
        const result = await pool.query(
            query,
            [title.trim(), amount, category, date]
        );

        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        res.status(400).json({
            message: "Invalid expense data"
        });
    }
}

async function updateExpense(req, res) {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(404).json({
            message: "Expense not found"
        });
    }

    const title = req.body.title;
    const amount = req.body.amount;
    const category = req.body.category;
    const date = req.body.date;

    if (typeof title !== "string" || title.trim() === "") {
        return res.status(400).json({
            message: "Title is required"
        });
    }

    if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
        return res.status(400).json({
            message: "Amount must be a number greater than 0"
        });
    }

    const categories = [
        "Food",
        "Transport",
        "Bills",
        "Entertainment",
        "Other"
    ];

    if (!categories.includes(category)) {
        return res.status(400).json({
            message: "Invalid category"
        });
    }

    if (typeof date !== "string" || date.trim() === "") {
        return res.status(400).json({
            message: "Date is required"
        });
    }

    const query = `
        UPDATE expenses
        SET
            title = $1,
            amount = $2,
            category = $3,
            date = $4
        WHERE id = $5
        RETURNING
            id,
            title,
            amount::float8 AS amount,
            category,
            to_char(date, 'YYYY-MM-DD') AS date
    `;

    try {
        const result = await pool.query(
            query,
            [title.trim(), amount, category, date, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        res.status(200).json(result.rows[0]);
    }
    catch (error) {
        res.status(400).json({
            message: "Invalid expense data"
        });
    }
}

async function deleteExpense(req, res) {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(404).json({
            message: "Expense not found"
        });
    }

    const query = `
        DELETE FROM expenses
        WHERE id = $1
        RETURNING id
    `;

    try {
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        res.status(200).json({
            message: "Expense deleted successfully"
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to delete expense"
        });
    }
}

app.get("/api/expenses", getExpenses);
app.get("/api/expenses/:id", getExpenseById);
app.post("/api/expenses", createExpense);
app.put("/api/expenses/:id", updateExpense);
app.delete("/api/expenses/:id", deleteExpense);

const PORT = 3000;
app.listen(PORT, function () {
    console.log(`Server running on port ${PORT}`);
});