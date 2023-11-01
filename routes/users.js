import { Router } from 'express';
const router = Router();

import { userData } from '../data/index.js';

router
	.route('/')
	.get(async (req, res) => {
		// only for time-being testing purposes
		// this method will be removed later
		try {
			const users = await userData.getAll();

			return res.send(users);
		} catch (e) {
			return res.status(500).send({ error: e.message });
		}
	})
	.post(async (req, res) => {
		const newUserData = req.body;

		if (newUserData === undefined || Object.keys(newUserData).length === 0)
			return res.status(400).send({ error: 'No fields provided in request body!' });

		// TODO: validate data
		// try {
		// } catch (e) {
		// 	return res.status(400).send({ error: e.message });
		// }

		try {
			const user = await userData.create(
				newUserData.firstName,
				newUserData.lastName,
				newUserData.email,
				newUserData.password,
				newUserData.accountType
			);

			return res.send(user);
		} catch (e) {
			return res.status(500).send({ error: e.message });
		}
	});

export default router;
