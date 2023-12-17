import { ObjectId } from 'mongodb';
import Hotel from '../schema/Hotel.js';
import User from '../schema/User.js';
import { checkId, checkRating, checkString, calculateAverageRating } from '../helpers.js';

const create = async (hotelId, authorId, content, rating) => {
	// Create a review in hotel with hotelId
	// Validation
	hotelId = checkId(hotelId, 'Hotel Id');
	authorId = checkId(authorId, 'Author Id');
	content = checkString(content, 'Review content');
	rating = checkRating(rating, 'Review rating');

	// Check if hotel exists
	const hotel = await Hotel.findById(hotelId);
	if (!hotel) throw { status: 404, message: "Hotel with this `hotelId` doesn't exist!" };

	// Check if user exists
	const user = await User.findById(authorId);
	if (!user) throw { status: 404, message: "User with this `authorId` doesn't exist!" };

	// Check if user has already posted a review
	const hasPosted = hotel.reviews.find((review) => user._id.equals(review.author));
	if (hasPosted) throw { status: 400, message: 'You can post a review only once per hotel!' };

	// Create a new review and recalculate average rating for the hotel
	const id = new ObjectId();
	const newReview = { _id: id, author: authorId, content, rating };
	hotel.reviews.push(newReview);
	hotel.set({ rating: calculateAverageRating(hotel.reviews) });

	// Save changes to hotel
	const updatedHotel = await hotel.save();
	if (!updatedHotel) throw { status: 500, message: "Unexpected error, couldn't create review!" };

	const review = updatedHotel.reviews.id(id);

	return review;
};

const get = async (hotelId, reviewId) => {
	// Get a review with reviewId in hotel with hotelId
	// Validation
	hotelId = checkId(hotelId, 'Hotel Id');
	reviewId = checkId(reviewId, 'Review Id');

	// Check if hotel exists
	const hotel = await Hotel.findById(hotelId);
	if (!hotel) throw { status: 404, message: "Hotel with this `hotelId` doesn't exist!" };

	// Find and get the review
	const review = hotel.reviews.id(reviewId);
	if (!review) throw { status: 404, message: "Review with this `reviewId` doesn't exist!" };

	return review;
};

const update = async (hotelId, reviewId, content, rating) => {
	// Update a review with reviewId in hotel with hotelId with new content/rating
	// Validation
	hotelId = checkId(hotelId, 'Hotel Id');
	reviewId = checkId(reviewId, 'Review Id');
	content = checkString(content, 'Review content');
	rating = checkRating(rating, 'Review rating');

	// Check if hotel exists
	const hotel = await Hotel.findById(hotelId);
	if (!hotel) throw { status: 404, message: "Hotel with this `hotelId` doesn't exist!" };

	// Find and get the review
	const review = hotel.reviews.id(reviewId);
	if (!review) throw { status: 404, message: "Review with this `reviewId` doesn't exist!" };

	// Update the review
	review.set({ content, rating });
	hotel.set({ rating: calculateAverageRating(hotel.reviews) });

	// Save changes to hotel
	const updatedHotel = await hotel.save();
	if (!updatedHotel) throw { status: 500, message: "Unexpected error, couldn't update review!" };

	const updatedReview = updatedHotel.reviews.id(reviewId);

	return updatedReview;
};

const remove = async (hotelId, reviewId) => {
	// Delete a review with reviewId in hotel with hotelId
	// Validation
	hotelId = checkId(hotelId, 'Hotel Id');
	reviewId = checkId(reviewId, 'Review Id');

	// Check if hotel exists
	const hotel = await Hotel.findById(hotelId);
	if (!hotel) throw { status: 404, message: "Hotel with this `hotelId` doesn't exist!" };

	// Find and get the review
	const review = hotel.reviews.id(reviewId);
	if (!review) throw { status: 404, message: "Review with this `reviewId` doesn't exist!" };

	// Delete the review
	review.deleteOne();
	hotel.set({ rating: calculateAverageRating(hotel.reviews) });

	// Save changes to hotel
	const updatedHotel = await hotel.save();
	if (!updatedHotel) throw { status: 500, message: "Unexpected error, couldn't update review!" };

	return review;
};

const getAll = async (hotelId) => {
	// Get all reviews of a hotel with hotelId
	hotelId = checkId(hotelId, 'Hotel Id');

	// Check if hotel exists
	const hotel = await Hotel.findById(hotelId);
	if (!hotel)
		throw {
			status: 404,
			message: "Hotel with this `hotelId` doesn't exist!",
		};

	return { reviews: hotel.reviews, averageRating: hotel.rating };
};

export default { create, get, update, remove, getAll };
