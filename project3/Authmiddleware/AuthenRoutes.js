const jwt = require("jsonwebtoken")
const myUserSchema = require("../db/model")

const Authroutes = (req, res, next) => {
    const token = req.cookies.logintoken
    if (token) {
        console.log(token)
        const authValidation = jwt.verify(token,"great day",
            (error, decodedToken) => {
                if (error) {
                res.redirect("/login_page")
                } else {
                    next()
                }
        })
    } else {
      res.redirect("/login_page")
    }
}

// check users transfers the user email from the database to the index.ejs page 
const checkUser = (req, res, next) => {
    const token = req.cookies.logintoken
   
    if (token) {
        console.log(token)
        const authValidation = jwt.verify(token, "great day", async (error, decodedToken) => {
            if (error) {
                    res.locals.user = null
                    next()
            } else {
                console.log(decodedToken)
            
                    let newUser = await myUserSchema.find({
                        _id: decodedToken.id
                    })
                   console.log(newUser)
                res.locals.user = newUser[0].email
                console.log(res.locals.user)
                     next()
                }
            })
    } else {
        res.locals.user = null
        next()
    }

}

module.exports = {
    Authroutes, checkUser
}


