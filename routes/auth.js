import { Router } from 'express';
const router = Router();

import { userData } from '../data/index.js';
import {
	checkValidAccountType,
	checkValidEmail,
	checkValidName,
	checkValidPassword,
} from '../helpers.js';
import { checkAuthorized, checkForAuthRoutes } from '../middleware.js';

router
	.route('/login')
	.get(checkForAuthRoutes, async (req, res) => {
		return res.render('home/login', { title: 'Login' });
	})
	.post(async (req, res) => {
		const userInfo = req.body;

		const errors = [];

		// Validation
		// Check email
		try {
			userInfo.email = checkValidEmail(userInfo.email, 'email');
		} catch (e) {
			errors.push(e.message);
		}

		// Check password
		try {
			userInfo.password = checkValidPassword(userInfo.password, 'password');
		} catch (e) {
			errors.push(e.message);
		}

		// If there are any validation errors
		if (errors.length > 0) {
			return res.render('home/login', {
				title: 'Login',
				hasErrors: true,
				errors,
			});
		}

		// Login user
		try {
			const user = await userData.login(userInfo.email, userInfo.password);

			// Add the user to the session
			req.session.user = user;

			// Redirect based on accountType
			if (user.accountType === 'hotel') {
				return res.redirect('/manage');
			} else {
				return res.redirect('/hotels');
			}
		} catch (e) {
			return res.status(e.status).render('home/login', {
				title: 'Login',
				hasErrors: true,
				errors: [e.message],
			});
		}
	});

router
	.route('/register')
	.get(checkForAuthRoutes, async (req, res) => {
		return res.render('home/register', { title: 'Sign Up' });
	})
	.post(async (req, res) => {
		const newUserData = req.body;

		const errors = [];

		// Validation
		// Check first name
		try {
			newUserData.firstName = checkValidName(newUserData.firstName, 'firstName');
		} catch (e) {
			errors.push(e.message);
		}

		// Check last name
		try {
			newUserData.lastName = checkValidName(newUserData.lastName, 'lastName');
		} catch (e) {
			errors.push(e.message);
		}

		// Check email
		try {
			newUserData.email = checkValidEmail(newUserData.email, 'email');
		} catch (e) {
			errors.push(e.message);
		}

		// Check password
		try {
			newUserData.password = checkValidPassword(newUserData.password, 'password');
		} catch (e) {
			errors.push(e.message);
		}

		// Check confirm password
		try {
			newUserData.confirmPassword = checkValidPassword(
				newUserData.confirmPassword,
				'confirmPassword'
			);
		} catch (e) {
			errors.push(e.message);
		}

		// Check if passwords match
		try {
			if (newUserData.password !== newUserData.confirmPassword)
				throw new Error("`Password` and `Confirm Password` don't match!");
		} catch (e) {
			errors.push(e.message);
		}

		// Check account type
		try {
			newUserData.accountType = checkValidAccountType(newUserData.accountType, 'accountType');
		} catch (e) {
			errors.push(e.message);
		}

		// If there are any validation errors
		if (errors.length > 0) {
			return res.render('home/register', {
				title: 'Sign Up',
				hasErrors: true,
				errors,
			});
		}

		try {
			const user = await userData.create(
				newUserData.firstName,
				newUserData.lastName,
				newUserData.email,
				newUserData.password,
				newUserData.accountType
			);

			return res.redirect('/login');
		} catch (e) {
			return res.status(e.status).render('home/register', {
				title: 'Sign Up',
				hasErrors: true,
				errors: [e.message],
			});
		}
	});

router.route('/logout').get(checkAuthorized, async (req, res) => {
	// authorized user -> destroy session and render logout page
	req.session.destroy();
	// console.log("destroyed session")
	return res.render('home/logout', { title: 'Logout' });
});

export default router;
