import bcrypt from "bcrypt";

import User from "../schema/User.js";
import {
  checkId,
  checkValidAccountType,
  checkValidEmail,
  checkValidName,
  checkValidPassword,
} from "../helpers.js";
import Booking from "../schema/Booking.js";

const create = async (firstName, lastName, email, password, accountType) => {
  // Validation
  firstName = checkValidName(firstName, "First name");
  lastName = checkValidName(lastName, "Last Name");
  email = checkValidEmail(email, "Email Address");
  password = checkValidPassword(password, "Password");
  accountType = checkValidAccountType(accountType, "Account Type");

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists)
    throw { status: 403, message: "User with this `email` already exists!" };

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create new user
  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    accountType,
  });
  const user = await newUser.save();
  if (!user) throw { status: 500, message: "Couldn't create user!" };

  return user;
};

const login = async (email, password) => {
  // Validation
  email = checkValidEmail(email, "Email Address");
  password = checkValidPassword(password, "Password");

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (!userExists)
    throw {
      status: 400,
      message: "Either the email address or password is invalid!",
    };

  // Check if password matches
  const matchPasswords = await bcrypt.compare(password, userExists.password);
  if (!matchPasswords)
    throw {
      status: 400,
      message: "Either the email address or password is invalid!",
    };

  return {
    _id: userExists._id,
    firstName: userExists.firstName,
    lastName: userExists.lastName,
    emailAddress: userExists.email,
    accountType: userExists.accountType,
  };
};

const update = async (id, firstName, lastName, email, password) => {
  // Validation
  id = checkId(id, "User Id");
  firstName = checkValidName(firstName, "First Name");
  lastName = checkValidName(lastName, "Last Name");
  email = checkValidEmail(email, "Email Address");
  password = checkValidPassword(password, "Password");

  // Check if user exists
  const user = await User.findById(id);
  if (!user)
    throw { status: 404, message: "User with this `id` doesn't exist!" };

  // Check if user with new email exists
  const userWithNewEmail = await User.findOne({ email });
  if (userWithNewEmail)
    throw { status: 403, message: "User with this `email` already exists!" };

  // Hash the new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // TODO: update with optional fields
  // Update user fields
  user.set({ firstName, lastName, email, password: hashedPassword });

  // Save updated user
  const updatedUser = await user.save();
  if (!updatedUser) throw { status: 500, message: "Couldn't update user!" };

  return updatedUser;
};

const remove = async (id) => {
  // Validation
  id = checkId(id, "User Id");

  // Check if user exists
  const user = await User.findByIdAndDelete(id);
  if (!user)
    throw { status: 404, message: "User with this `id` doesn't exist!" };

  return user;
};

const getUserBookings = async (userId) => {
  // Validation
  // Validation
  userId = checkId(userId, "User Id");

  // Find user and return all bookings
  const userbooking = await Booking.findById(userId);
  if (!userbooking)
    throw {
      status: 404,
      message: "User with this `userId` doesn't exist!",
    };

  const bookings = userbooking.bookings;

  return bookings;
};

const getProfile = async (userId) => {
  // Validation
  userId = checkId(userId, "User Id");

  // Find and return the user
  const user = await user.findById(userId).populate("user");
  if (!user) throw { status: 404, message: "Couldn't find this user!" };

  const userbooking = await Booking.findById(userId);
  if (!userbooking)
    throw {
      status: 404,
      message: "User with this `userId` doesn't exist!",
    };

  const bookings = userbooking.bookings;
  const res = { user, bookings };
  return res;
};

const getAll = async () => {
  const users = await User.find();

  return users;
};

export default {
  create,
  login,
  update,
  remove,
  getUserBookings,
  getProfile,
  getAll,
};
