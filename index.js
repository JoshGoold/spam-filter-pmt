const express = require("express")
const auth = require("./middleware/auth")
const spam_check = require("./routes/spam_check")
const cors = require("cors")

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors({origin: true}))
app.get("/", (req,res)=> {
    res.json({message: "PMT Forklifts - API (Spam Filter)", status: "Server Running"})
})

app.use(auth)
app.use("/", spam_check)

module.exports = app;
