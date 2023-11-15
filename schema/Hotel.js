import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const HotelSchema = new Schema({
	name: { type: String, required: true, max: 64 },
	manager: { type: mongoose.ObjectId, ref: 'User', required: true },
	rooms: [{ type: mongoose.ObjectId, ref: 'Room' }],
	comments: [{ type: mongoose.ObjectId, ref: 'Comment' }],
	reviews: [{ type: mongoose.ObjectId, ref: 'Review' }],
	rating: { type: Number, default: 0 },
	createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Hotel', HotelSchema);
