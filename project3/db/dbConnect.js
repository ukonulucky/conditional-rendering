const mongoose = require("mongoose")
const dotenv = require("dotenv")
 dotenv.config()
  
const dbConnect = async() => {
    try {
        db = await  mongoose.connect(process.env.MONGU_URL)
        return db
 } catch (error) {
     console.log({
        error: error.message
    })
     
 }
}

module.exports = dbConnect