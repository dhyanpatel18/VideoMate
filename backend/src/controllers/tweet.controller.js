import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.models.js"
import {User} from "../models/user.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const owner = req.user?._id;
    if (!content) {
        throw new ApiError(400, 'Content is required');
    }
    const tweet = await Tweet.create({ content, owner });
    return res.status(201).json(new ApiResponse(201, tweet, 'Tweet created successfully'));
});

const getUserTweets = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, 'Invalid user id');
    }
    const tweets = await Tweet.find({ owner: userId }).sort({ createdAt: -1 }).populate('owner', 'username fullname avatar');
    return res.status(200).json(new ApiResponse(200, tweets, 'User tweets fetched successfully'));
});

const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const { content } = req.body;
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, 'Invalid tweet id');
    }
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
        throw new ApiError(404, 'Tweet not found');
    }
    if (String(tweet.owner) !== String(req.user._id)) {
        throw new ApiError(403, 'Not authorized to update this tweet');
    }
    if (content) tweet.content = content;
    await tweet.save();
    return res.status(200).json(new ApiResponse(200, tweet, 'Tweet updated successfully'));
});

const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, 'Invalid tweet id');
    }
    
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
        throw new ApiError(404, 'Tweet not found');
    }
    if (String(tweet.owner) !== String(req.user._id)) {
        throw new ApiError(403, 'Not authorized to delete this tweet');
    }
    await tweet.deleteOne();
    return res.status(200).json(new ApiResponse(200, {}, 'Tweet deleted successfully'));
});

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}