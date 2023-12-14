import { ObjectId } from "mongodb";
let checkin = null;

function checkString(value, name) {
	if (!value || typeof value !== "string")
		throw new Error(`\`${name}\` must be a non-empty string!`);

	value = value.trim();
	if (value.length === 0)
		throw new Error(`\`${name}\` cannot be empty string or just spaces!`);

	return value;
}

function checkId(id, name) {
	if (!id || typeof id !== "string")
		throw new Error(`\`${name}\` must be a non-empty string!`);

	id = id.trim();
	if (id.length === 0)
		throw new Error(`\`${name}\` cannot be empty string or just spaces!`);
	if (!ObjectId.isValid(id))
		throw new Error(`\`${name}\` is not a valid ObjectId!`);

	return id;
}

function checkNumber(value, name) {
	if (!value || typeof value !== "number")
		throw new Error(`\`${name}\` must be non-empty number!`);
	if (value <= 0)
		throw new Error(`\`${name}\` must be a positive number greater than 0!`);

	return value;
}

function checkValidName(nameString, name) {
	nameString = checkString(nameString, name);

	// Regex that matches only alphabets
	const nameRegex = /^[A-Za-z]+$/;

	if (nameString.length < 2 || nameString.length > 25)
		throw new Error(
			`\`${name}\` should be atleast 2 characters and a max of 25 characters long!`
		);

	if (!nameRegex.test(nameString))
		throw new Error(`\`${name}\` should only contain alphabet characters!`);

	return nameString;
}

function checkValidEmail(emailAddress, name) {
	emailAddress = checkString(emailAddress, name);

	// Regex taken from https://emailregex.com/
	const emailRegex =
		/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	if (!emailRegex.test(emailAddress))
		throw new Error(`\`${name}\` should be a valid email address!`);

	return emailAddress.toLowerCase();
}

function checkValidPassword(password, name) {
	password = checkString(password, name);

	// remove whitespace from password
	password = password.replace(/\s+/g, "");

	// Regex that matches for atleast one uppercase, atleast one number, atleast one special character, and minimum 8 characters length
	const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[\W]).{8,}$/;

	if (!passwordRegex.test(password))
		throw new Error(
			`\`${name}\` should have at least one uppercase character, at least one number and at least one special character, with a minimum of 8 characters!`
		);

	return password;
}

function checkValidAccountType(accountType, name) {
	accountType = checkString(accountType, name);
	accountType = accountType.toLowerCase();

	if (!["user", "hotel"].includes(accountType))
		throw new Error(`\`${name}\` must be either "user" or "hotel"!`);

	return accountType;
}

function checkRating(rating, name) {
	const ratingRegex = /^[0-5]$/;

	if (rating === undefined || typeof rating !== "number")
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

function checkCheckin(value, name) {
	if (value == null) throw "All fields need to have valid values 7";
	if (typeof value !== "string") throw "value must be a string";
	if (value.trim().length === 0)
		throw "value cannot be an empty string or string with just spaces";
	let dobParts = value.split("/");
	let month = parseFloat(dobParts[0]);
	let day = parseFloat(dobParts[1]);
	if (
		(month === 1 && day < 32) ||
		(month === 2 && day < 29) ||
		(month === 3 && day < 32) ||
		(month === 4 && day < 31) ||
		(month === 5 && day < 32) ||
		(month === 6 && day < 31) ||
		(month === 7 && day < 32) ||
		(month === 8 && day < 32) ||
		(month === 9 && day < 31) ||
		(month === 10 && day < 32) ||
		(month === 11 && day < 31) ||
		(month === 12 && day < 32)
	) {
	} else throw "ERROR: Enter a valid checkin date";

	const currentDate = new Date();

	let dob = new Date(dobParts[2], dobParts[0] - 1, dobParts[1]);

	if (currentDate > dob) throw "checkin date Cannot be in the past";

	checkin = dob;
}
function checkCheckout(value, name) {
	if (value == null) throw "All fields need to have valid values 7";
	if (typeof value !== "string") throw "value must be a string";
	if (value.trim().length === 0)
		throw "Checkout Date cannot be an empty string or string with just spaces";
	let dobParts = value.split("/");
	let month = parseFloat(dobParts[0]);
	let day = parseFloat(dobParts[1]);
	if (
		(month === 1 && day < 32) ||
		(month === 2 && day < 29) ||
		(month === 3 && day < 32) ||
		(month === 4 && day < 31) ||
		(month === 5 && day < 32) ||
		(month === 6 && day < 31) ||
		(month === 7 && day < 32) ||
		(month === 8 && day < 32) ||
		(month === 9 && day < 31) ||
		(month === 10 && day < 32) ||
		(month === 11 && day < 31) ||
		(month === 12 && day < 32)
	) {
	} else throw "ERROR: Enter a valid Checkout date";

	const currentDate = new Date();

	let dob = new Date(dobParts[2], dobParts[0] - 1, dobParts[1]);

	if (currentDate > dob) throw "Checkout date Has to be in Future";
	if (checkin > dob) throw "Checkout date Has to be after the Checkin Date";
}

export {
	checkString,
	checkId,
	checkNumber,
	checkRating,
	checkCheckin,
	checkCheckout,
	calculateAverageRating,
	checkValidEmail,
	checkValidName,
	checkValidPassword,
	checkValidAccountType,
};
