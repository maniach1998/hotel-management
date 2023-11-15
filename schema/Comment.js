import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CommentSchema = Schema({
	author: { type: mongoose.ObjectId, ref: 'User', required: true },
	content: { type: String, required: true },
	replies: [{ type: mongoose.ObjectId, ref: 'Comment' }],
	createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Comment', CommentSchema);
