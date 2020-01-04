const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const itemsRoutes = require("./routes/items");

const app = express();

mongoose.connect('mongodb+srv://sam:YWHGxUbIkzqseUFX@tbe-inventory-def3a.mongodb.net/tbe-inventory?retryWrites=true&w=majority')
.then(() => {
    console.log('connection is working')
})
.catch(() => {
    console.log('connection failed')
});

app.use(bodyParser.json());


app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers", 
        "Origin, X-Requested-With, Content-Type, Accept"
        );
    res.setHeader(
        "Access-Control-Allow-Methods", 
        "GET, POST, PATCH, PUT, DELETE, OPTIONS"
        );
    next();
});

app.use("/items", itemsRoutes);

module.exports = app;