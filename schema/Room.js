import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
	roomName: { type: String, required: true },
	roomCapacity: { type: Number, required: true },
	roomPrice: { type: Number, required: true },
	bookedBy: { type: mongoose.ObjectId, ref: 'User', default: null },
	bookedFrom: { type: Date, default: null },
	bookedTill: { type: Date, default: null },
});

export default mongoose.model('Room', RoomSchema);
