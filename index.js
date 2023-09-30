import express from "express";
import 'dotenv/config';
import usersRouter from "./routers/users.js"
import ordersRouter from "./routers/orders.js";

const app = express()

app.use(express.json())
app.use("/api/users", usersRouter)
app.use("/api/orders", ordersRouter)

const port = process.env.PORT || 8080


app.listen(port, () => {
    console.log(`Server listening on port: ${port}`)
})