import { Router } from 'express';
const router = Router();
import { bookingData } from '../data/index.js';
import { checkId, checkCheckout, checkValidDate, checkValidDateDifference } from '../helpers.js';
import Booking from '../schema/Booking.js';

router
	.route('/')
	.get(async (req, res) => {
		const bookings = await Booking.find().populate(['hotel', 'hotel.room', 'bookedBy']);

		return res.send({ bookings });
		// return res.render('home/booking', { title: 'Booking' });
	})
	.post(async (req, res) => {
		//get booking data
		const newBookingData = req.body;

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
		//get bookingId
		let { bookingId } = req.params;

		//validation
		try {
			bookingId = checkId(bookingId, 'bookingId');
		} catch (e) {
			return res.status(400).send({ error: e.message });
		}

		try {
			const booking = await bookingData.get(bookingId);
			return res.send({ booking });
		} catch (e) {
			return res.status(500).send({ error: e.message });
		}
	})
	.put(async (req, res) => {
		//get bookingId
		let { bookingId } = req.params;
		//get booking data
		const bookingData = req.body;

		//validation
		try {
			bookingId = checkId(bookingId, 'bookingId');
			bookingData.roomId = checkId(bookingData.roomId, 'roomId');
			bookingData.firstName = checkString(bookingData.firstName, 'First Name');
			bookingData.lastName = checkString(bookingData.lastName, 'Last Name');
			bookingData.bookedFrom = checkCheckin(bookingData.bookedFrom, 'Booked From');
			bookingData.bookedTill = checkCheckout(bookingData.bookedTill, 'Booked Till');
		} catch (e) {
			return res.status(400).send({ error: e.message });
		}

		//update booking
		try {
			const booking = await bookingData.update(
				bookingId,
				bookingData.roomId,
				bookingData.firstName,
				bookingData.lastName,
				bookingData.bookedFrom,
				bookingData.bookedTill
			);
			return res.send({ booking });
		} catch (e) {
			return res.status(500).send({ error: e.message });
		}
	})
	.delete(async (req, res) => {
		//get bookingId
		let { bookingId } = req.params;
		const bookingData = req.body;

		//validation
		try {
			bookingId = checkId(bookingId, 'bookingId');
		} catch (e) {
			return res.status(400).send({ error: e.message });
		}

		//delete booking
		try {
			const booking = await bookingData.cancel(bookingId, bookingData.lastName);
			return res.send({ booking });
		} catch (e) {
			return res.status(500).send({ error: e.message });
		}
	});

export default router;
