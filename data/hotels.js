import Hotel from '../schema/Hotel.js';

const create = async (name, manager) => {
	// TODO: add validation for fields
	// name: valid string
	// manager: valid ObjectId
	// manager: check if User with this ObjectId exists

	const newHotel = new Hotel({ name, manager });
	const hotel = await newHotel.save();

	if (!hotel) throw new Error("Couldn't create hotel!");

	return hotel;
};

const get = async (hotelId) => {
	// TODO: find hotel with _id: hotelId
	// hotelId: valid ObjectId -> check if hotel exists
	// return hotel
};

const update = async (hotelId, name, description) => {
	// TODO: add validation for fields
	// hotelId: valid ObjectId -> check if hotel exists
	// name: valid string
	// description: valid string
	// return the updated Hotel
};

const remove = async (hotelId) => {
	// TODO: add validation for fields
	// hotelId: valid ObjectId -> check if hotel exists
	// return the removed Hotel
};

const getAll = async () => {
	const hotels = await Hotel.find().populate('manager');

	return hotels;
};

const createRoom = async (hotelId, type, number, price) => {
	// TODO: create a new Room in hotel with _id: hotelId
	// hotelId: valid ObjectId -> check if hotel exists
	// type: valid string
	// number: valid number
	// price: valid number
};

const getRoom = async (hotelId, roomId) => {
	// TODO: get room with _id: roomId of a hotel with _id: hotelId
	// hotelId: valid ObjectId -> check if hotel exists
	// roomId: valid ObjectId -> check if room exists
	// return room
};

const updateRoom = async (hotelId, roomId, type, number, price) => {
	// TODO: update room with _id: roomId in hotel with _id: hotelId
	// hotelId: valid ObjectId -> check if hotel exists
	// roomId: valid ObjectId -> check if room exists
	// Validation fields-
	// type: valid string (optional)
	// number: valid number (optional)
	// price: valid number (optional)
	// return updated room
};

const removeRoom = async (hotelId, roomId) => {
	// TODO: delete room with _id: roomId in hotel with _id: hotelId
	// hotelId: valid ObjectId -> check if hotel exists
	// roomId: valid ObjectId -> check if room exists
	// return deleted room
};

const bookRoom = async (hotelId, roomId, bookedBy, bookedFrom, bookedTill) => {
	// TODO: book room with _id: roomId in hotel with _id: hotelId
	// hotelId: valid ObjectId -> check if hotel exists
	// roomId: valid ObjectId -> check if room exists
	// Validation fields-
	// bookedBy: valid ObjectId -> check if user exists
	// bookedFrom: valid Date -> check if date is in the future
	// bookedTill: valid Date -> check if date is in the future AND after bookedFrom date
	// return booking status and booked room
};

const getAllRooms = async (hotelId) => {
	// TODO: get all rooms of a hotel with _id: hotelId
	// hotelId: valid ObjectId -> check if hotel exists
	// return rooms
};

export default {
	create,
	get,
	update,
	remove,
	getAll,
	createRoom,
	getRoom,
	updateRoom,
	removeRoom,
	bookRoom,
	getAllRooms,
};
