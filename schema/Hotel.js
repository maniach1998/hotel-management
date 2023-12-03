import mongoose from 'mongoose';
const Schema = mongoose.Schema;

import { ReviewSchema } from './Review.js';
import { CommentSchema } from './Comment.js';
import { RoomSchema } from './Room.js';

const HotelSchema = new Schema({
	name: { type: String, required: true, max: 64 },
	description: { type: String, max: 128 },
	manager: { type: mongoose.ObjectId, ref: 'User', required: true },
	rooms: [RoomSchema],
	comments: [CommentSchema],
	reviews: [ReviewSchema],
	rating: { type: Number, default: 0 },
	createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Hotel', HotelSchema);
