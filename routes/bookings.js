import { Router } from 'express';
const router = Router();

import { bookingData } from '../data/index.js';
import { checkId, checkValidDate, checkValidDateDifference, checkValidName } from '../helpers.js';
import Booking from '../schema/Booking.js';

router
	.route('/')
	.get(async (req, res) => {
		const bookings = await Booking.find().populate(['hotel', 'hotel.room', 'bookedBy']);

		return res.send({ bookings });
	})
	.post(async (req, res) => {
		const newBookingData = req.body;

		// TODO: add session for bookedBy field

		const errors = [];

		// Validation
		// Check hotel id
		try {
			newBookingData.hotel = checkId(newBookingData.hotel, 'hotel');
		} catch (e) {
			errors.push(e.message);
		}

		// Check room id
		try {
			newBookingData.room = checkId(newBookingData.room, 'room');
		} catch (e) {
			errors.push(e.message);
		}

		// Check user id
		try {
			newBookingData.bookedBy = checkId(newBookingData.bookedBy, 'bookedBy');
		} catch (e) {
			errors.push(e.message);
		}

		// Check booking start date
		try {
			newBookingData.bookedFrom = checkValidDate(newBookingData.bookedFrom, 'bookedFrom');
		} catch (e) {
			errors.push(e.message);
		}

		// Check booking end date
		try {
			newBookingData.bookedTill = checkValidDate(newBookingData.bookedTill, 'bookedTill');
		} catch (e) {
			errors.push(e.message);
		}

		// Check if booking start and end date are atleast 1 day apart
		try {
			checkValidDateDifference(newBookingData.bookedFrom, newBookingData.bookedTill);
		} catch (e) {
			errors.push(e.message);
		}

		// Check if errors exist
		if (errors.length > 0) {
			return res.status(400).send({ errors });
		}

		// Create booking
		try {
			const booking = await bookingData.create(
				newBookingData.hotel,
				newBookingData.room,
				newBookingData.bookedBy,
				newBookingData.bookedFrom,
				newBookingData.bookedTill
			);

			return res.send({ booking });
		} catch (e) {
			return res.status(e.status || 500).send({ error: e.message });
		}
	});

router
	.route('/:bookingId')
	.get(async (req, res) => {
		// Get bookingId
		let { bookingId } = req.params;

		// Validation
		try {
			bookingId = checkId(bookingId, 'bookingId');
		} catch (e) {
			return res.status(400).send({ error: e.message });
		}

		try {
			const booking = await bookingData.get(bookingId);

			return res.send({ booking });
		} catch (e) {
			return res.status(e.status || 500).send({ error: e.message });
		}
	})
	.put(async (req, res) => {
		let { bookingId } = req.params;
		const updatedBookingData = req.body;

		const errors = [];

		// Validation
		// Check room id
		try {
			updatedBookingData.room = checkId(updatedBookingData.room, 'room');
		} catch (e) {
			errors.push(e.message);
		}

		// Check user id
		try {
			updatedBookingData.bookedBy = checkId(updatedBookingData.bookedBy, 'bookedBy');
		} catch (e) {
			errors.push(e.message);
		}

		// Check booking start date
		try {
			updatedBookingData.bookedFrom = checkValidDate(updatedBookingData.bookedFrom, 'bookedFrom');
		} catch (e) {
			errors.push(e.message);
		}

		// Check booking end date
		try {
			updatedBookingData.bookedTill = checkValidDate(updatedBookingData.bookedTill, 'bookedTill');
		} catch (e) {
			errors.push(e.message);
		}

		// Check if booking start and end date are atleast 1 day apart
		try {
			checkValidDateDifference(updatedBookingData.bookedFrom, updatedBookingData.bookedTill);
		} catch (e) {
			errors.push(e.message);
		}

		// Check if errors exist
		if (errors.length > 0) {
			return res.status(400).send({ errors });
		}

		// Update booking
		try {
			const booking = await bookingData.update(
				bookingId,
				updatedBookingData.room,
				updatedBookingData.bookedBy,
				updatedBookingData.bookedFrom,
				updatedBookingData.bookedTill
			);

			return res.send({ booking });
		} catch (e) {
			return res.status(e.status || 500).send({ error: e.message });
		}
	})
	.delete(async (req, res) => {
		let { bookingId } = req.params;
		const deleteBookingData = req.body;

		const errors = [];

		// Validation
		// Check booking id
		try {
			bookingId = checkId(bookingId, 'bookingId');
		} catch (e) {
			errors.push(e.message);
		}

		// Check last name
		try {
			deleteBookingData.lastName = checkValidName(deleteBookingData.lastName, 'lastName');
		} catch (e) {
			errors.push(e.message);
		}

		// Check if errors exist
		if (errors.length > 0) {
			return res.status(400).send({ errors });
		}

		// Delete booking
		try {
			const booking = await bookingData.cancel(bookingId, deleteBookingData.lastName);

			return res.send({ booking });
		} catch (e) {
			return res.status(e.status || 500).send({ error: e.message });
		}
	});

export default router;
