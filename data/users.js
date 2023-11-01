import bcrypt from 'bcrypt';

import User from '../schema/User.js';

const create = async (firstName, lastName, email, password, accountType) => {
	// TODO: add validation for fields

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

const getAll = async () => {
	const users = await User.find();

	return users;
};

export default { create, getAll };
