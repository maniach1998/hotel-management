import mongoose from 'mongoose';
import ROLES from '../constants.js';
const Schema = mongoose.Schema;

export const UserSchema = new Schema({
	firstName: { type: String, required: true, max: 64 },
	lastName: { type: String, required: true, max: 128 },
	email: { type: String, required: true, max: 255, unique: true },
	password: { type: String, required: true, max: 512 },
	accountType: { type: String, default: ROLES.USER },
	// bookings: [{ type: mongoose.ObjectId, ref: 'Booking' }],
	createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('User', UserSchema);
