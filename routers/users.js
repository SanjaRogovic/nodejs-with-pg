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


// ROUTE to ALL USERS

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

  export default usersRouter;
