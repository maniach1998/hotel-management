import { Router } from 'express';
const router = Router();

router
	.route('/login')
	.get(async (req, res) => {
		return res.render('home/login', { title: 'Login' });
	})
	.post(async (req, res) => {
		console.log(req.body);
		const loginData = req.body;

		// TODO: validate login data
		// invalid data -> re-render login form with errors (status code 400)
		// valid data -> create session and redirect to '/hotels'

		return res.redirect('/');
	});

router
	.route('/register')
	.get(async (req, res) => {
		return res.render('home/register', { title: 'Sign Up' });
	})
	.post(async (req, res) => {
		console.log(req.body);
		const newUserData = req.body;

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
