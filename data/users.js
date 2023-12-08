import bcrypt from 'bcrypt';

import User from '../schema/User.js';

const create = async (firstName, lastName, email, password, accountType) => {
	// TODO: add validation for fields
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	// firstName: valid string
	if (typeof firstName !== 'string' || firstName.trim() === '') {
        throw new Error('First name must be a non-empty string.');
	}
	// lastName: valid string
	if (typeof lastName !== 'string' || lastName.trim() === '') {
        throw new Error('Last name must be a non-empty string.');
	}
	// email: valid string -> must be a valid email
	if (typeof email !== 'string' || !emailRegex.test(email)) {
        throw new Error('Please provide a valid email address.');
    }
	// password: valid string
	if (typeof password !== 'string' || password.trim() === '') {
        throw new Error('Password must be a non-empty string.');
    }
	// accountType: valid string -> either "user" or "hotel"
	if (typeof accountType !== 'string' || (accountType !== 'User' && accountType !== 'Admin')) {
        throw new Error('Account type must be either "user" or "admin".');
    }

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

                                //////////// LOGIN  /////////////////
const loginUser = async(email, password) => {
	//const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	// Valid Email check
	// if (typeof email !== 'string' || !emailRegex.test(email)) {
    //     throw new Error('Please provide a valid email address.');
    // }
	//TODO: Validation for password

	// Check if user already exists
	const userExists = await User.findOne({ email });
	if (!userExists) throw [400, 'Either the email address or password is invalid!'];

	//Check if password matches
	const matchPasswords = await bcrypt.compare(password, userExists.password);
	if (!matchPasswords) throw [400, 'Either the email address or password is invalid!'];

	return {
		firstName: userExists.firstName,
		lastName: userExists.lastName,
		emailAddress: userExists.email,
		role: userExists.accountType,
	};
}

const update = async (id, firstName, lastName, email, password) => {
	// TODO: add validation for fields
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	// id: valid ObjectId -> check if User exists
	if (!ObjectId.isValid(id)) throw 'invalid object ID';
    // Check if user exists
    const existingUser = await User.findById(id);
    if (!existingUser) {
        throw new Error('User not found.');
    }
	// firstName: valid string
	if (typeof firstName !== 'string' || firstName.trim() === '') {
        throw new Error('First name must be a non-empty string.');
    }
	// lastName: valid string
	if (typeof lastName !== 'string' || lastName.trim() === '') {
        throw new Error('Last name must be a non-empty string.');
    }
	// email: valid string -> must be a valid email -> check if User with this email already exists
	if (typeof email !== 'string' || !emailRegex.test(email)) {
        throw new Error('Please provide a valid email address.');
    }

	if (email !== existingUser.email) {
        const userWithNewEmail = await User.findOne({ email });
        if (userWithNewEmail) {
            throw new Error('Email is already associated with another user.');
        }
    }
	// password: valid string
	if (typeof password !== 'string' || password.trim() === '') {
        throw new Error('Password must be a non-empty string.');
    }
	// return updated User
	    // Hash password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);
	
	// Update user fields
	existingUser.firstName = firstName;
	existingUser.lastName = lastName;
	existingUser.email = email;
	existingUser.password = hashedPassword; 
	
	// Save updated user
	const updatedUser = await existingUser.save();
	return updatedUser;
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

//Create a login user/admin function

export default { create, loginUser, update, remove, getAll };
