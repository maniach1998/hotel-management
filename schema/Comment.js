import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CommentSchema = Schema({
	hotel: { type: mongoose.ObjectId, ref: 'Hotel' },
	author: { type: mongoose.ObjectId, ref: 'User', required: true },
	content: { type: String, required: true },
	replies: [{ type: mongoose.ObjectId, ref: 'Comment' }],
	createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Comment', CommentSchema);
