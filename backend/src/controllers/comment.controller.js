import mongoose from "mongoose"
import {Comment} from "../models/comment.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, 'Invalid video id');
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const comments = await Comment.find({ video: videoId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('owner', 'username fullname avatar');
    const total = await Comment.countDocuments({ video: videoId });
    return res.status(200).json(new ApiResponse(200, { comments, total, page: parseInt(page), limit: parseInt(limit) }, 'Comments fetched successfully'));
});

const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { content } = req.body;
    const owner = req.user?._id;
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, 'Invalid video id');
    }
    if (!content) {
        throw new ApiError(400, 'Content is required');
    }
    const comment = await Comment.create({ content, video: videoId, owner });
    return res.status(201).json(new ApiResponse(201, comment, 'Comment added successfully'));
});

const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, 'Invalid comment id');
    }
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, 'Comment not found');
    }
    if (String(comment.owner) !== String(req.user._id)) {
        throw new ApiError(403, 'Not authorized to update this comment');
    }
    if (content) comment.content = content;
    await comment.save();
    return res.status(200).json(new ApiResponse(200, comment, 'Comment updated successfully'));
});

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, 'Invalid comment id');
    }
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, 'Comment not found');
    }
    if (String(comment.owner) !== String(req.user._id)) {
        throw new ApiError(403, 'Not authorized to delete this comment');
    }
    await comment.deleteOne();
    return res.status(200).json(new ApiResponse(200, {}, 'Comment deleted successfully'));
});

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }