import express from "express"
import "dotenv/config"
import cors from "cors"
import connectDB from "./configs/db.js"
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from "./controllers/clerkWebhooks.js"

connectDB()

const app = express()
app.use(cors()) // enable cross-origin resourece sharign

// middleware 
app.use(express.json())
app.use(clerkMiddleware())

//api to listed cleark webhook
 app.use("/api/clerk", clerkWebhooks);

app.get('/' , (req , res)=> res.send("API is working fine"))

const PORT = process.env.PORT || 3000;

app.listen(PORT , ()=> console.log(`Server is running on port ${PORT}`))
