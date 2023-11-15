import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ReviewSchema = Schema({
	author: { type: mongoose.ObjectId, ref: 'User' },
	content: { type: String, default: null },
	rating: { type: Number, required: true },
	createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Review', ReviewSchema);
