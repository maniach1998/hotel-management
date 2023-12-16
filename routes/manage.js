import { Router } from 'express';
const router = Router();

import { hotelData } from '../data/index.js';
import { checkId, checkString } from '../helpers.js';

router.get('/', async (req, res) => {
	// TODO: add middleware to check if session user is a manager ("hotel" account type)
	const manager = req.session.user;

	try {
		const hotels = await hotelData.getAllManaged(manager._id);
		const parsedHotels = hotels.map((hotel) => hotel.toJSON());

		return res.render('manage/managerHome', {
			title: 'Manage',
			hotels: parsedHotels,
			manager,
		});
	} catch (e) {
		return res.status(e.status).send({ error: e.message });
	}
});

router
	.route('/create')
	.get(async (req, res) => {
		// TODO: add middleware to check if session user is a manager ("hotel" account type)
		const manager = req.session.user;

		return res.render('manage/createHotel', {
			title: 'Create Hotel',
			manager,
		});
	})
	.post(async (req, res) => {
		// TODO: add middleware to check if session user is a manager ("hotel" account type)
		const manager = req.session.user;
		const newHotelData = req.body;

		// unauthorized user -> redirect to '/error' (status code 403)
		// authorized user -> check if accountType is 'hotel' -> else redirect to '/error' (status code 403)

		const errors = [];

		// Validation
		// Check hotel name
		try {
			newHotelData.name = checkString(newHotelData.name, 'name');
		} catch (e) {
			errors.push(e.message);
		}

		// Check hotel description
		try {
			newHotelData.description = checkString(
				newHotelData.description,
				'description'
			);
		} catch (e) {
			errors.push(e.message);
		}

		// Check if errors exist
		if (errors.length > 0) {
			return res.status(400).render('manage/createHotel', {
				title: 'Create Hotel',
				manager,
				hasErrors: true,
				errors,
			});
		}

		try {
			// TODO: add description
			const hotel = await hotelData.create(
				newHotelData.name,
				manager._id
			);

			// TODO: redirect to create rooms for this hotel
			return res.redirect(`/manage/${hotel._id}/rooms`);
			// return res.send(hotel);
		} catch (e) {
			console.log(e);
			return res.status(500).send({ error: e.message });
		}
	});

router
	.route('/:hotelId/rooms')
	.get(async (req, res) => {
		// TODO: add middleware to check if session user is a manager ("hotel" account type)
		let hotelId = req.params.hotelId;
		const manager = req.session.user;

		// Validation
		// Check hotel id
		try {
			hotelId = checkId(hotelId, 'hotelId');
		} catch (e) {
			// TODO: render error template
			return res.status(400).send({ error: e.message });
		}

		// Get all rooms of a hotel
		try {
			const { hotel, rooms } = await hotelData.getAllRooms(hotelId);
			const parsedRooms = rooms.map((room) => room.toJSON());

			return res.render('manage/rooms/hotelRooms', {
				title: `Manage rooms at ${hotel.name}`,
				hotel: hotel.toJSON(),
				rooms: parsedRooms,
			});
		} catch (e) {
			// TODO: add error to session and redirect
			return res.status(e.status).send({ error: e.message });
		}
	})
	.post(async (req, res) => {
		// TODO: add middleware to check if session user is a manager ("hotel" account type)
		let { hotelId } = req.params;
		const manager = req.session.user;
		const newRoomData = req.body;

		const errors = [];

		try {
			hotelId = checkId(hotelId, 'hotel');
		} catch (e) {
			errors.push(e.message);
		}

		try {
			newRoomData.type = checkString(newRoomData.type, 'type');
		} catch (e) {
			errors.push(e.message);
		}

		try {
			newRoomData.number = checkNumber(newRoomData.number, 'number');
		} catch (e) {
			errors.push(e.message);
		}

		try {
			newRoomData.price = checkNumber(newRoomData.price, 'price');
		} catch (e) {
			errors.push(e.message);
		}

		if (errors.length > 0) {
			return res.status(400).render('manage/rooms/hotelRooms', {
				title: 'Error',
				hasErrors: true,
				errors,
			});
		}

		// return new room
		try {
			const room = await hotelData.createRoom(
				hotelId,
				newRoomData.type,
				newRoomData.number,
				newRoomData.price
			);

			return res.send({ room });
		} catch (e) {
			console.log(e);
			return res.status(e.status).send({ error: e.message });
		}
	});

export default router;
