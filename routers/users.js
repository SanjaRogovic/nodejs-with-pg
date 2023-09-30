import  express  from "express";
const usersRouter = express.Router()
import pg from "pg"
const {Pool} = pg

const pool = new Pool()

// TESTING DATABASE CONNECTION
//   pool.query("SELECT NOW()")
//   .then(data => console.log("data retrieved", data.rows[0]))
//   .catch(error => console.log("error retrieved", error))
//   console.log(process.env.PGUSER)


// ROUTE to ALL USERS - GET method

usersRouter.get("/", async (req,res) => {
    try {
        const result = await pool.query("SELECT * FROM users;")
        // console.log(result.rows)
        res.json(result.rows)
    }
    catch (error) {
        res.status(404).json(error)
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
        res.status(404).json (error)
    }
})


// ROUTE to create a NEW USER - POST method

usersRouter.post("/", async (req, res) => {
    const {first_name, last_name, age} = req.body;
    console.log(req.body)
    try {
        const result = await pool.query("INSERT INTO users (first_name, last_name, age) VALUES ($1, $2, $3) RETURNING *;", [first_name, last_name, age])
        res.json(result.rows[0])
    }
    catch (error) {
        res.status(500).json(error)
    }
    
})

  export default usersRouter;
