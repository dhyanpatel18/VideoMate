import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const likedBy = req.user?._id;
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, 'Invalid video id');
    }
    
    const existing = await Like.findOne({ video: videoId, likedBy });
    if (existing) {
        await existing.deleteOne();
        return res.status(200).json(new ApiResponse(200, {}, 'Video unliked'));
    } else {
        await Like.create({ video: videoId, likedBy });
        return res.status(200).json(new ApiResponse(200, {}, 'Video liked'));
    }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const likedBy = req.user?._id;
    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, 'Invalid comment id');
    }
    const existing = await Like.findOne({ comment: commentId, likedBy });
    if (existing) {
        await existing.deleteOne();
        return res.status(200).json(new ApiResponse(200, {}, 'Comment unliked'));
    } else {
        await Like.create({ comment: commentId, likedBy });
        return res.status(200).json(new ApiResponse(200, {}, 'Comment liked'));
    }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const likedBy = req.user?._id;
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, 'Invalid tweet id');
    }
    const existing = await Like.findOne({ tweet: tweetId, likedBy });
    if (existing) {
        await existing.deleteOne();
        return res.status(200).json(new ApiResponse(200, {}, 'Tweet unliked'));
    } else {
        await Like.create({ tweet: tweetId, likedBy });
        return res.status(200).json(new ApiResponse(200, {}, 'Tweet liked'));
    }
});

const getLikedVideos = asyncHandler(async (req, res) => {
    const likedBy = req.user?._id;
    const likes = await Like.find({ likedBy, video: { $ne: null } }).populate('video');
    const videos = likes.map(like => like.video);
    return res.status(200).json(new ApiResponse(200, videos, 'Liked videos fetched successfully'));
});

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}