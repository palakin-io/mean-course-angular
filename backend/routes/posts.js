const express = require("express");

const Post = require('../models/post');
const multer = require('multer');

const router = express.Router();

const MYME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MYME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid myme type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split('').join('-');
    const ext = MYME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

router.post("", multer({storage: storage}).single("image"), (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: "succesful :)",
      post: {
        id: createdPost._id,
        title: createdPost.title,
        content: createdPost.content,
        imagePath: createdPost.imagePath
      }
    });
  });
});

router.get('', (req, res, next) => {
  Post.find().then(documents => {
    res.status(200).json({
      message: 'succesfull',
      posts: documents
    });
  });
});

router.delete('/:id', (req, res, next) => {
  Post.deleteOne({_id: req.params.id}).then((result) => {
    console.log(result);
    res.status(200).json({message: 'Post Deleted'});
  })
})

module.exports = router;
