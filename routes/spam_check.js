const express = require("express")
const SpamFilter = require("../utils/spam_filter")

const router = express.Router()

router.post("/spam-check", async(req,res)=> {
    const {message} = req.body;
    try {
        const filter = new SpamFilter()
        const response = await filter.detectSpam(message)
        if(response.is_spam){
            return res.status(400).json({message: "Spam Detected", message, is_spam: response.is_spam, reason: response.reason, success: false})
        }
        else{
            return res.json({message: "Lead passed spam filter", is_spam: response.is_spam, success: true})
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({message: error.message, success: false})
    }
    
})

module.exports = router;