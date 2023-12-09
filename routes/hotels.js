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

		// Validation fields-
		// name: valid string
		// description: valid string
		// valid data -> create new hotel and redirect to '/hotels/:hotelId' -> if failed, redirect to '/error' (status code 500)

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

router
	.route('/:hotelId')
	.get(async (req, res) => {
		// TODO: get individual hotel with _id: hotelId
		// hotelId: valid ObjectId -> check if hotel exists
		// return hotel
	})
	.patch(async (req, res) => {
		// TODO: update a hotel with _id: hotelId
		// hotelId: valid ObjectId -> check if hotel exists
		// name: valid string
		// description: valid string
		// return updated hotel
	})
	.delete(async (req, res) => {
		// TODO: delete a hotel with _id: hotelId if exists
		// return deleted hotel
	});

router
	.route('/:hotelId/rooms')
	.get(async (req, res) => {
		// TODO: get all rooms of a hotel with _id: hotelId
		// hotelId: valid ObjectId -> check if hotel exists
		// return rooms
	})
	.post(async (req, res) => {
		// TODO: create a new Room in hotel with _id: hotelId
		// hotelId: valid ObjectId -> check if hotel exists
		// Validation fields-
		// type: valid string
		// number: valid number
		// price: valid number
		// return rooms
	});

router
	.route('/:hotelId/rooms/:roomId')
	.get(async (req, res) => {
		// TODO: get room with _id: roomId of a hotel with _id: hotelId
		// hotelId: valid ObjectId -> check if hotel exists
		// roomId: valid ObjectId -> check if room exists
		// return room
	})
	.post(async (req, res) => {
		// TODO: book room with _id: roomId in hotel with _id: hotelId
		// hotelId: valid ObjectId -> check if hotel exists
		// roomId: valid ObjectId -> check if room exists
		// Validation fields-
		// bookedBy: valid ObjectId -> check if user exists
		// bookedFrom: valid Date -> check if date is in the future
		// bookedTill: valid Date -> check if date is in the future AND after bookedFrom date
		// return booking status and booked room
	})
	.patch(async (req, res) => {
		// TODO: update room with _id: roomId in hotel with _id: hotelId
		// hotelId: valid ObjectId -> check if hotel exists
		// roomId: valid ObjectId -> check if room exists
		// Validation fields-
		// type: valid string (optional)
		// number: valid number (optional)
		// price: valid number (optional)
		// return updated room
	})
	.delete(async (req, res) => {
		// TODO: delete room with _id: roomId in hotel with _id: hotelId
		// hotelId: valid ObjectId -> check if hotel exists
		// roomId: valid ObjectId -> check if room exists
		// return deleted room
	});

router
	.route('/:hotelId/comments')
	.get(async (req, res) => {
		let hotelId = req.params.hotelId;

		// Validation
		// Check hotel id
		try {
			hotelId = checkId(hotelId, 'hotelId');
		} catch (e) {
			return res.status(400).send({ error: e.message });
		}

		// Get all comments of the hotel
		try {
			const comments = await commentData.getComments(hotelId);

			return res.send({ comments });
		} catch (e) {
			return res.status(e.status).send({ error: e.message });
		}
	})
	.post(async (req, res) => {
		// Creates a comment on hotel with _id: hotelId
		let hotelId = req.params.hotelId;
		const newCommentData = req.body;

		const errors = [];

		// Validation
		// Check hotel id
		try {
			hotelId = checkId(hotelId, 'hotelId');
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
				hotelId,
				newCommentData.author,
				newCommentData.content
			);

			return res.send({ comment });
		} catch (e) {
			console.log(e);
			return res.status(e.status).send({ error: e.message });
		}
	});

