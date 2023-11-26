import { Router } from 'express';
const router = Router();

import { hotelData } from '../data/index.js';

router
	.route('/')
	.get(async (req, res) => {
		try {
			const hotels = await hotelData.getAll();

			// TODO: render template for displaying all hotels

			return res.send(hotels);
		} catch (e) {
			return res.status(500).send({ error: e.message });
		}
	})
	.post(async (req, res) => {
		const newHotelData = req.body;

		if (newHotelData === undefined || Object.keys(newHotelData).length === 0)
			return res.status(400).send({ error: 'No fields provided in request body!' });

		// TODO: validate new hotel data
		// unauthorized user -> redirect to '/error' (status code 403)
		// authorized user -> check if accountType is 'hotel' -> else redirect to '/error' (status code 403)
		// invalid data -> re-render form with errors (status code 400)
		// valid data -> create new hotel and redirect to '/hotels/:id' -> if failed, redirect to '/error' (status code 500)

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

router.route('/:id').get(async (req, res) => {
	// TODO: get individual hotel
	// id: valid ObjectId -> check if hotel exists
});

export default router;
