import { Router } from 'express';
const router = Router();

router.route('/').get(async (req, res) => {
	return res.render('home/home', { title: 'Home' });
});

router.route('/aboutus').get(async (req, res) => {
	return res.render('home/aboutus', { title: 'AboutUs' });
});

router.route('/contact').get(async (req, res) => {
	return res.render('home/contact', { title: 'Contact' });
});

router.route('/error').get(async (req, res) => {
	console.log(req.session.error);
	if (!req.session.error) return res.redirect('/');

	const { code, message } = req.session.error;
	delete req.session.error;

	return res.status(code).render('error', {
		title: 'Error',
		code,
		error: message,
	});
});
export default router;
