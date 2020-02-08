const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const itemsRoutes = require("./routes/items");
const userRoutes = require("./routes/user");

const app = express();

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);
mongoose.connect("mongodb+srv://sam:" + process.env.MONGO_ATLAS_PW + "@tbe-inventory-def3a.mongodb.net/tbe-inventory?retryWrites=true&w=majority")
.then(() => {
    console.log('connection is working')
})
.catch(() => {
    console.log('connection failed')
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/images", express.static(path.join("images")));

//app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//    res.setHeader(
//        "Access-Control-Allow-Headers", 
//        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//        );
//    res.setHeader(
//       "Access-Control-Allow-Methods", 
//        "GET, POST, PATCH, PUT, DELETE, OPTIONS"
//        );
//    next();
//});

const corsOptions = {
    //origin: 'http://sam-tbe-inventory.s3-website.us-east-2.amazonaws.com',
    origin: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}

app.use(cors(corsOptions));

app.use("/api/items", itemsRoutes);
app.use("/api/users", userRoutes);

module.exports = app;
