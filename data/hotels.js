import { ObjectId } from 'mongodb';
import {
	checkId,
	checkNumber,
	checkString,
	checkValidDate,
	checkValidDateDifference,
} from '../helpers.js';
import Hotel from '../schema/Hotel.js';
import User from '../schema/User.js';
import Booking from '../schema/Booking.js';

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

const update = async (hotelId, managerId, name, description) => {
	// Validation
	hotelId = checkId(hotelId, 'Hotel Id');
	managerId = checkId(managerId, 'Manager Id');
	name = checkString(name, 'Name');
	description = checkString(description, 'Description');

	const hotel = await Hotel.findById(hotelId);
	if (!hotel) throw { status: 404, message: "Couldn't find this hotel!" };

	// Check if manager and updater is the same user
	const isHotelManager = new ObjectId(hotel.manager).equals(managerId);
	if (!isHotelManager)
		throw {
			status: 403,
			message: 'Forbidden: Only the manager of this hotel can perform this action!',
		};

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

const remove = async (hotelId, managerId) => {
	// Validation
	hotelId = checkId(hotelId, 'Hotel Id');
	managerId = checkId(managerId, 'Manager Id');

	const hotel = await Hotel.findById(hotelId);
	if (!hotel) throw { status: 404, message: "Couldn't find this hotel!" };

	// Check if manager and updater is the same user
	const isHotelManager = new ObjectId(hotel.manager).equals(managerId);
	if (!isHotelManager)
		throw {
			status: 403,
			message: 'Forbidden: Only the manager of this hotel can perform this action!',
		};

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

const createRoom = async (hotelId, managerId, type, number, capacity, price) => {
	// Validation
	hotelId = checkId(hotelId, 'Hotel Id');
	managerId = checkId(managerId, 'Manager Id');
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

	// Check if manager and updater is the same user
	const isHotelManager = new ObjectId(hotel.manager).equals(managerId);
	if (!isHotelManager)
		throw {
			status: 403,
			message: 'Forbidden: Only the manager of this hotel can perform this action!',
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

const updateRoom = async (hotelId, roomId, managerId, type, number, capacity, price) => {
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

	// Check if manager and updater is the same user
	const isHotelManager = new ObjectId(hotel.manager).equals(managerId);
	if (!isHotelManager)
		throw {
			status: 403,
			message: 'Forbidden: Only the manager of this hotel can perform this action!',
		};

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

const removeRoom = async (hotelId, roomId, managerId) => {
	// Validation
	hotelId = checkId(hotelId, 'Hotel Id');
	managerId = checkId(managerId, 'Manager Id');
	roomId = checkId(roomId, 'Room Id');

	const hotel = await Hotel.findById(hotelId);
	if (!hotel)
		throw {
			status: 404,
			message: "Hotel with this `hotelId` doesn't exist!",
		};

	// Check if manager and updater is the same user
	const isHotelManager = new ObjectId(hotel.manager).equals(managerId);
	if (!isHotelManager)
		throw {
			status: 403,
			message: 'Forbidden: Only the manager of this hotel can perform this action!',
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

const isRoomAvailable = async (roomId, requestedFrom, requestedTill) => {
	// Checks if bookings for this room exist within date range requestedFrom-requestedTill

	// Validation
	roomId = checkId(roomId, 'Room Id');
	requestedFrom = checkValidDate(requestedFrom, 'Requested From');
	requestedTill = checkValidDate(requestedTill, 'Requested Till');
	const [requestedFromObject, requestedTillObject] = checkValidDateDifference(
		requestedFrom,
		requestedTill
	);

	const roomBookings = await Booking.find({ room: roomId })
		.where('bookedFrom')
		.lt(requestedTillObject.toISOString())
		.where('bookedTill')
		.gt(requestedFromObject.toISOString())
		.exec();

	return roomBookings.length === 0 ? true : false;
};

const getAllAvailableRooms = async (hotelId, bookedFrom, bookedTill) => {
	// Validation
	hotelId = checkId(hotelId, 'Hotel Id');
	bookedFrom = checkValidDate(bookedFrom, 'Booked From');
	bookedTill = checkValidDate(bookedTill, 'Booked Till');
	const [bookedFromObject, bookedTillObject] = checkValidDateDifference(bookedFrom, bookedTill);

	// Check if hotel exists
	const hotel = await Hotel.findById(hotelId);
	if (!hotel) throw { status: 404, message: "Hotel with this `hotelId` doesn't exist!" };

	const parsedRooms = hotel.rooms.map((room) => room.toJSON());

	// Check available rooms at selected dates
	const availableRooms = await Promise.all(
		parsedRooms.filter(async (room) => {
			const isAvailable = await isRoomAvailable(room._id.toString(), bookedFrom, bookedTill);

			console.log(isAvailable);
			return isAvailable;
		})
	);

	const allAvailableRooms = parsedRooms.filter((value, index) => availableRooms[index]);

	return allAvailableRooms;
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
	isRoomAvailable,
	getAllAvailableRooms,
};
