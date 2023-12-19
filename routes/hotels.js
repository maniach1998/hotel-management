import { Router } from 'express';
const router = Router();

import { hotelData, commentData } from '../data/index.js';
import { checkId, checkString, checkValidDate, checkValidDateDifference } from '../helpers.js';
import { checkAuthorized } from '../middleware.js';

router.route('/').get(async (req, res) => {
	try {
		const hotels = await hotelData.getAll();

		return res.render('hotels/explore', {
			title: 'Explore Hotels',
			hotels: hotels.map((hotel) => hotel.toJSON()),
		});
	} catch (e) {
		return res.status(500).send({ error: e.message });
	}
});

router.route('/:hotelId').get(async (req, res) => {
	let { hotelId } = req.params;

	// Check hotel id
	try {
		hotelId = checkId(hotelId, 'hotelId');
	} catch (e) {
		req.session.error = { code: 400, message: e.message };
		return res.redirect('/error');
	}

	try {
		const hotel = await hotelData.get(hotelId);
		const rooms = hotel.rooms;

		return res.render('hotels/hotel', {
			title: hotel.name,
			hotel: hotel.toJSON(),
			rooms,
		});
	} catch (e) {
		req.session.error = { code: e.status, message: e.message };
		return res.redirect('/error');
	}
});

router
	.route('/:hotelId/rooms')
	.get(async (req, res) => {
		// Get all rooms of a hotel with _id: hotelId
		let { hotelId } = req.params;

		try {
			hotelId = checkId(hotelId, 'hotel');
		} catch (e) {
			req.session.error = { code: 400, message: e.message };
			return res.redirect('/error');
		}

		try {
			const { hotel, rooms } = await hotelData.getAllRooms(hotelId);
			const parsedRooms = rooms.map((room) => room.toJSON());

			return res.render('hotels/rooms/allRooms', {
				title: `Rooms at ${hotel.name}`,
				hotel: hotel.toJSON(),
				rooms: parsedRooms,
			});
		} catch (e) {
			req.session.error = { code: e.status, message: e.message };
			return res.redirect('/error');
		}
	})
	.post(async (req, res) => {
		// TODO: get all available rooms of a hotel within certain date range
		let { hotelId } = req.params;
		const dateRange = req.body;

		const errors = [];

		try {
			hotelId = checkId(hotelId, 'hotel');
		} catch (e) {
			errors.push(e.message);
		}

		// startDate: valid date
		try {
			dateRange.startDate = checkValidDate(dateRange.startDate, 'startDate');
		} catch (e) {
			errors.push(e.message);
		}

		// endDate: valid date
		try {
			dateRange.endDate = checkValidDate(dateRange.endDate, 'endDate');
		} catch (e) {
			errors.push(e.message);
		}

		// check difference in dates
		try {
			checkValidDateDifference(dateRange.startDate, dateRange.endDate);
		} catch (e) {
			errors.push(e.message);
		}

		if (errors.length > 0) {
			return res.status(400).send({ errors });
		}

		// return new room
		try {
			const rooms = await hotelData.getAllAvailableRooms(
				hotelId,
				dateRange.startDate,
				dateRange.endDate
			);
			// const parsedRooms = rooms.map((room) => room.toJSON());

			return res.send({ rooms });
		} catch (e) {
			req.session.error = { code: e.status, message: e.message };
			return res.redirect('/error');
		}
	});

router.route('/:hotelId/rooms/:roomId').get(async (req, res) => {
	// Get room with _id: roomId of a hotel with _id: hotelId
	let { hotelId, roomId } = req.params;

	try {
		hotelId = checkId(hotelId, 'hotel');
	} catch (e) {
		return res.status(400).send({ error: e.message });
	}

	try {
		roomId = checkId(roomId, 'room');
	} catch (e) {
		return res.status(400).send({ error: e.message });
	}

	try {
		const room = await hotelData.getRoom(hotelId, roomId);

		return res.send({ room });
	} catch (e) {
		return res.status(e.status || 500).send({ error: e.message });
	}
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
	.post(checkAuthorized, async (req, res) => {
		// Creates a comment on hotel with _id: hotelId
		let hotelId = req.params.hotelId;
		const author = req.session.user;
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
		// try {
		// 	newCommentData.author = checkId(newCommentData.author, 'author');
		// } catch (e) {
		// 	errors.push(e.message);
		// }

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
			const comment = await commentData.create(hotelId, author._id, newCommentData.content);

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
