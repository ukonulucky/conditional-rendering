// const fs = require("fs")
// const http = require("http")

// const server = http.createServer((req, res) => {
  
//     if (req.url === "/home" || req.url === "/") {
//         res.writeHead(200, {
//             "Content-Type": "text/html"
//            })
//         const value = fs.createReadStream(__dirname + "/index.html", "utf8");
//             value.pipe(res);
//     } else if (req.url === "/contact") {
//         res.writeHead(200, {
//             "Contaent-Type":"text/html"
//         })
//         const value2 = fs.createReadStream(__dirname + "/contact.html", "utf8")
//         value2.pipe(res)

//     } else if (req.url === "/api/data") {
//         res.writeHead(200, {
//             "Content-Type": "application.json"
//         })
//         const person = [{
//             name: "lucky",
//             age: "12"
//         }]
//         res.end(JSON.stringify(person))
//     } else {
//         res.end("page not found")
//     }
    

// })

// server.listen(3000, () => {
//     console.log("server running on port 3000")
// })

const express = require("express")
const fs = require("fs")
const app = express()
const bodyParser = require("body-parser")
app.set("view engine", "ejs")
const urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get("/home", (req,res) => {
  res.render("index.ejs")
})
app.use("/assets",express.static("./assets"))
app.get("/", (req,res) => {
    res.render("index.ejs")
  })
app.get("/item/:id", (req, res) => {
  const data = {
    age: 12,
    class: "SS3",
    hobbies: ["running","gaming", "reading","swimming"]
  }
  res.render("Profile", {
    person: req.params.id,
   data:data
  })
})
app.get("/contact", (req, res) => {
  res.render("contact.ejs", {qs:req.query})
})
app.post("/contact", urlencodedParser, (req, res) => {
  if (!req.body) {
    res.sendStatus(404)
  } else {
    res.render("contactSuccess.ejs", {data:req.body})
  }
 
})
app.get("/info", (req, res) => {
  console.log("hi")
  res.end()
})

app.listen(3000, () => {
    console.log("server running on port 3000")
})
