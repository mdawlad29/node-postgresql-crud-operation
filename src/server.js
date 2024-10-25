import express from "express";
import pg from 'pg';
import dotenv from "dotenv"
dotenv.config()
const { Client } = pg;
const app = express();

// Middleware for parsing JSON bodies
app.use(express.json());

// PostgreSQL client setup
const client = new Client({
    user:'postgres',
    password: 'awlad',
    host: 'localhost',
    port: 5432 ,
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
app.get("/crud_get", async(req, res) => {
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

app.get('/crud_get/:id',async(req,res)=>{
    const {id}=req.params;
    try {
        const result=await client.query('select * from practice.demo where id=$1',[id]);
        res.status(200).json({
            status:200,
            message:"data fetched successful.",
            data:result.rows[0]
        })
    } catch (error) {
        console.log('internal server error',error)
    }
})

app.patch("/crud_update/:id", async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body; 
    try {
        const checkResult = await client.query('SELECT * FROM practice.demo WHERE id=$1', [id]);
        if (checkResult.rowCount === 0) {
            return res.status(404).json({
                status: 404,
                message: "Data not found"
            });
        }

        const result = await client.query('UPDATE practice.demo SET name=$1, description=$2 WHERE id=$3 RETURNING *', [name, description, id]);

        res.status(200).json({
            status: 200,
            message: "Data updated successfully",
            data: result.rows[0]
        });
    } catch (error) {
        console.log("Internal server error", error);
        res.status(500).json({
            status: 500,
            message: "Internal server error",
            error: error.message 
        });
    }
});


app.delete('/crud_delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const checkResult = await client.query('SELECT * FROM practice.demo WHERE id=$1', [id]);
        if (checkResult.rowCount === 0) {
            return res.status(404).json({
                status: 404,
                message: 'Data not found'
            });
        }

        const result = await client.query('DELETE FROM practice.demo WHERE id=$1', [id]);

        res.status(200).json({
            status: 200,
            message: 'Data deleted successfully.',
        });
    } catch (error) {
        console.log("Internal server error", error);
        res.status(500).json({
            status: 500,
            message: "Internal server error",
            error: error.message 
        });
    }
});


// Start the server
app.listen(5000, () => {
    console.log(`Server is running on port 5000`);
});
