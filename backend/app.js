const bodyParser = require('body-parser');
const express =  require('express');
const mongoose = require('mongoose')
const path = require('path');

const postRoutes = require("./routes/posts");


const app = express();
mongoose.connect("mongodb+srv://polakitow:kprZlxyGiDuyaLxn@cluster0.jgsirse.mongodb.net/node-angular?retryWrites=true&w=majority").then(() => {
  console.log('Connected to database')
}).catch(() => {
  console.log('connection failed')
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/images", express.static(path.join("backend/images")));


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  next();
});

app.use("/api/posts", postRoutes);

module.exports = app;
