//  '/api/posts'
const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User');

//create a post
router.post('/', async (req, res) => {
   const newPost = new Post(req.body);

   try {
      const savedPost = await newPost.save();
      res.status(200).json(savedPost);
   } catch (error) {
      res.status(500).json(error);
   }
});

//update a post
router.put('/:id', async (req, res) => {});

//delete a post
router.delete('/:id', async (req, res) => {});

//like / dislike a post
router.put('/:id/like', async (req, res) => {});

//get a post
router.get('/:id', async (req, res) => {});

//get timeline posts
router.get('/timeline/all', async (req, res) => {});

module.exports = router;
