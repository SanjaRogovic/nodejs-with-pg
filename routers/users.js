import  express  from "express";
const usersRouter = express.Router()
import pool from "../pool.js";
import {body, validationResult} from "express-validator"


// TESTING DATABASE CONNECTION
//   pool.query("SELECT NOW()")
//       .then(data => console.log("data retrieved", data.rows[0]))
//       .catch(error => console.log("error retrieved", error))
//   console.log(process.env.PGUSER)


// USER VALIDATION for both POST and PUT method
const userValidation = [
    body("first_name").isString().exists().withMessage("Only string accepted"),
    body("last_name").isString().exists().withMessage("Only string accepted"),
    body("age").isInt().exists().withMessage("Whole number only")
]


// ROUTE to ALL USERS - GET method

usersRouter.get("/", async (req,res) => {
    try {
        const result = await pool.query("SELECT * FROM users;")
        res.json(result.rows)
    }
    catch (error) {
        res.status(404).json( error)
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
        res.status(404).json ({"User not found": error})
    }
})



// ROUTE to CREATE a NEW USER - POST method

usersRouter.post("/", userValidation, async (req, res) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        return res.status(404).json({"UNSUCCESSFUL - User not created": errors.array()})
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

usersRouter.put("/:id", userValidation, async (req, res) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        return res.status(404).json({"UNSUCCESSFUL - User not updated": errors.array()})
    }

    const id = req.params.id
    const {first_name, last_name, age} = req.body
    try {
        const result = await pool.query(
            "UPDATE users SET first_name=$1, last_name=$2, age=$3 WHERE id=$4 RETURNING *;", [first_name, last_name, age, id])
        res.json(result.rows[0])
    }
    catch (error) {
        res.status(404).json(error)
    }
})



// PUT method for editing only one column in the users table

// usersRouter.put("/:id", async (req, res) => {
//     const {id} = req.params
//     const {first_name} = req.body
//     try {
//         const result = await pool.query(
//             "UPDATE users SET first_name=$1 WHERE id=$2 RETURNING *;", [first_name, id])
//         res.json(result.rows[0])
//     }
//     catch (error) {
//         res.status(404).json({"User not found": error)}
//     }

// })


// Route to DELETE user (with the id)

usersRouter.delete("/:id", async (req, res) => {
    const {id} = req.params
    try {
        const result = await pool.query(
            "DELETE FROM users WHERE id=$1 RETURNING *;", [id])
        res.json(result.rows[0])
    }
    catch (error) {
        res.status(404).json({"User not found": error})
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
        res.status(404).json ({"Order not found": error})
    }
})


// ROUTE to set USER INACTIVE if he has never ordered anything

// usersRouter.put("/:id/check-inactive", userValidation, async (req, res) => {
//     const errors = validationResult(req)

//     if(!errors.isEmpty()) {
//         return res.status(404).json({"UNSUCCESSFUL - User not updated": errors.array()})
//     }

//     const id = req.params.id
//     const {active} = req.body

//     if (id === active) {

//     }
//     try {
//         const result = await pool.query(
//             "UPDATE users SET active=$1 WHERE id=$2 RETURNING *;", [active, id])
//         res.json(result.rows[0])
//     }
//     catch (error) {
//         res.status(404).json(error)
//     }
// })


  export default usersRouter;
