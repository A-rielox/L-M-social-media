// '/api/users'
const User = require('../models/User');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

// update user
router.put('/:id', async (req, res) => {
   // solo si es él o el admin pueden hacer update
   if (req.body.userId === req.params.id || req.body.isAdmin) {
      if (req.body.password) {
         try {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
         } catch (error) {
            return res.status(500).json(error);
         }
      }

      try {
         const user = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body,
         }); // updatea todos los inpus q esten en el body

         res.status(200).json('Account has been updated');
      } catch (error) {
         return res.status(500).json(error);
      }
   } else {
      return res.status(403).json('You can update only your account!');
   }
});

// delete user
router.delete('/:id', async (req, res) => {
   // solo si es el o el admin pueden hacer update
   if (req.body.userId === req.params.id || req.body.isAdmin) {
      try {
         await User.findByIdAndDelete(req.params.id); // updatea todos los inpus q esten en el body

         res.status(200).json('Account has been deleted');
      } catch (error) {
         return res.status(500).json(error);
      }
   } else {
      return res.status(403).json('You can delete only your account!');
   }
});

// get a user
router.get('/', async (req, res) => {
   const userId = req.query.userId;
   const username = req.query.username;

   try {
      // ? await User.findById(req.params.id)
      const user = userId
         ? await User.findById(userId)
         : await User.findOne({ username });
      // ⭐                                                          👇
      const { password, updatedAt, _id, createdAt, isAdmin, __v, ...other } =
         user._doc;

      res.status(200).json(other);
   } catch (error) {
      res.status(500).json(error);
   }
});

// follow a user
router.put('/:id/follow', async (req, res) => {
   if (req.body.userId !== req.params.id) {
      try {
         const user = await User.findById(req.params.id); // el q quiero seguir
         const currentUser = await User.findById(req.body.userId); // yo

         //si NO estoy en sus followers
         if (!user.followers.includes(req.body.userId)) {
            // pushea en el q quiero seguir, en sus followers, mi id
            await user.updateOne({ $push: { followers: req.body.userId } });

            //pushea en mis following al q quiero seguir
            await currentUser.updateOne({
               $push: { followings: req.params.id },
            });

            res.status(200).json('You now follow this user');
         } else {
            // si ya estoy en sus followers
            res.status(403).json('you allready follow this user');
         }
      } catch (error) {
         res.status(500).json(err);
      }
   } else {
      res.status(403).json('you cant follow yourself');
   }
});
// unfollow a user
router.put('/:id/unfollow', async (req, res) => {
   if (req.body.userId !== req.params.id) {
      try {
         const user = await User.findById(req.params.id); // el q quiero seguir
         const currentUser = await User.findById(req.body.userId); // yo

         //si NO estoy en sus followers
         if (user.followers.includes(req.body.userId)) {
            // pullea en el q quiero seguir, en sus followers, mi id
            await user.updateOne({ $pull: { followers: req.body.userId } });

            //pullea en mis following al q quiero seguir
            await currentUser.updateOne({
               $pull: { followings: req.params.id },
            });

            res.status(200).json('You now unfollow this user');
         } else {
            // si ya estoy en sus followers
            res.status(403).json("you don't follow this user");
         }
      } catch (error) {
         res.status(500).json(err);
      }
   } else {
      res.status(403).json('you cant unfollow yourself');
   }
});

module.exports = router;
