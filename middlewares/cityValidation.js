// City Validation Middleware

const validateCity = (req,res,next)=>{
    const city = req.query.city

    if(!city || !/^[a-zA-Z ]+$/.test(city)){
        res.status(404).json({"msg":"Invalid City format"})
    }
    next()
}

module.exports = {
    validateCity
}