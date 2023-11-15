import bcrypt from 'bcrypt';

import User from '../schema/User.js';

const create = async (firstName, lastName, email, password, accountType) => {
	// TODO: add validation for fields
	// firstName: valid string
	// lastName: valid string
	// email: valid string -> must be a valid email
	// password: valid string
	// accountType: valid string -> either "user" or "hotel"

	// Check if user already exists
	const userExists = await User.findOne({ email });
	if (userExists) throw new Error('User with this email already exists!');

	// Hash password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	// Create new user
	const newUser = new User({ firstName, lastName, email, password: hashedPassword, accountType });
	const user = await newUser.save();

	if (!user) throw new Error("Couldn't create user!");

	return user;
};

const update = async (id, firstName, lastName, email, password) => {
	// TODO: add validation for fields
	// id: valid ObjectId -> check if User exists
	// firstName: valid string
	// lastName: valid string
	// email: valid string -> must be a valid email -> check if User with this email already exists
	// password: valid string
	// return updated User
};

const remove = async (id) => {
	// TODO: add validation for fields
	// id: valid ObjectId -> check if User exists
	// return the removed User
};

const getAll = async () => {
	const users = await User.find();

	return users;
};

export default { create, update, remove, getAll };
