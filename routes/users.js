import  express  from "express";
const usersRouter = express.Router()
import pool from "../db/pool.js";
import {body, validationResult} from "express-validator"


// TESTING DATABASE CONNECTION
//   pool.query("SELECT NOW()")
//       .then(data => console.log("data retrieved", data.rows[0]))
//       .catch(error => console.log("error retrieved", error))
//   console.log(process.env.PGUSER)


// USER VALIDATION 
const userValidation = [
    body("first_name").isString().notEmpty(),
    body("last_name").isString().notEmpty(),
    body("age").isInt({ min: 1 }).exists()
]

// Validator for PUT method - partial edit of a user
/* Marks the current validation chain as optional. An optional field skips validation depending on its value, instead of failing it.
Modifier .optional() is not positional: it'll affect how values are interpreted, no matter where it happens in the chain.*/
const partialEditValidator = [
    body('first_name').isString().notEmpty().isLength({ min: 1 }).optional(),
    body('last_name').isString().exists().isLength({ min: 1 }).optional(),
    body('age').isInt().exists().isLength({ min: 1 }).optional()
]


// ROUTE to ALL USERS - GET method

usersRouter.get("/", async (req,res) => {
    try {
        const result = await pool.query("SELECT * FROM users;")
        res.json(result.rows)
    }
    catch (error) {
        res.status(404).json({message: "Users not found"})
    }
})


// ROUTE to ONE USER (with the id) - GET method

usersRouter.get("/:id", async (req, res) => {
    const {id} = req.params
    try {
        const result = await pool.query("SELECT * FROM users WHERE id=$1;", [id])
        res.json(result.rows[0])
    }
    catch (error) {
        res.status(404).json ({message: "User not found"})
    }
})



// ROUTE to CREATE a NEW USER - POST method

usersRouter.post("/", userValidation, async (req, res) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        return res.status(400).json({"UNSUCCESSFUL - User not created": errors.array()})
    }

    const {first_name, last_name, age} = req.body;
    // console.log(req.body)
    try {
        const result = await pool.query(
            "INSERT INTO users (first_name, last_name, age) VALUES ($1, $2, $3) RETURNING *;", [first_name, last_name, age])
        res.json(result.rows[0])
    }
    catch (error) {
        res.status(500).json(error)
        }   
    })



// ROUTE to EDIT one user (with the id) - PUT method  

usersRouter.put("/:id", partialEditValidator, async (req, res) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        return res.status(400).json({"EDIT INVALID": errors.array()})
    }

    const {id} = req.params
    const {first_name, last_name, age} = req.body
    try {
        const result = await pool.query(
            "UPDATE users SET first_name=$1, last_name=$2, age=$3 WHERE id=$4 RETURNING *;", [first_name, last_name, age, id])
            if(result.rows.length === 0){
                res.status(404).json({message:"User not found"})
            }
        res.json(result.rows[0])
    }
    catch (error) {
        res.status(500).json(error)
    }
})


// Another way for PUT method to edit one user with id 
// usersRouter.put("/:id", async (req, res) => {
//     const {first_name, last_name} = req.body;
//     const {id} = req.params;

//     let setClauses = [];
//     let values = [];
    
//     if (first_name !== undefined) {
//         setClauses.push(`first_name = $${values.length + 1}`);
//         values.push(first_name);
//     }
    
//     if (last_name !== undefined) {
//         setClauses.push(`last_name = $${values.length + 1}`);
//         values.push(last_name);
//     }

//     if (!setClauses.length) {
//         return res.status(400).json({ message: "No fields provided to update" });
//     }

//     values.push(id);
    
//     const query = `UPDATE users SET ${setClauses.join(", ")} WHERE id = $${values.length} RETURNING *`;
//     console.log(query, 'query')
//     try {
//         const {rows} = await pool.query(query, values);
//         if (!rows.length) {
//             return res.status(404).json({ message: "User not found" });
//         }
//         res.json(rows[0]);
//     } catch(err) {
//         res.status(500).json({ message: "Internal server error", error: err.message });
//     }
// })



// Route to DELETE user (with the id)

usersRouter.delete("/:id", async (req, res) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        return res.status(500).json({"UNSUCCESSFUL": errors.array()})
    }

    const {id} = req.params
    try {
        const result = await pool.query(
            "DELETE FROM users WHERE id=$1 RETURNING *;", [id])
        res.json(result.rows[0])
    }
    catch (error) {
        res.status(404).json({message: "User not found"})
    }
})


// *** EXTRA ***

// Route to return all orders of a user - GET method

usersRouter.get("/:id/orders", async (req, res) => {
    const {id} = req.params
    try {
        const result = await pool.query(
            "SELECT users.id, orders.id FROM users, orders WHERE users.id = orders.user_id AND users.id=$1;", [id])
        res.json(result.rows)
    }
    catch (error) {
        res.status(404).json ({message: "Order not found"})
    }
})


// ROUTE to set USER INACTIVE if he has never ordered anything

usersRouter.put("/:id/check-inactive", async (req, res) => {
    const {id }= req.params
    try {
        const result = await pool.query("SELECT * FROM orders WHERE user_id=$1;", [id])
        console.log(result.rows)
            if (result.rows.length === 0) {
                const {rows} = await pool.query("UPDATE users SET active=false WHERE id=$1 Returning *;", [id])
                res.json(rows[0])
            } else {
                res.status(500).json({message: "Update unsuccessful - user has an order"})
            }
    } catch (error) {
        res.status(404).json({message:"User not found"})
    }
})


  export default usersRouter;
