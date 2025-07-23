import { Router } from "express";
import {
  createTweet,
  getUserTweets,
  updateTweet,
  deleteTweet
} from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Create a tweet
router.post('/', verifyJWT, createTweet);

// Get all tweets for a user
router.get('/user/:userId', getUserTweets);

// Update a tweet
router.patch('/:tweetId', verifyJWT, updateTweet);

// Delete a tweet
router.delete('/:tweetId', verifyJWT, deleteTweet);

export default router;