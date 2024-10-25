import express from "express";
import pg from 'pg';

const { Client } = pg;
const app = express();

// Middleware for parsing JSON bodies
app.use(express.json());

// PostgreSQL client setup
const client = new Client({
    user: 'postgres',
    password: 'awlad',
    host: 'localhost',
    port: 5432,
    database: 'crud_operation',
});

// Connect to PostgreSQL
const dbConnect = async () => {
    try {
        await client.connect();
        console.log('Database connection successful.');
    } catch (error) {
        console.error("Database connection failed!", error);
    }
};
dbConnect();

// POST endpoint to create a record
app.post("/crud_create", async (req, res) => {
    const { id, name, description } = req.body;

    const insertQuery = `INSERT INTO practice.demo (id, name, description) VALUES ($1, $2, $3) returning*`;
    try {
        const result = await client.query(insertQuery, [id, name, description]);
        res.status(201).json({
            status: 201,
            message: "Post created successfully.",
            data: result.rows
        });
    } catch (err) {
        console.error("Error executing query:", err);
        res.status(500).json({
            status: 500,
            message: "Failed to create post.",
            error: err.message,
        });
    }
});

// Basic GET endpoint for testing
app.get("/crud_create", async(req, res) => {
    try {
        const result=await client.query('select * from practice.demo ');
        res.status(200).json({
            status:200,
            message:"data fetched successful.",
            data:result.rows
        })
    } catch (error) {
        console.log("internal server error",error)
    }
});

// Start the server
app.listen(5000, () => {
    console.log(`Server is running on port 5000`);
});
