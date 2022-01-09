const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const validate = require("validator")
 
const {isEmail} = validate

const Schema = mongoose.Schema


const userSchema = new Schema({
    email: {
        type: String,
        required: [true,"Please input an Email"],
        unique: true,
        lowercase: true,
        validate: [isEmail, "Please input a valid email"]
    },

    password: {
        type: String,
        required: [true,"Plese input a Password"],
        minlength: [6, "Minimum password length is 6 characters"],
        
    },
    Date: {
        type: Date,
        default: Date.now
    }
})

 userSchema.pre("save", async function (next){
    const salt = await bcrypt.genSalt()
     this.password = await bcrypt.hash(this.password, salt)
    next()
 })

const myUserSchema = mongoose.model("user", userSchema)
module.exports = myUserSchema