import { Router } from 'express';
const router = Router();

import { hotelData, commentData } from '../data/index.js';
import { checkId, checkString } from '../helpers.js';

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

router.route('/comment').post(async (req, res) => {
	const newCommentData = req.body;

	const errors = [];

	// Validation
	// Check comment hotel id
	try {
		newCommentData.hotel = checkId(newCommentData.hotel, 'hotel');
	} catch (e) {
		errors.push(e.message);
	}

	// Check comment author id
	try {
		newCommentData.author = checkId(newCommentData.author, 'author');
	} catch (e) {
		errors.push(e.message);
	}

	// Check comment content
	try {
		newCommentData.content = checkString(newCommentData.content, 'content');
	} catch (e) {
		errors.push(e.message);
	}

	// If errors exist, return errors with 400
	if (errors.length > 0) {
		return res.status(400).send({ errors });
	}

	// If data is valid, create a new comment
	try {
		const comment = await commentData.create(
			newCommentData.hotel,
			newCommentData.author,
			newCommentData.content
		);

		return res.send({ comment });
	} catch (e) {
		return res.status(e.status).send({ error: e.message });
	}
});

router
	.route('/comment/:commentId')
	.get(async (req, res) => {
		let commentId = req.params.commentId;

		// Validation
		try {
			commentId = checkId(commentId, 'commentId');
		} catch (e) {
			return res.status(400).send({ error: e.message });
		}

		// Get the requested comment
		try {
			const comment = await commentData.get(commentId);

			return res.send({ comment });
		} catch (e) {
			return res.status(e.status).send({ error: e.message });
		}
	})
	.patch(async (req, res) => {
		// TODO: update comment data
	})
	.delete(async (req, res) => {
		let commentId = req.params.commentId;

		// Validation
		try {
			commentId = checkId(commentId, 'commentId');
		} catch (e) {
			return res.status(400).send({ error: e.message });
		}

		// Delete the comment
		try {
			const deletedComment = await commentData.remove(commentId);

			return res.send({ comment: deletedComment, deleted: true });
		} catch (e) {
			return res.status(e.status).send({ error: e.message });
		}
	});

router
	.route('/comment/:commentId/replies')
	.get(async (req, res) => {
		// TODO: get comment replies
		let commentId = req.params.commentId;

		// Validation
		try {
			commentId = checkId(commentId, 'commentId');
		} catch (e) {
			return res.status(400).send({ error: e.message });
		}

		// Get all replies of the comment
		try {
			const replies = await commentData.getReplies(commentId);

			return res.send({ replies });
		} catch (e) {
			return res.status(e.status).send({ error: e.message });
		}
	})
	.post(async (req, res) => {
		// TODO: create a new reply to `commentId` comment
	})
	.delete(async (req, res) => {
		// TODO: delete a reply
	});

export default router;
