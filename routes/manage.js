import { Router } from 'express';
const router = Router();

import { hotelData } from '../data/index.js';
import { checkId, checkString, checkNumber } from '../helpers.js';
import { checkAuthorized } from '../middleware.js';

router.route('/').get(checkAuthorized, async (req, res) => {
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
		return res.status(e.status || 500).send({ error: e.message });
	}
});

router
	.route('/create')
	.get(checkAuthorized, async (req, res) => {
		// TODO: add middleware to check if session user is a manager ("hotel" account type)
		const manager = req.session.user;

		return res.render('manage/createHotel', {
			title: 'Create Hotel',
			manager,
		});
	})
	.post(checkAuthorized, async (req, res) => {
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
			newHotelData.description = checkString(newHotelData.description, 'description');
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
			const hotel = await hotelData.create(
				newHotelData.name,
				newHotelData.description,
				manager._id
			);

			// TODO: redirect to create rooms for this hotel
			return res.redirect(`/manage/${hotel._id}/rooms`);
		} catch (e) {
			console.log(e);
			return res.status(e.status || 500).send({ error: e.message });
		}
	});

router
	.route('/:hotelId')
	.get(checkAuthorized, async (req, res) => {
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

		// Get hotel
		try {
			const hotel = await hotelData.get(hotelId);
			const parsedHotel = hotel.toJSON();
			const parsedRooms = hotel.rooms.map((room) => room.toJSON());

			const formData = { name: parsedHotel.name, description: parsedHotel.description };

			return res.render('manage/editHotel', {
				title: `Manage ${hotel.name}`,
				hotel: parsedHotel,
				rooms: parsedRooms,
				formData,
			});
		} catch (e) {
			req.session.error = { code: e.status, message: e.message };
			return res.redirect('/error');
		}
	})
	.put(checkAuthorized, async (req, res) => {
		let hotelId = req.params.hotelId;
		const updatedHotelData = req.body;
		const manager = req.session.user;

		const errors = [];

		// Validation
		// Check hotel id
		try {
			hotelId = checkId(hotelId, 'hotelId');
		} catch (e) {
			errors.push(e.message);
		}

		// Check hotel name
		try {
			updatedHotelData.name = checkString(updatedHotelData.name, 'name');
		} catch (e) {
			errors.push(e.message);
		}

		// Check hotel description
		try {
			updatedHotelData.description = checkString(updatedHotelData.description, 'description');
		} catch (e) {
			errors.push(e.message);
		}

		// Check for errors
		if (errors.length > 0) {
			const formData = { name: updatedHotelData.name, description: updatedHotelData.description };

			return res.status(400).render('manage/editHotel', {
				title: 'Error',
				hasErrors: true,
				errors,
				formData,
			});
		}

		// Update hotel
		try {
			const hotel = await hotelData.update(
				hotelId,
				updatedHotelData.name,
				updatedHotelData.description
			);

			return res.send({ hotel });
		} catch (e) {
			return res.status(e.status).send({ error: e.message });
		}
	})
	.delete(async (req, res) => {
		// return deleted hotel
		let { hotelId } = req.params;

		const errors = [];
		// Check hotel id
		try {
			hotelId = checkId(hotelId, 'hotelId');
		} catch (e) {
			errors.push(e.message);
		}

		// If errors exist, return errors with 400
		if (errors.length > 0) {
			return res.status(400).send({ errors });
		}

		try {
			const hotel = await hotelData.delete(hotelId);

			return res.send({ hotel });
		} catch (e) {
			req.session.error = { code: e.status, message: e.message };
			return res.redirect('/error');
		}
	});

router
	.route('/:hotelId/rooms')
	.get(checkAuthorized, async (req, res) => {
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
			req.session.error = { code: e.status, message: e.message };
			return res.redirect('/error');
		}
	})
	.post(checkAuthorized, async (req, res) => {
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
			newRoomData.capacity = checkNumber(newRoomData.capacity, 'capacity');
		} catch (e) {
			errors.push(e.message);
		}

		try {
			newRoomData.price = checkNumber(newRoomData.price, 'price');
		} catch (e) {
			errors.push(e.message);
		}

		if (errors.length > 0) {
			return res.status(400).send({ errors });
		}

		// return new room
		try {
			const room = await hotelData.createRoom(
				hotelId,
				newRoomData.type,
				newRoomData.number,
				newRoomData.capacity,
				newRoomData.price
			);

			return res.send({ room });
		} catch (e) {
			console.log(e);
			// TODO: redirect to error
			return res.status(e.status).send({ error: e.message });
		}
	});

router
	.route('/:hotelId/rooms/:roomId')
	.get(checkAuthorized, async (req, res) => {
		let { hotelId, roomId } = req.params;

		const errors = [];
		// Validation

		try {
			hotelId = checkId(hotelId, 'hotel');
		} catch (e) {
			errors.push(e.message);
		}

		try {
			roomId = checkId(roomId, 'room');
		} catch (e) {
			errors.push(e.message);
		}

		if (errors.length > 0) {
			return res.status(400).send({ errors });
		}

		// Get the room
		try {
			const room = await hotelData.getRoom(hotelId, roomId);

			return res.render('manage/rooms/editRoom', {
				title: `Edit ${room.type}`,
				hotelId: hotelId,
				room: room.toJSON(),
			});
		} catch (e) {
			req.session.error = { code: e.status, message: e.message };
			return res.redirect('/error');
		}
	})
	.put(checkAuthorized, async (req, res) => {
		let { hotelId, roomId } = req.params;
		const updatedRoomData = req.body;

		const errors = [];

		// Check hotel id
		try {
			hotelId = checkId(hotelId, 'hotelId');
		} catch (e) {
			errors.push(e.message);
		}
		// Check room id
		try {
			roomId = checkId(roomId, 'roomId');
		} catch (e) {
			errors.push(e.message);
		}

		// Check type
		try {
			updatedRoomData.type = checkString(updatedRoomData.type, 'type');
		} catch (e) {
			errors.push(e.message);
		}

		// Check number
		try {
			updatedRoomData.number = checkNumber(updatedRoomData.number, 'number');
		} catch (e) {
			errors.push(e.message);
		}

		// Check capacity
		try {
			updatedRoomData.capacity = checkNumber(updatedRoomData.capacity, 'capacity');
		} catch (e) {
			errors.push(e.message);
		}

		// Check price
		try {
			updatedRoomData.price = checkNumber(updatedRoomData.price, 'price');
		} catch (e) {
			errors.push(e.message);
		}

		// If errors exist, return errors with 400
		if (errors.length > 0) {
			return res.status(400).send({ errors });
		}

		try {
			const room = await hotelData.updateRoom(
				hotelId,
				roomId,
				updatedRoomData.type,
				updatedRoomData.number,
				updatedRoomData.capacity,
				updatedRoomData.price
			);

			return res.send({ room });
		} catch (e) {
			return res.status(e.status).send({ error: e.message });
		}
	})
	.delete(async (req, res) => {
		let { hotelId, roomId } = req.params;

		try {
			hotelId = checkId(hotelId, 'hotel');
		} catch (e) {
			return res.status(400).send({ error: e.message });
		}

		try {
			roomId = checkId(roomId, 'room');
		} catch (e) {
			return res.status(400).send({ error: e.message });
		}

		try {
			const room = await hotelData.removeRoom(hotelId, roomId);

			return res.send({ room });
		} catch (e) {
			return res.status(e.status).send({ error: e.message });
		}
	});

export default router;
