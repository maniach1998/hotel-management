import { ObjectId } from 'mongodb';
import { checkId, checkNumber, checkString } from '../helpers.js';
import Hotel from '../schema/Hotel.js';
import User from '../schema/User.js';

const create = async (name, description, manager) => {
	// Validation
	name = checkString(name, 'Name');
	description = checkString(description, 'Description');
	manager = checkId(manager, 'Manager Id');

	// Check if user exists
	const user = await User.findById(manager);
	if (!user)
		throw {
			status: 404,
			message: "Manager with this `authorId` doesn't exist!",
		};

	// Create new hotel
	const newHotel = new Hotel({ name, description, manager });
	const hotel = await newHotel.save();
	if (!hotel)
		throw {
			status: 500,
			message: "Unexpected error, couldn't create hotel!",
		};

	return hotel;
};

const get = async (hotelId) => {
	// Validation
	hotelId = checkId(hotelId, 'Hotel Id');

	// Find and return the hotel
	const hotel = await Hotel.findById(hotelId).populate('manager');
	if (!hotel) throw { status: 404, message: "Couldn't find this hotel!" };

	return hotel;
};

const update = async (hotelId, name, description) => {
	// TODO: check if manager and updater is the same user

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
	// TODO: check if manager and deleter is the same user

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
	// TODO: check for manager
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
	// Validation
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
	// TODO: check if manager and updater is the same user

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
	// Validation
	hotelId = checkId(hotelId, 'hotel Id');
	roomId = checkId(roomId, 'Room Id');

	// TODO: check if manager and deleter is the same user

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

const getAllRooms = async (hotelId) => {
	// Validation
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
	getAllRooms,
};
