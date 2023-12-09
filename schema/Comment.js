import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export const CommentSchema = new Schema({
	hotel: { type: mongoose.ObjectId, ref: 'Hotel' },
	author: { type: mongoose.ObjectId, ref: 'User', required: true },
	content: { type: String, required: true },
	replies: [ReplySchema],
	createdAt: { type: Date, default: Date.now },
});

export const ReplySchema = new Schema({
	author: { type: mongoose.ObjectId, ref: 'User', required: true },
	content: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Comment', CommentSchema);
