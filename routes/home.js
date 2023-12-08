import { Router } from 'express';
const router = Router();

// TODO: add more pages in the future for more info about the website

router.route('/').get(async (req, res) => {
	return res.render('home/home', { title: 'Home' });
});


//Get home page after "Admin" logs in
router.route('/admin').get(async (req, res) => {
	// const currentTime = new Date().toUTCString();

	return res.render('home/admin', {
		title: 'Admin',
		// user: req.session.user,
		// currentTime: currentTime,
	});
});
export default router;
