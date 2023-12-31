import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export const BookingSchema = new Schema({
	hotel: { type: mongoose.ObjectId, ref: 'Hotel', required: true },
	room: { type: mongoose.ObjectId, ref: 'Room', required: true },
	finalAmount: { type: Number, required: true },
	bookedBy: { type: mongoose.ObjectId, ref: 'User', required: true },
	bookedFrom: { type: Date, required: true },
	bookedTill: { type: Date, required: true },
});

export default mongoose.model('Booking', BookingSchema);
