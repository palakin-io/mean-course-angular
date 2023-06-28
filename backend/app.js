const bodyParser = require('body-parser');
const express =  require('express');


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = req.body;
  console.log(post);
  res.status(201).json({
    message: "succesful :)"
  });
  next();
});

app.use('/api/posts', (req, res, next) => {
  const posts = [
    {
      id: 'fadf12421l',
      title: 'first server post',
      content: 'adasdadasd'
    },
    {
      id: 'adasdasdasd2123s',
      title: 'first server post',
      content: 'adasdadasd2'
    }
  ]


  res.status(200).json({
    message: 'succesfull',
    posts: posts
  });
});

module.exports = app;
