import { Router } from 'express';
const router = Router();

import { hotelData } from '../data/index.js';

router
	.route('/')
	.get(async (req, res) => {
		try {
			const hotels = await hotelData.getAll();

			return res.send(hotels);
		} catch (e) {
			return res.status(500).send({ error: e.message });
		}
	})
	.post(async (req, res) => {
		const newHotelData = req.body;

		if (newHotelData === undefined || Object.keys(newHotelData).length === 0)
			return res.status(400).send({ error: 'No fields provided in request body!' });

		// TODO: validate data
		// try {
		// } catch (e) {
		// 	return res.status(400).send({ error: e.message });
		// }

		try {
			const hotel = await hotelData.create(newHotelData.name, newHotelData.manager);

			return res.send(hotel);
		} catch (e) {
			console.log(e);
			return res.status(500).send({ error: e.message });
		}
	});

export default router;
