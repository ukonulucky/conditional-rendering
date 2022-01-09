const express = require("express");
const router = require("./project2/Routes")
const bodyParser=  require("body-parser")
 
 const dbConnect = require("./project2/model/dbConnect")
const app = express();

app.use(bodyParser.json())
app.use(express.static("static"))
app.use("/api",router)

const PortNumber= process.env.Port || 4000

const connection = async(req,res) => {
    try { data = await dbConnect();
        data && app.listen(PortNumber, () => {
            console.log(`database connected and server running on ${PortNumber}`)
            })
           
    } catch (error) {
    console.log({
        error: error.message
          })
     process.exit(1)
        
    }
}
 connection()