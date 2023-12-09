import express from 'express';
import { Router } from 'express';
import { userData } from '../data/index.js';
const router = Router();
import {
	middlewareTwo,
	// middlewareThree,
	// middlewareFour,
	// middlewareFive,
	// middlewareSix,
} from '../middleware.js';


router
	.route('/login')
	.get(middlewareTwo,async (req, res) => {
		return res.render('home/login', { title: 'Login' });
	})
	.post(async (req, res) => {
	
		const user = req.body;
		console.log(user.email)
		try {
			const userExists = await userData.loginUser(user.email, user.password);
			console.log("inside auth email", userExists);
			console.log(userExists.role)
			if (!userExists) throw [500, 'Internal Server Error'];

			req.session.user = userExists;
			// if(userExists) {
			// 	res.redirect('/');
			// }
			console.log(req.session.user)
			if (userExists.role === 'hotel') {
				return res.redirect('/admin');
			} else {
				return res.redirect('/hotels');
			}
		} catch (e) {
			console.log(e);
			// const [status, message] = e;

			// return res.status(status).render('login', {
			// 	title: 'Login',
			// 	hasErrors: true,
			// 	errors: [message],
			// });
		}
	});

router
	.route('/register')
	.get(async (req, res) => {
		return res.render('home/register', { title: 'Sign Up' });
	})
	.post(async (req, res) => {
		const newUserData = req.body;

		if (newUserData === undefined || Object.keys(newUserData).length === 0)
			return res.status(400).send({ error: 'No fields provided in request body!' });

		try {
			const user = await userData.create(
				newUserData.firstName,
				newUserData.lastName,
				newUserData.email,
				newUserData.password,
				newUserData.role
			);
			return res.redirect('/login')  	
			// return res.send(user);
		} catch (e) {
			return res.status(500).send({ error: e.message });
		}
		console.log(req.body);
		// const newUserData = req.body;

		// TODO: validate register data
		// invalid data -> re-render register form with errors (status code 400)
		// valid data -> create user and redirect to '/login'

		return res.redirect('/');
	});

router.route('/logout').get(async (req, res) => {
	// TODO: logout user
	// authorized user -> destroy session and render logout page
	// unauthorized user -> redirect to '/login'

	return res.json({ message: 'Logout' });
});

export default router;
