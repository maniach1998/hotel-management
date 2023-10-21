import { Router } from 'express';
const router = Router();

router.route('/').get(async (req, res) => {
	return res.send({ message: 'Users route' });
});

export default router;
