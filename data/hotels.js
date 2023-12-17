import { ObjectId } from 'mongodb';
import { checkCheckout, checkId, checkNumber, checkString } from '../helpers.js';
import Hotel from '../schema/Hotel.js';
import User from '../schema/User.js';

const create = async (name, manager) => {
	// TODO: add validation for fields
	// name: valid string
	// manager: valid ObjectId
	// manager: check if User with this ObjectId exists

	name = checkString(name, 'Name');
	manager = checkId(manager, 'Manager Id');

	const user = await User.findById(manager);
	if (!user)
		throw {
			status: 404,
			message: "Manager with this `authorId` doesn't exist!",
		};

	// Create new hotel
	const newHotel = new Hotel({ name, manager });
	const hotel = await newHotel.save();
	if (!hotel)
		throw {
			status: 500,
			message: "Unexpected error, couldn't create hotel!",
		};

	return hotel;
};

const get = async (hotelId) => {
	// TODO: find hotel with _id: hotelId
	// hotelId: valid ObjectId -> check if hotel exists
	// return hotel
	// Validation
	hotelId = checkId(hotelId, 'Hotel Id');

	// Find and return the hotel
	const hotel = await Hotel.findById(hotelId).populate('manager');
	if (!hotel) throw { status: 404, message: "Couldn't find this hotel!" };

	return hotel;
};

const update = async (hotelId, name, description) => {
	// TODO: add validation for fields
	// hotelId: valid ObjectId -> check if hotel exists
	// name: valid string
	// description: valid string
	// return the updated Hotel

	// Validation
	hotelId = checkId(hotelId, 'Hotel Id');
	name = checkString(name, 'Name');
	description = checkString(description, 'Description');

	// Update the hotel with new content
	const updatedhotel = await Hotel.findByIdAndUpdate(
		hotelId,
		{ name, description },
		{ returnDocument: 'after' }
	);
	if (!updatedhotel)
		throw {
			status: 404,
			message: "hotel with this hotelId doesn't exist!",
		};

	return updatedhotel.populate('manager');
};

const remove = async (hotelId) => {
	// TODO: add validation for fields
	// hotelId: valid ObjectId -> check if hotel exists
	// return the removed Hotel

	// Validation
	hotelId = checkId(hotelId, 'Hotel Id');

	// Find and delete the hotel
	const deletedhotel = await Hotel.findByIdAndDelete(hotelId);
	if (!deletedhotel)
		throw {
			status: 404,
			message: "Hotel with this hotelId doesn't exist!",
		};

	return deletedhotel;
};

const getAll = async () => {
	const hotels = await Hotel.find().populate('manager');

	return hotels;
};

const getAllManaged = async (managerId) => {
	managerId = checkId(managerId, 'Manager Id');

	// Check if User exists
	const user = await User.findById(managerId);
	if (!user)
		throw {
			status: 404,
			message: "User with this `managerId` doesn't exist!",
		};

	// Check if user is not a manager ("hotel" account type)
	if (user.accountType !== 'hotel')
		throw {
			status: 403,
			message: "Manager with this `managerId` doesn't exist!",
		};

	const hotels = await Hotel.find({ manager: managerId });

	return hotels;
};

const createRoom = async (hotelId, type, number, capacity, price) => {
	// TODO: create a new Room in hotel with _id: hotelId
	// hotelId: valid ObjectId -> check if hotel exists
	// type: valid string
	// number: valid number
	// price: valid number

	// Validation
	hotelId = checkId(hotelId, 'Hotel Id');
	type = checkString(type, 'Type');
	number = checkNumber(number, 'Number');
	capacity = checkNumber(capacity, 'Capacity');
	price = checkNumber(price, 'Price');

	// Check if Hotel exists
	const hotel = await Hotel.findById(hotelId);
	if (!hotel)
		throw {
			status: 404,
			message: "Hotel with this hotelId doesn't exist!",
		};

	// Create new room
	const id = new ObjectId();
	const newRoom = { _id: id, type, number, capacity, price };
	hotel.rooms.push(newRoom);

	const updatedHotel = await hotel.save();
	if (!updatedHotel)
		throw {
			status: 500,
			message: "Unexpected error, couldn't create room!",
		};

	const room = updatedHotel.rooms.id(id);

	return room;
};

