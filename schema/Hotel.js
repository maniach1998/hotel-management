import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// TODO: add more fields to HotelSchema
// TODO: add rooms for hotels
// TODO: create RoomSchema

const HotelSchema = new Schema({
	name: { type: String, required: true, max: 64 },
	manager: { type: UserSchema, required: true },
});

export default mongoose.model('Hotel', HotelSchema);
