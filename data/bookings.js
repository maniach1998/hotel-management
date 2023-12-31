import dayjs from 'dayjs';

import Booking from '../schema/Booking.js';
import Hotel from '../schema/Hotel.js';
import User from '../schema/User.js';
import { checkId, checkString, checkValidDate, checkValidDateDifference } from '../helpers.js';
import hotelData from './hotels.js';

// Create a booking
const create = async (hotelId, roomId, bookedBy, bookedFrom, bookedTill) => {
	// Validation
	hotelId = checkId(hotelId, 'Hotel Id');
	roomId = checkId(roomId, 'Room Id');
	bookedBy = checkId(bookedBy, 'User Id');
	bookedFrom = checkValidDate(bookedFrom, 'Booked From');
	bookedTill = checkValidDate(bookedTill, 'Booked Till');
	const [bookedFromObject, bookedTillObject] = checkValidDateDifference(bookedFrom, bookedTill);

	// Check if hotel exists
	const hotel = await Hotel.findById(hotelId);
	if (!hotel) throw { status: 404, message: "Hotel with this `hotelId` doesn't exist!" };

	// Check if room exists
	const room = hotel.rooms.id(roomId);
	if (!room) throw { status: 404, message: "Room with this `roomId` doesn't exist!" };

	// Check if user exists
	const user = await User.findById(bookedBy);
	if (!user) throw { status: 404, message: "User with this `userId` doesn't exist!" };

	// Check if room is booked
	const roomAvailability = await hotelData.isRoomAvailable(roomId, bookedFrom, bookedTill);
	if (!roomAvailability)
		throw { status: 400, message: 'This room is unavailable between requested dates!' };

	// Calculate the booking's total price
	const totalStay = dayjs(bookedTill).diff(bookedFrom, 'day');
	const finalAmount = room.price * totalStay;

	// Create and save the new booking
	const newBooking = new Booking({
		hotel: hotel._id,
		room: room._id,
		bookedBy: user._id,
		bookedFrom: bookedFromObject.toISOString(),
		bookedTill: bookedTillObject.toISOString(),
		finalAmount: finalAmount,
	});

	const booking = await newBooking.save();

	if (!booking)
		throw {
			status: 500,
			message: "Unexpected error, couldn't create booking!",
		};

	return booking;
};

// Modify an existing booking
const update = async (bookingId, roomId, bookedBy, bookedFrom, bookedTill) => {
	// Validation
	bookingId = checkId(bookingId, 'Booking Id');
	roomId = checkId(roomId, 'Hotel Id');
	bookedBy = checkId(bookedBy, 'User Id');
	bookedFrom = checkValidDate(bookedFrom, 'Booked From');
	bookedTill = checkValidDate(bookedTill, 'Booked Till');
	const [bookedFromObject, bookedTillObject] = checkValidDateDifference(bookedFrom, bookedTill);

	// Check if booking exists
	const booking = await Booking.findById(bookingId);
	if (!booking)
		throw {
			status: 404,
			message: "Booking with this `bookingId` doesn't exist!",
		};

	// Check if hotel exists
	const hotelId = booking.hotel;
	const hotel = await Hotel.findById(hotelId);
	if (!hotel) throw { status: 404, message: "Hotel with this `hotelId` doesn't exist!" };

	// Check if room exists
	const room = hotel.rooms.id(roomId);
	if (!room) throw { status: 404, message: "Room with this `roomId` doesn't exist!" };

	// Check if user exists
	const user = await User.findById(bookedBy);
	if (!user) throw { status: 404, message: "User with this `userId` doesn't exist!" };

	// Check if the user updating the booking is the same as who made the booking
	const isSameUser = user._id.equals(booking.bookedBy);
	if (!isSameUser) throw { status: 403, message: 'Cannot update this booking!' };

	// Check if room is booked for the new requested dates bookedFrom-bookedTill
	const roomAvailability = await hotelData.isRoomAvailable(roomId, bookedFrom, bookedTill);
	if (!roomAvailability)
		throw { status: 400, message: 'This room is unavailable between requested dates!' };

	// Calculate the booking's total price
	const totalStay = dayjs(bookedTill).diff(bookedFrom, 'day');
	const finalAmount = room.price * totalStay;

	// Update booking
	const updatedBooking = await booking.updateOne({
		room: roomId,
		bookedFrom: bookedFromObject.toISOString(),
		bookedTill: bookedTillObject.toISOString(),
		finalAmount: finalAmount,
	});

	if (!updatedBooking)
		throw {
			status: 500,
			message: "Unexpected error, couldn't update booking!",
		};

	return updatedBooking;
};

// Cancel an existing booking
const cancel = async (bookingId, lastName) => {
	// Validation
	bookingId = checkId(bookingId, 'Booking Id');
	lastName = checkString(lastName, 'Last Name');

	// Check if booking exists
	let booking = await Booking.findById(bookingId);
	if (!booking)
		throw {
			status: 404,
			message: "Booking with this `bookingId` doesn't exist!",
		};

	booking = await booking.populate('bookedBy');

	// Check if last name matches
	if (booking.bookedBy.lastName !== lastName)
		throw { status: 400, message: "Last name doesn't match!" };

	// Cancel booking
	const deletedBooking = await Booking.findByIdAndDelete(booking._id);
	if (!deletedBooking)
		throw {
			status: 500,
			message: "Unexpected error, couldn't cancel booking!",
		};

	return deletedBooking;
};

const get = async (bookingId) => {
	// Validation
	bookingId = checkId(bookingId, 'Booking Id');

	// Check if booking exists
	const booking = await Booking.findById(bookingId);
	if (!booking)
		throw {
			status: 404,
			message: "Booking with this `bookingId` doesn't exist!",
		};

	return booking.populate(['hotel', 'bookedBy']);
};

export default { create, update, cancel, get };
