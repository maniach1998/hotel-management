import { ObjectId } from 'mongodb';
import Hotel from '../schema/Hotel.js';
import User from '../schema/User.js';

import { checkId, checkString } from '../helpers.js';

// Creates a new comment
const create = async (hotelId, authorId, content) => {
	// Validation
	hotelId = checkId(hotelId, 'Hotel Id');
	authorId = checkId(authorId, 'Author Id');
	content = checkString(content, 'Content');

	// Check if Hotel exists
	const hotel = await Hotel.findById(hotelId);
	if (!hotel) throw { status: 404, message: "Hotel with this `hotelId` doesn't exist!" };

	// Check if User exists
	const user = await User.findById(authorId);
	if (!user) throw { status: 404, message: "User with this `authorId` doesn't exist!" };

	// Create a new Comment
	const id = new ObjectId();
	const newComment = { _id: id, hotel: hotelId, author: authorId, content };
	hotel.comments.push(newComment);

	// Save the Hotel with the newly added comment
	const updatedHotel = await hotel.save();
	if (!updatedHotel) throw { status: 500, message: "Unexpected error, couldn't create comment!" };

	const comment = updatedHotel.comments.id(id);

	return comment;
};

// Returns a single comment
const get = async (hotelId, commentId) => {
	// Validation
	hotelId = checkId(hotelId, 'Hotel Id');
	commentId = checkId(commentId, 'Comment Id');

	// Check if Hotel exists
	const hotel = await Hotel.findById(hotelId);
	if (!hotel) throw { status: 404, message: "Hotel with this `hotelId` doesn't exist!" };

	// Find and return the comment
	const comment = hotel.comments.id(commentId);
	if (!comment) throw { status: 404, message: "Couldn't find this comment!" };

	return comment;
};

// Updates an existing comment/reply
const update = async (hotelId, commentId, content) => {
	// TODO: check if poster and updater is the same user
	// Validation
	hotelId = checkId(hotelId, 'Hotel Id');
	commentId = checkId(commentId, 'Comment Id');
	content = checkString(content, 'Content');

	// Check if Hotel exists
	const hotel = await Hotel.findById(hotelId);
	if (!hotel) throw { status: 404, message: "Hotel with this `hotelId` doesn't exist!" };

	// Check if comment exists
	const comment = hotel.comments.id(commentId);
	if (!comment) throw { status: 404, message: "Couldn't find this comment!" };

	// Update the comment with new content
	comment.set({ content });
	const updatedHotel = await hotel.save();
	if (!updatedHotel) throw { status: 500, message: "Unexpected error, couldn't update comment!" };

	const updatedComment = updatedHotel.comments.id(commentId);

	return updatedComment;
};

// Deletes an existing comment
const remove = async (hotelId, commentId) => {
	// TODO: testing
	// Validation
	hotelId = checkId(hotelId, 'Hotel Id');
	commentId = checkId(commentId, 'Comment Id');

	// Check if Hotel exists
	const hotel = await Hotel.findById(hotelId);
	if (!hotel) throw { status: 404, message: "Hotel with this `hotelId` doesn't exist!" };

	// Check if comment exists
	const comment = hotel.comments.id(commentId);
	if (!comment) throw { status: 404, message: "Comment with this `commentId` doesn't exist!" };

	// Remove comment from the Hotel's comments array
	comment.deleteOne();
	const updatedHotel = await hotel.save();
	if (!updatedHotel) throw { status: 500, message: "Unexpected error, couldn't delete comment!" };

	return deletedComment;
};

const getComments = async (hotelId) => {
	// Validation
	hotelId = checkId(hotelId, 'Hotel Id');

	// Find hotel and return all comments
	const hotel = await Hotel.findById(hotelId);
	if (!hotel) throw { status: 404, message: "Hotel with this `hotelId` doesn't exist!" };

	const comments = hotel.comments;

	return comments;
};

// Reply to an existing comment
const reply = async (commentId, authorId, content) => {
	// TODO:
	// commentId: valid ObjectId -> check if comment exists
	// authorId: valid ObjectId -> check if user exists
	// content: valid string

	// Validation
	commentId = checkId(commentId, 'Comment Id');
	authorId = checkId(authorId, 'Author Id');
	content = checkString(content, 'Content');
};

const removeReply = async (commentId, replyId) => {
	// Validation
	commentId = checkId(commentId, 'Parent Comment Id');
	replyId = checkId(replyId, 'Reply Id');

	// TODO:
	// check if parent comment exists
	// check if reply exists -> delete reply -> remove replyId from parent comments array
	// return deletedReply
};

// Returns all replies of a comment
const getReplies = async (commentId) => {
	// TODO:
	// testing

	// Validation
	commentId = checkId(commentId, 'Comment Id');

	const comment = await Comment.findById(commentId).populate([
		{ path: 'replies', populate: { path: 'author', component: 'User' } },
	]);
	if (!comment) throw { status: 404, message: "Comment with this commentId doesn't exist!" };

	return comment.replies;
};

export default { create, get, update, remove, getComments, reply, removeReply, getReplies };