router
	.route('/:hotelId/comments/:commentId')
	.get(async (req, res) => {
		// Returns a comment with _id: commentId if exists
		let { hotelId, commentId } = req.params;

		const errors = [];

		// Validation
		// Check hotel id
		try {
			hotelId = checkId(hotelId, 'hotelId');
		} catch (e) {
			errors.push(e.message);
		}

		// Check comment id
		try {
			commentId = checkId(commentId, 'commentId');
		} catch (e) {
			errors.push(e.message);
		}

		// If errors exist, return errors with 400
		if (errors.length > 0) {
			return res.status(400).send({ errors });
		}

		// Get the requested comment
		try {
			const comment = await commentData.get(hotelId, commentId);

			return res.send({ comment });
		} catch (e) {
			return res.status(e.status).send({ error: e.message });
		}
	})
	.patch(async (req, res) => {
		// Updates a comment/reply with _id: commentId if exists
		let { hotelId, commentId } = req.params;
		const updatedCommentData = req.body;

		const errors = [];

		// Validation
		// Check hotel id
		try {
			hotelId = checkId(hotelId, 'hotelId');
		} catch (e) {
			errors.push(e.message);
		}

		// Check comment id
		try {
			commentId = checkId(commentId, 'commentId');
		} catch (e) {
			errors.push(e.message);
		}

		// Check updated content
		try {
			updatedCommentData.content = checkString(updatedCommentData.content, 'content');
		} catch (e) {
			errors.push(e.message);
		}

		// If errors exist, return errors with 400
		if (errors.length > 0) {
			return res.status(400).send({ errors });
		}

		// If data is valid, update the comment
		try {
			const updatedComment = await commentData.update(
				hotelId,
				commentId,
				updatedCommentData.content
			);

			return res.send({ comment: updatedComment });
		} catch (e) {
			console.log(e);
			return res.status(e.status).send({ error: e.message });
		}
	})
	.delete(async (req, res) => {
		// Deletes a comment with _id: commentId if exists
		let { hotelId, commentId } = req.params;

		// Validation
		// Check hotel id
		try {
			hotelId = checkId(hotelId, 'hotelId');
		} catch (e) {
			errors.push(e.message);
		}

		// Check comment id
		try {
			commentId = checkId(commentId, 'commentId');
		} catch (e) {
			console.log(e);
			return res.status(400).send({ error: e.message });
		}

		// Delete the comment
		try {
			const deletedComment = await commentData.remove(hotelId, commentId);

			return res.send({ comment: deletedComment, deleted: true });
		} catch (e) {
			return res.status(e.status).send({ error: e.message });
		}
	});

router
	.route('/:hotelId/comments/:commentId/replies')
	.get(async (req, res) => {
		// Returns the replies of a comment with _id: commentId
		// TODO: testing and populating
		let { hotelId, commentId } = req.params;

		const errors = [];

		// Validation
		// Check hotel id
		try {
			hotelId = checkId(hotelId, 'hotelId');
		} catch (e) {
			errors.push(e.message);
		}

		// Check comment id
		try {
			commentId = checkId(commentId, 'commentId');
		} catch (e) {
			return res.status(400).send({ error: e.message });
		}

		// Get all replies of the comment
		try {
			const replies = await commentData.getReplies(hotelId, commentId);

			return res.send({ replies });
		} catch (e) {
			return res.status(e.status).send({ error: e.message });
		}
	})
	.post(async (req, res) => {
		// TODO: create a new reply to `commentId` comment
	});

router
	.route('/:hotelId/comments/:commentId/replies/:replyId')
	.get(async (req, res) => {
		// TODO: get a reply from a comment
	})
	.patch(async (req, res) => {
		// TODO: update reply content
		// commentId: valid ObjectId -> check if comment exist
		// replyId: valid ObjectId -> check if reply exists
		// content: valid string
		// return updated reply
	})
	.delete(async (req, res) => {
		// TODO: delete reply from a comment
		// commentId: valid ObjectId -> check if comment exist
		// replyId: valid ObjectId -> check if reply exists
		// return deleted reply
	});

export default router;
