
import {isValidObjectId} from "mongoose"
import {User} from "../models/user.models.js"
import { Subscription } from "../models/subscriptions.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const subscriberId = req.user?._id;
    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, 'Invalid channel id');
    }
    if (String(channelId) === String(subscriberId)) {
        throw new ApiError(400, 'Cannot subscribe to yourself');
    }
    const channelExists = await User.exists({ _id: channelId });
    if (!channelExists) {
      throw new ApiError(404, 'Channel (user) not found');
    }
    const existing = await Subscription.findOne({ channel: channelId, subscriber: subscriberId });
    if (existing) {
        await existing.deleteOne();
        return res.status(200).json(new ApiResponse(200, {}, 'Unsubscribed successfully'));
    } else {
        await Subscription.create({ channel: channelId, subscriber: subscriberId });
        return res.status(200).json(new ApiResponse(200, {}, 'Subscribed successfully'));
    }
});
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, 'Invalid channel id');
    }
    const subscribers = await Subscription.find({ channel: channelId }).populate('subscriber', 'username fullname avatar');
    return res.status(200).json(new ApiResponse(200, subscribers.map(s => s.subscriber), 'Channel subscribers fetched successfully'));
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;
    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, 'Invalid subscriber id');
    }
    const channels = await Subscription.find({ subscriber: subscriberId }).populate('channel', 'username fullname avatar');
    return res.status(200).json(new ApiResponse(200, channels.map(s => s.channel), 'Subscribed channels fetched successfully'));
});

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}
