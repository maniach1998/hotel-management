import mongoose from 'mongoose';
const Schema = mongoose.Schema;

import { CommentSchema } from './Comment.js';

export const RoomSchema = new Schema({
	type: { type: String, required: true },
	number: { type: Number, required: true },
	price: { type: Number, required: true },
	bookedBy: { type: mongoose.ObjectId, ref: 'User', default: null },
	bookedFrom: { type: Date, default: null },
	bookedTill: { type: Date, default: null },
});

export const ReviewSchema = new Schema({
	author: { type: mongoose.ObjectId, ref: 'User' },
	content: { type: String, default: null },
	rating: { type: Number, required: true },
	createdAt: { type: Date, default: Date.now },
});

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
