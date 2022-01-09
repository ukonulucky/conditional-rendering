const nodemailer = require("nodemailer")
const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")

dotenv.config()

const router = express.Router();
const { Authroutes } = require("../Authmiddleware/AuthenRoutes")
const myUserSchema = require("../db/model")

//creating the nodemailer function for sending mails
  
const mailSender = (newEmail) => {
    const transporter = nodemailer.createTransport('smtps://user%40gmail.com:pass@smtp.gmail.com',{
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user:process.env.Email,
            pass:process.env.Password,
        }
    })
    let mailOptions = {
        from: "ukonulucky@gmail.com",
        to: newEmail,
        subject: "Account Creation",
        text: "Hello admin... You just Created a New account with smartConnect.com"
    }

    transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
        console.log("email error:", err)
        } else {
         console.log("email send successfully")
    }
})

}
//node mailer funtion for password recovery

 
const mailPassword = (newEmail,url) => {
    const transporter = nodemailer.createTransport('smtps://user%40gmail.com:pass@smtp.gmail.com',{
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user:process.env.Email,
            pass:process.env.Password,
        }
    })
    let mailOptions = {
        from: "ukonulucky@gmail.com",
        to: newEmail,
        subject: "Account Creation",
        text: `please click the link ${url} to change/recover your password`
    }

    transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
        console.log("email error:", err)
        } else {
         console.log("email send successfully")
    }
})

}

// error handling function 
const handleError = (error) => {
  const  errors = {
        email:"",
      password: ""
  }
    
 // checking for error for unique email

    if (error.code === 11000) {
        errors.email = "Email already exist"
        return errors
    }


     if (error.message.includes("user validation failed")) {
    const errorArray =(Object.values(error.errors))
         errorArray.forEach((error) => {
             const value = error.properties
             errors[value.path] = value.message
        })
     }
    return errors

}
 
router.get("/",Authroutes, (req,res) => {
    res.render("index.ejs")
   
})
router.get("/logout", (req,res) => {
    res.cookie("logintoken", "", {
        maxAge: 1
    })
    res.redirect("/")

})
router.get("/signup_create", (req,res) => {
    res.render("Signup.ejs")
})
router.get("/login_page", (req,res) => {
    res.render("Login.ejs")
})
router.post("/login_user", async (req, res) => {
    try {
     const newdata = req.body
        let { email, password } = newdata
        const user = await myUserSchema.findOne({
            email: email
      })
      if (user) {
            const userPresence = await bcrypt.compare(password, user.password);
          if (userPresence) {
              const newToken = createToken(user._id)
                  res.cookie("logintoken", newToken, {
                  httpOnly: true,
                  maxAge: time * 1000
              })
              res.status(200).json({
                id: user._id
           })
            } else {
                throw Error("incorrect email or password")
          }
    
      } else {
            throw Error ("incorrect email or password")
      }
    
    } catch (error) {
       const newError = Object.values(error)
        const errorMessage =  handleError(error)
       console.log(newError)
        res.status(400).json({
            error1: errorMessage,
            error2: error.message
        })
    }  
})

router.post("/signup_create", async (req, res) => {
    try {
        user = await myUserSchema.create(req.body)
        console.log(user)
        if (user) {
            // console.log("the user email is:", user.email)
            mailSender(JSON.stringify(user.email)) 
        }
        res.status(200).json({user})
       
    } catch (error) {
    const errorMessage =  handleError(error)
        res.send({
            error:errorMessage
        })
    }
        })
router.get("/signout", (req,res) => {
    res.send("sign out")
})

const time = 60 * 60
//creating a token 
const createToken = (id) => {
    return jwt.sign({ id }, "great day", {
 expiresIn: time
    })
}

//password recovery section

router.post("/password_get", async (req, res) => {
    try {
    const  { email } = req.body
    const userEmail =  await myUserSchema.findOne({
          email: email
    })
    
      if (userEmail) {
          const emailNew = userEmail.email
          const link = `http://localhost:5000/password_recover_new/?id=${userEmail._id}&email=${userEmail.email}`
          mailPassword(emailNew,link)
          res.status(201).json({
              email: userEmail.email,
              id: userEmail._id
          })
      } else {
          throw new Error ("email not registered")
      }

  } catch (error) {
        res.json(
          {error2 : error.message}
      )
  }
})
router.get("/password_retreive", (req, res) => {
     res.render("Password_retrieve.ejs")
}) 

router.get("/password_recover_new", async (req, res) => {
    try {
        // console.log(req.query)
        const { id, email } = req.query
        const userEmail = await myUserSchema.findById(id);
        // console.log(userEmail)
        if (userEmail.email === email) {
            res.redirect(`/change_password?email=${email}`)
        } else {
            res.send("invalid user")
        }
            
         } catch (error) {
         res.status(404).json({error: error.message})    
         }
})

router.get(`/change_password`, (req,res) => {
    const { email } = req.query
    res.render("PasswordChange.ejs", {email})
})

router.put("/password_recover", async (req,res) => {
    try {
        const { email, password } = req.body
        const salt = await bcrypt.genSalt()
        const harshedpassword = await bcrypt.hash(password, salt)
        
        const newPassword = await myUserSchema.findOneAndUpdate({email: email}, {
            password: harshedpassword
        })
        if (newPassword) {
            updatedValue = await myUserSchema.findOne({password:harshedpassword})
            res.status(200).json(updatedValue)
            // console.log("Updated Value is:", updatedValue)
        } else {
            throw new Error("Password failed to Update Successfully")
        }

    } catch (error) {
        console.log(error.message)
      return  res.status(401).json(error.message)
     
    }
})

module.exports = router
