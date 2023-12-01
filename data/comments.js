import Hotel from '../schema/Hotel.js';
import User from '../schema/User.js';
import Comment from '../schema/Comment.js';

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

	// Create and save the new comment
	const newComment = new Comment({ hotel: hotelId, author: authorId, content });
	const comment = await newComment.save();

	if (!comment) throw { status: 500, message: "Unexpected error, couldn't create comment!" };

	// Add commentId to the Hotel's comments array
	await hotel.updateOne({ $push: { comments: comment._id } });

	return comment;
};

// Returns a single comment
const get = async (commentId) => {
	// Validation
	commentId = checkId(commentId, 'Comment Id');

	// Find and return the comment
	const comment = await Comment.findById(commentId).populate('author');
	if (!comment) throw { status: 404, message: "Couldn't find this comment!" };

	return comment;
};

// Updates an existing comment/reply
const update = async (commentId, content) => {
	// TODO:
	// test the function

	// Validation
	commentId = checkId(commentId, 'Comment Id');
	content = checkString(content, 'Content');

	// Update the Comment with new content
	const updatedComment = await Comment.findByIdAndUpdate(commentId, { content });
	if (!updatedComment) throw { status: 404, message: "Comment with this commentId doesn't exist!" };

	return updatedComment;
};

// Deletes an existing comment
const remove = async (commentId) => {
	// Validation
	commentId = checkId(commentId, 'Comment Id');

	// Find and delete the comment
	const deletedComment = await Comment.findByIdAndDelete(commentId);
	if (!deletedComment) throw { status: 404, message: "Comment with this commentId doesn't exist!" };

	// Remove commentId from the Hotel's comments array
	await Hotel.findByIdAndUpdate(deletedComment.hotel, { $pull: { comments: deletedComment._id } });
	// TODO: delete all replies of a comment

	return deletedComment;
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

export default { create, get, update, remove, reply, removeReply, getReplies };
