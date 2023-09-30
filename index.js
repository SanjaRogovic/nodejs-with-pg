import express from "express";
import 'dotenv/config';
import usersRouter from "./routers/users.js"

const app = express()

app.use(express.json())
app.use("/api/users", usersRouter)


const port = process.env.PORT || 8080


app.listen(port, () => {
    console.log(`Server listening on port: ${port}`)
})