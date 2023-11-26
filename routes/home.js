import { Router } from 'express';
const router = Router();

// TODO: add more pages in the future for more info about the website

router.route('/').get(async (req, res) => {
	return res.render('home/home', { title: 'Home' });
});

export default router;
