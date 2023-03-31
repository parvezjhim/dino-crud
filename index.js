// required packages
const express = require('express')
const fs = require('fs')

// app config
const app = express()
const PORT = 8000
app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: false }))

// helper function to read the dino db
const readDinos = () => {
    // use the filesystem to read the dino json
    const dinosaurs = fs.readFileSync("./dinosaurs.json")
    // parse the raw json to js
    const dinoData = JSON.parse(dinosaurs)
    // return the dino data
    return dinoData
}

// readDinos()

// routes
// GET / -- index show route for the app
app.get('/', (req, res) => {
    res.render("index.ejs")
})

// GET /dinosaurs -- READ return an array of dinos
app.get('/dinosaurs', (req, res) => {
    let dinos = readDinos()
    console.log(req.query)

    // if the user has searched, filter the dinos array
    if(req.query.dinoFilter) {
        dinos = dinos.filter(dino => {
            // compare lower case strings for case insensitivity
            console.log(dino)
            return dino.name.toLowerCase().includes(req.query.dinoFilter.toLowerCase())
        })
    }

    res.render("dinos/index.ejs", {
        // equal to { dinos: dinos }
        dinos
    })
})

// GET /dinosuars/new -- show route for a form that posts to POST /dinosaurs
app.get('/dinosaurs/new', (req, res) => {
    res.render("dinos/new.ejs")
})

// POST /dinosaurs -- CREATE a new dino in the db
app.post('/dinosaurs', (req, res) => {
    console.log(req.body) // POST form data shows up in the req.body
    const dinos = readDinos()
    // push the dino from the req.body into the array json dinos
    dinos.push(req.body)
    // write the json file to save to disk
    fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinos))
    // tell the browser to redirect 
    // do another GET request on a specific url
    res.redirect('/dinosaurs')
})

// GET /dinosaurs/:id -- READ a single dino @ :id
app.get('/dinosaurs/:id', (req, res) => {
    // read the dino json data
    const dinos = readDinos()
    // lookup one dino using the req.params
    const foundDino = dinos[req.params.id]
    // render the details template
    res.render("dinos/details.ejs", {
        dino: foundDino,
        id: req.params.id
    })
})

// listen on a port
app.listen(PORT, () => {
    console.log(`is that RESTful dinos I hear? on port ${PORT} 🦕`)
})