const getRoom = async (hotelId, roomId) => {
	// TODO: get room with _id: roomId of a hotel with _id: hotelId
	// hotelId: valid ObjectId -> check if hotel exists
	// roomId: valid ObjectId -> check if room exists
	// return room
	hotelId = checkId(hotelId, 'Hotel Id');
	roomId = checkId(roomId, 'Room Id');

	const hotel = await Hotel.findById(hotelId);
	if (!hotel)
		throw {
			status: 404,
			message: "Hotel with this `hotelId` doesn't exist!",
		};

	// Find and return the hotel
	const room = hotel.rooms.id(roomId);
	if (!room) throw { status: 404, message: "Couldn't find this room!" };

	return room;
};

const updateRoom = async (hotelId, roomId, type, number, capacity, price) => {
	// TODO: update room with _id: roomId in hotel with _id: hotelId
	// hotelId: valid ObjectId -> check if hotel exists
	// roomId: valid ObjectId -> check if room exists
	// Validation fields-
	// type: valid string (optional)
	// number: valid number (optional)
	// price: valid number (optional)
	// return updated room

	// Validation
	hotelId = checkId(hotelId, 'hotel Id');
	roomId = checkId(roomId, 'Room Id');
	type = checkString(type, 'Type');
	number = checkNumber(number, 'Number');
	capacity = checkNumber(capacity, 'Capacity');
	price = checkNumber(price, 'Price');
	// Update the hotel with new content
	const hotel = await Hotel.findById(hotelId);
	if (!hotel)
		throw {
			status: 404,
			message: "Hotel with this `hotelId` doesn't exist!",
		};

	const room = hotel.rooms.id(roomId);
	if (!room) throw { status: 404, message: "Couldn't find this room!" };

	// Update room data
	room.set({ type, number, capacity, price });

	const updatedHotel = await hotel.save();
	if (!updatedHotel)
		throw {
			status: 500,
			message: "Unexpected error, couldn't update comment!",
		};

	const updatedroom = updatedHotel.rooms.id(roomId);

	return updatedroom;
};

const removeRoom = async (hotelId, roomId) => {
	// TODO: delete room with _id: roomId in hotel with _id: hotelId
	// hotelId: valid ObjectId -> check if hotel exists
	// roomId: valid ObjectId -> check if room exists
	// return deleted room
	hotelId = checkId(hotelId, 'hotel Id');
	roomId = checkId(roomId, 'Room Id');

	const hotel = await Hotel.findById(hotelId);
	if (!hotel)
		throw {
			status: 404,
			message: "Hotel with this `hotelId` doesn't exist!",
		};

	const room = hotel.rooms.id(roomId);
	if (!room)
		throw {
			status: 404,
			message: "Room with this `roomId` doesn't exist!",
		};

	// Remove room from the Hotel's rooms array
	room.deleteOne();
	const updatedHotel = await hotel.save();
	if (!updatedHotel)
		throw {
			status: 500,
			message: "Unexpected error, couldn't delete room!",
		};

	return room;
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

	hotelId = checkId(hotelId, 'hotel Id');
	roomId = checkId(roomId, 'Room Id');
	bookedBy = checkId(bookedBy, 'User Id');

	bookedFrom = checkCheckin(bookedFrom, 'Check In');
	bookedTill = checkCheckout(bookedTill, 'Check Out');
};

const getAllRooms = async (hotelId) => {
	// TODO: get all rooms of a hotel with _id: hotelId
	// hotelId: valid ObjectId -> check if hotel exists
	// return rooms
	hotelId = checkId(hotelId, 'Hotel Id');

	// Check if hotel exists
	const hotel = await Hotel.findById(hotelId);
	if (!hotel)
		throw {
			status: 404,
			message: "Hotel with this `hotelId` doesn't exist!",
		};

	return { hotel, rooms: hotel.rooms };
};

export default {
	create,
	get,
	update,
	remove,
	getAll,
	getAllManaged,
	createRoom,
	getRoom,
	updateRoom,
	removeRoom,
	bookRoom,
	getAllRooms,
};
