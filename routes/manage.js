import { Router } from 'express';
const router = Router();

import { hotelData } from '../data/index.js';

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

export default router;
