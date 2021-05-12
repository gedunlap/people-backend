///////////////////////////////
// DEPENDENCIES
////////////////////////////////

// (1) get .env variables
require('dotenv').config()
// (1) pull port from .env, give default value of 3000
// (2) pull MONGODB_URL from .env
const {PORT = 3000, MONGODB_URL} = process.env
// (1) import express
const express = require('express')
// (1) creat application object
const app = express()
// (2) import mongoose
const mongoose = require('mongoose')

// (3) import middleware
const cors = require('cors')
const morgan = require('morgan')


///////////////////////////////
// DATABASE CONNECTION
////////////////////////////////

// (2) Establish Connection
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
// (2) Connection Events
mongoose.connection
    .on('open', () => console.log('You are connected to mongoose'))
    .on('close', () => console.log('You are disconnected from mongoose'))
    .on('error', (error) => console.log(error))


///////////////////////////////
// MODELS
////////////////////////////////

// (3)
const PeopleSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String,
})

const People = mongoose.model("People", PeopleSchema)


///////////////////////////////
// MIDDLEWARE - always before routes
////////////////////////////////

// (3)
app.use(cors()) // to prevent cors errors, open acess to all origins
app.use(morgan('dev')) //logging
app.use(express.json()) //parse json bodies


///////////////////////////////
// ROUTES
////////////////////////////////

// (1) create a test route
app.get('/', (req, res) => {
    res.send("Hello Garrett")
})

// (3) PEOPLE INDEX ROUTE
app.get('/people', async (req, res) => {
    try{
        //send all people
        res.json(await People.find({}))
    } catch (error) {
        //send error
        res.status(400),json(error)
    }
})

// (3) PEOPLE CREATE ROUTE
app.post('/people', async (req, res) => {
    try {
        // send all people
        res.json( await People.create(req.body))
    } catch (error) {
        // send error
        res.status(400).json(error)
    }
})

// (4) PEOPLE UPDATE ROUTE
app.put('/people/:id', async (req, res) => {
    try {
        res.json (
            await People.findByIdAndUpdate(req.params.id, req.body, {new: true})
        )
    } catch (error) {
        res.status(400).json(error)
    }
})

// (4) PEOPLE DELETE ROUTE
app.delete('/people/:id', async (req, res) => {
    try {
        res.json(await People.findByIdAndRemove(req.params.id))
    }  catch (error) {
        res.status(400).json(error)
    }
})


///////////////////////////////
// LISTENER (1)
////////////////////////////////
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`))