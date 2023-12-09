import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export const RoomSchema = new Schema({
	type: { type: String, required: true },
	number: { type: Number, required: true },
	price: { type: Number, required: true },
	bookedBy: { type: mongoose.ObjectId, ref: 'User', default: null },
	bookedFrom: { type: Date, default: null },
	bookedTill: { type: Date, default: null },
});

export default mongoose.model('Room', RoomSchema);
