import { Router } from 'express';
const router = Router();

import { hotelData } from '../data/index.js';

router.get('/', async (req, res) => {
	// TODO: add middleware to check if session user is a manager ("hotel" account type)
	try {
		const hotels = await hotelData.getAllManaged();
		const parsedHotels = hotels.map((hotel) => hotel.toJSON());

		return res.render('manage/managerHome', {
			title: 'Manage',
			hotels: parsedHotels,
		});
	} catch (e) {
		return res.status(e.status).send({ error: e.message });
	}
});

export default router;
