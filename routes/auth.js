import { Router } from 'express';
const router = Router();

router
	.route('/login')
	.get(async (req, res) => {
		return res.render('home/login', { title: 'Login' });
	})
	.post(async (req, res) => {
		console.log(req.body);

		return res.redirect('/');
	});

router
	.route('/register')
	.get(async (req, res) => {
		return res.render('home/register', { title: 'Sign Up' });
	})
	.post(async (req, res) => {
		console.log(req.body);

		return res.redirect('/');
	});

export default router;
