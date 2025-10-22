require("dotenv").config()


function auth(req,res,next){

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader === `Bearer ${process.env.ACCESS_TOKEN}`) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }

}

module.exports = auth;