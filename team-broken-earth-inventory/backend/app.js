const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const itemsRoutes = require("./routes/items");
const userRoutes = require("./routes/user");

const app = express();

console.log(process.env);
mongoose.connect("mongodb+srv://sam:" + process.env.MONGO_ATLAS_PW + "@tbe-inventory-def3a.mongodb.net/tbe-inventory?retryWrites=true&w=majority")
.then(() => {
    console.log('connection is working')
})
.catch(() => {
    console.log('connection failed')
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers", 
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
        );
    res.setHeader(
        "Access-Control-Allow-Methods", 
        "GET, POST, PATCH, PUT, DELETE, OPTIONS"
        );
    next();
});

app.use("/api/items", itemsRoutes);
app.use("/api/users", userRoutes);

module.exports = app;