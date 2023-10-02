import express from "express";
const ordersRouter = express.Router()
import pool from "../pool.js";
import {body, validationResult} from "express-validator"



// ORDER VALIDATION for both POST and PUT method
const orderValidation = [
    body("price").isInt().exists().withMessage("Only whole number accepted"),
    body("date").isString().exists().withMessage("Only string accepted")
]


// ROUTE to ALL ORDERS - GET method

ordersRouter.get("/", async (req,res) => {
    try {
        const result = await pool.query("SELECT * FROM orders;")
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


// ROUTE to CREATE a NEW ORDER - POST method

ordersRouter.post("/", orderValidation, async (req, res) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        return res.status(404).json({"UNSUCCESSFUL - Order not created": errors.array()})
    }

    const {price, date, user_id} = req.body;
    // console.log(req.body)
    try {
        const result = await pool.query(
            "INSERT INTO orders (price, date, user_id) VALUES ($1, $2, $3) RETURNING *;", [price, date, user_id])
        res.json(result.rows[0])
    }
    catch (error) {
        res.status(500).json(error)
    }
})


// ROUTE to EDIT one order (with the id) - PUT method

ordersRouter.put("/:id", orderValidation, async (req, res) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        return res.status(404).json({"UNSUCCESSFUL - Order not updated": errors.array()})
    }

    const {id} = req.params
    const {price} = req.body
    try {
        const result = await pool.query(
            "UPDATE orders SET price=$1 WHERE id=$2 RETURNING *;", [price, id])
        res.json(result.rows[0])
    }
    catch (error) {
        res.status(404).json("Order not found", error)
    }
})


// Route to DELETE order (with the id)

ordersRouter.delete("/:id", async (req, res) => {
    const {id} = req.params
    try {
        const result = await pool.query(
            "DELETE FROM orders WHERE id=$1 RETURNING *;", [id])
        res.json(result.rows[0])
    }
    catch (error) {
        res.status(404).json("Order not found", error)
    }
})



export default ordersRouter;