import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import auth from "./routes/auth.js"
import events from "./routes/events.js"
import { connectDB } from "./config/db.js"
import { corsConfig } from "./config/cors.js"

dotenv.config()
connectDB()
const app = express()
app.use(cors(corsConfig))

app.use(express.static('public'))
app.use(express.json())

app.use('/api/auth', auth)
app.use('/api/events', events)

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})