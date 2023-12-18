import dayjs from 'dayjs';
import xss from 'xss';
import { ObjectId } from 'mongodb';

// Plugin for strict date validation
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
dayjs.extend(customParseFormat);

function checkString(value, name) {
	if (!value || typeof value !== 'string')
		throw new Error(`\`${name}\` must be a non-empty string!`);

	value = value.trim();
	if (value.length === 0) throw new Error(`\`${name}\` cannot be empty string or just spaces!`);

	return xss(value);
}

function checkId(id, name) {
	if (!id || typeof id !== 'string') throw new Error(`\`${name}\` must be a non-empty string!`);

	id = id.trim();
	if (id.length === 0) throw new Error(`\`${name}\` cannot be empty string or just spaces!`);
	if (!ObjectId.isValid(id)) throw new Error(`\`${name}\` is not a valid ObjectId!`);

	return xss(id);
}

function checkNumber(value, name) {
	if (!value || typeof value !== 'number') throw new Error(`\`${name}\` must be non-empty number!`);
	if (value <= 0) throw new Error(`\`${name}\` must be a positive number greater than 0!`);

	return value;
}

function checkValidName(nameString, name) {
	nameString = checkString(nameString, name);

	// Regex that matches only alphabets
	const nameRegex = /^[A-Za-z]+$/;

	if (nameString.length < 2 || nameString.length > 25)
		throw new Error(`\`${name}\` should be atleast 2 characters and a max of 25 characters long!`);

	if (!nameRegex.test(nameString))
		throw new Error(`\`${name}\` should only contain alphabet characters!`);

	return xss(nameString);
}

function checkValidEmail(emailAddress, name) {
	emailAddress = checkString(emailAddress, name);

	// Regex taken from https://emailregex.com/
	const emailRegex =
		/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	if (!emailRegex.test(emailAddress))
		throw new Error(`\`${name}\` should be a valid email address!`);

	emailAddress = xss(emailAddress);

	return emailAddress.toLowerCase();
}

function checkValidPassword(password, name) {
	password = checkString(password, name);

	// remove whitespace from password
	password = password.replace(/\s+/g, '');

	// Regex that matches for atleast one uppercase, atleast one number, atleast one special character, and minimum 8 characters length
	const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[\W]).{8,}$/;

	if (!passwordRegex.test(password))
		throw new Error(
			`\`${name}\` should have at least one uppercase character, at least one number and at least one special character, with a minimum of 8 characters!`
		);

	return xss(password);
}

function checkValidAccountType(accountType, name) {
	accountType = checkString(accountType, name);
	accountType = accountType.toLowerCase();

	if (!['user', 'hotel'].includes(accountType))
		throw new Error(`\`${name}\` must be either "user" or "hotel"!`);

	return xss(accountType);
}

function checkRating(rating, name) {
	const ratingRegex = /^[0-5]$/;

	if (rating === undefined || typeof rating !== 'number')
		throw new Error(`\`${name}\` must be non-empty number!`);
	if (!ratingRegex.test(rating.toString()))
		throw new Error(`\`${name}\` must be a whole number between 0 and 5!`);

	return rating;
}

function calculateAverageRating(reviews) {
	const totalReviews = reviews.length;

	// If there are no reviews, return average rating as 0
	if (totalReviews === 0) return 0;

	const ratingsTotal = reviews.reduce((sum, review) => {
		return sum + review.rating;
	}, 0);

	const averageRating = ratingsTotal / totalReviews;

	return Number(averageRating.toFixed(2));
}

function checkValidDate(dateString, name) {
	dateString = checkString(dateString, name);

	const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
	if (!dateRegex.test(dateString))
		throw new Error(`\`${name}\` is not a valid date in MM/DD/YYYY format!`);

	const dateObject = dayjs(dateString, 'MM/DD/YYYY', true);

	if (!dateObject.isValid()) throw new Error(`\`${name}\` is not a valid date!`);
	if (!dateObject.isAfter(new dayjs()))
		throw new Error(`\`${name}\` must be greater than current date!`);

	return xss(dateString);
}

function checkValidDateDifference(startDate, endDate) {
	const startDateObject = dayjs(startDate, 'MM/DD/YYYY', true);
	const endDateObject = dayjs(endDate, 'MM/DD/YYYY', true);

	if (startDateObject.isSame(endDateObject))
		throw new Error('`startDate` and `endDate` cannot be the same date!');

	if (!endDateObject.isAfter(startDateObject))
		throw new Error('`startDate` cannot be later than `endDate`!');

	if (endDateObject.diff(startDateObject, 'days') < 1)
		throw new Error('`endDate` should be atleast 1 day later than `startDate`!');

	return [startDateObject, endDateObject];
}

export {
	checkString,
	checkId,
	checkNumber,
	checkRating,
	checkValidDate,
	checkValidDateDifference,
	calculateAverageRating,
	checkValidEmail,
	checkValidName,
	checkValidPassword,
	checkValidAccountType,
};
