import express from "express"
import cors from "cors"
import { Request, Response } from "express"
import dotenv from "dotenv"
import { postRouter } from "./router/postRouter"
import { userRouter } from "./router/userRouter"
import { commentRouter } from "./router/commentRouter"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.listen(Number(process.env.PORT) || 3003, () => {
    console.log(`Servidor rodando na porta ${Number(process.env.PORT) || 3003}`)
})


app.use("/users",userRouter)
app.use("/posts",postRouter)
app.use("/comments",commentRouter)
