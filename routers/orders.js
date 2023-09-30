import express from "express";
const ordersRouter = express.Router()
import pg from "pg"

const {Pool} = pg

const pool = new Pool()

// ROUTE to ALL ORDERS - GET method

ordersRouter.get("/", async (req,res) => {
    try {
        const result = await pool.query("SELECT * FROM orders;")
        // console.log(result.rows)
        res.json(result.rows)
    }
    catch (error) {
        res.status(404).json(error)
    }
})


// ROUTE to ONE ORDER (with the id) - GET method

ordersRouter.get("/:id", async (req, res) => {
    const {id} = req.params
    try {
        const result = await pool.query("SELECT * FROM orders WHERE id=$1;", [id])
        res.json(result.rows[0])
    }
    catch (error) {
        res.status(404).json ("Order not found", error)
    }
})


export default ordersRouter