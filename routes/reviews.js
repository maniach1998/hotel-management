import { Router } from 'express';
const router = Router();

import { reviewData } from '../data/index.js';
import { checkId, checkString, checkRating } from '../helpers.js';

router
	.route('/:hotelId/reviews')
	.get(async (req, res) => {
		// Get all reviews of a hotel
		let { hotelId } = req.params;

		// Validation
		try {
			hotelId = checkId(hotelId, 'hotelId');
		} catch (e) {
			return res.status(400).send({ error: e.message });
		}

		// Get all reviews of a hotel
		try {
			const { reviews, averageRating } = await reviewData.getAll(hotelId);

			return res.send({ reviews, averageRating });
		} catch (e) {
			return res.status(e.status).send({ error: e.message });
		}
	})
	.post(async (req, res) => {
		// Create a new review for a hotel
		let { hotelId } = req.params;
		const newReviewData = req.body;

		const errors = [];

		// Validation
		// Check hotel id
		try {
			hotelId = checkId(hotelId, 'hotelId');
		} catch (e) {
			errors.push(e.message);
		}

		// Check author id
		try {
			newReviewData.author = checkId(newReviewData.author, 'author');
		} catch (e) {
			errors.push(e.message);
		}

		// Check review content
		try {
			newReviewData.content = checkString(newReviewData.content, 'content');
		} catch (e) {
			errors.push(e.message);
		}

		// Check review rating
		try {
			newReviewData.rating = checkRating(newReviewData.rating, 'rating');
		} catch (e) {
			errors.push(e.message);
		}

		// If errors exist, return errors with 400
		if (errors.length > 0) {
			return res.status(400).send({ errors });
		}

		// Create new review
		try {
			const review = await reviewData.create(
				hotelId,
				newReviewData.author,
				newReviewData.content,
				newReviewData.rating
			);

			return res.send({ review });
		} catch (e) {
			return res.status(e.status || 500).send({ error: e.message });
		}
	});

router
	.route('/:hotelId/reviews/:reviewId')
	.get(async (req, res) => {
		// Get a review with _id: reviewId from a hotel with _id: hotelId
		let { hotelId, reviewId } = req.params;

		const errors = [];

		// Validation
		// Check hotel id
		try {
			hotelId = checkId(hotelId, 'hotelId');
		} catch (e) {
			errors.push(e.message);
		}

		// Check review id
		try {
			reviewId = checkId(reviewId, 'reviewId');
		} catch (e) {
			errors.push(e.message);
		}

		// If errors exist, return errors with 400
		if (errors.length > 0) {
			return res.status(400).send({ errors });
		}

		// Get the review
		try {
			const review = await reviewData.get(hotelId, reviewId);

			return res.send({ review });
		} catch (e) {
			return res.status(e.status || 500).send({ error: e.message });
		}
	})
	.patch(async (req, res) => {
		// Update a review
		let { hotelId, reviewId } = req.params;
		const updatedReviewData = req.body;

		const errors = [];

		// Validation
		// Check hotel id
		try {
			hotelId = checkId(hotelId, 'hotelId');
		} catch (e) {
			errors.push(e.message);
		}

		// Check review id
		try {
			reviewId = checkId(reviewId, 'reviewId');
		} catch (e) {
			errors.push(e.message);
		}

		// Check review content
		try {
			updatedReviewData.content = checkString(updatedReviewData.content, 'content');
		} catch (e) {
			errors.push(e.message);
		}

		// Check review rating
		try {
			updatedReviewData.rating = checkRating(updatedReviewData.rating, 'rating');
		} catch (e) {
			errors.push(e.message);
		}

		// If errors exist, return errors with 400
		if (errors.length > 0) {
			return res.status(400).send({ errors });
		}

		// Update the review data
		try {
			const review = await reviewData.update(
				hotelId,
				reviewId,
				updatedReviewData.content,
				updatedReviewData.rating
			);

			return res.send({ review });
		} catch (e) {
			return res.status(e.status || 500).send({ error: e.message });
		}
	})
	.delete(async (req, res) => {
		// Delete a review with _id: reviewId from a hotel with _id: hotelId
		let { hotelId, reviewId } = req.params;

		const errors = [];

		// Validation
		// Check hotel id
		try {
			hotelId = checkId(hotelId, 'hotelId');
		} catch (e) {
			errors.push(e.message);
		}

		// Check review id
		try {
			reviewId = checkId(reviewId, 'reviewId');
		} catch (e) {
			errors.push(e.message);
		}

		// If errors exist, return errors with 400
		if (errors.length > 0) {
			return res.status(400).send({ errors });
		}

		// Delete the review
		try {
			const review = await reviewData.remove(hotelId, reviewId);

			return res.send({ review });
		} catch (e) {
			return res.status(e.status || 500).send({ error: e.message });
		}
	});

export default router;
