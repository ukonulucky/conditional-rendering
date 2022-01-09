const express = require("express");
const cookieParser = require("cookie-parser");

const dbConnect = require("./project3/db/dbConnect")
const router = require("./project3/router/router")
const {checkUser } = require("./project3/Authmiddleware/AuthenRoutes")

const app = express();

const port = process.env.Port || 5000;
app.use(express.static("./views/public"))
app.use(cookieParser())
app.set("view engin", "ejs")
app.use(express.json())

// the * simple tells node to use the checkUser routes for all get request
 
app.get("*", checkUser)

app.use(router)

const connection = async() => {
    try {
        const data = await dbConnect();
   
        data && app.listen(port, () => {
            console.log(`Datebase connected and server running on port ${port}`)
        })
    
    } catch (error) {
        console.log({
            error: error.message
        })
}

}
connection()

