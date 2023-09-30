import  express  from "express";
const usersRouter = express.Router()
import pg from "pg"
const {Pool} = pg

const pool = new Pool()

//   pool.query("SELECT NOW()")
//   .then(data => console.log("data retrieved", data.rows[0]))

//   console.log(process.env.PGUSER)

  export default usersRouter;
