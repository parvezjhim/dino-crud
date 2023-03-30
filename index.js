// required packages
const express = require('express')
const fs = require('fs')

//app config
const app = express()
const PORT = 8000
app.set("view engine", "ejs")
app.use(express.urlencoded({extended: false}))

// heloper function to read the dino db 
const readDinos = () =>{
    // use the file system to read the dino json
    const dinosaurs = fs.readFileSync("./dinosaurs.json")
    // parse the raw json to js
    const dinoData = JSON.parse(dinosaurs)
    // return the dino data
    return dinoData
}

// readDinos()

//routes
//GET / -- INDEX SHOW ROUTE FOR THE APP
app.get('/', (req, res)=>{
    res.render("index.ejs")
})

// GET /dinosaurs -- READ return an array of dinos 
app.get('/dinosaurs', (req, res) =>{
    const dinos = readDinos()
    res.render("dinos/index.ejs", {
        // equal to dinos: dinos
        dinos
    })  
})

// GET /dinosaurs/new -- show route for a form that posts to POST /dinosaurs
app.get('/dinosaurs/new', (req, res) =>{
    res.render('dinos/new.ejs')
})

//POST /dinosaurs --- CREATE a new dino in the db
app.post('/dinosaurs', (req, res)=>{
    const dinos = readDinos()
    //push the dino from the req.body into the array json dinos 
    dinos.push(req.body)
    // write the json file to save to disk
    fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinos))
    //tell the browser to redirect 
    // do another get request on a specific url 
    res.redirect('/dinosaurs')
})

// GET /dinosaurs/:id -- READ  a single dino @ :id
app.get('/dinosaurs/:id', (req, res)=>{
    res.send('show details about dino id:' + req.params.id)
})

//listen on a port
app.listen(PORT, () =>{
    console.log(`is that RESTful dinos i hear on port ${PORT}?`)
})