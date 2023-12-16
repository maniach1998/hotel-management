import Booking from "../schema/Booking.js";
import Hotel from "../schema/Hotel.js";
import dayjs from "dayjs";
dayjs().format;

import {
  checkCheckin,
  checkCheckout,
  checkId,
  checkString,
} from "../helpers.js";

//create a booking
const create = async (
  hotelId,
  roomId,
  firstName,
  lastName,
  bookedFrom,
  bookedTill
) => {
  //validation
  hotelId = checkId(hotelId, "Hotel Id");
  roomId = checkId(roomId, "Room Id");
  firstName = checkString(firstName, "First Name");
  lastName = checkString(lastName, "Last Name");
  bookedFrom = checkCheckin(bookedFrom, "Booked From");
  bookedTill = checkCheckout(bookedTill, "Booked Till");

  //check if hotel exists
  const hotel = await Hotel.findById(hotelId);
  if (!hotel)
    throw { status: 404, message: "Hotel with this `hotelId` doesn't exist!" };

  //check if room exists
  const room = hotel.rooms.id(roomId);
  if (!room)
    throw { status: 404, message: "Room with this `roomId` doesn't exist!" };

  //check if room is booked
  if (room.bookedFrom && room.bookedTill)
    throw { status: 400, message: "Room is already booked!" };

  //calculate the total price
  totalStay = dayjs(bookedTill).diff(bookedFrom, 'day').
  finalAmount = hotel.rooms.price * totalStay

  //create and save the new booking
  const newBooking = new Booking({
    hotel: hotelId,
    room: roomId,
    firstName: firstName,
    lastName: lastName,
    bookedFrom: bookedFrom,
    bookedTill: bookedTill,
    finalAmount: finalAmount
  });

  const booking = await newBooking.save();

  if (!booking)
    throw {
      status: 500,
      message: "Unexpected error, couldn't create booking!",
    };

  //add hotelId to the room's bookings array
  await hotel.updateOne({ $push: { hotel: hotel._id } });

  //add roomId to the room's bookings array
  await room.updateOne({ $push: { room: room._id } });

  return booking;
};

//modify an existing booking
const update = async (
  bookingId,
  roomId,
  firstName,
  lastName,
  bookedFrom,
  bookedTill
) => {
  //validation
  bookingId = checkString(bookingId, "Booking Id");
  roomId = checkId(roomId, "Hotel Id");
  firstName = checkString(firstName, "First Name");
  lastName = checkString(lastName, "Last Name");
  bookedFrom = checkCheckin(bookedFrom, "Booked From");
  bookedTill = checkCheckout(bookedTill, "Booked Till");

  //check if booking exists
  const booking = await Booking.findById(bookingId);
  if (!booking)
    throw {
      status: 404,
      message: "Booking with this `bookingId` doesn't exist!",
    };
  
  //check the room daily price
  const hotelId = booking.hotel.id;
  const hotel = await Hotel.findById(hotelId);
  if (!hotel)
    throw { status: 404, message: "Hotel with this `hotelId` doesn't exist!" };
  
  totalStay = dayjs(bookedTill).diff(bookedFrom, 'day').
  finalAmount = hotel.rooms.price * totalStay

  //update booking
  const updatedBooking = await booking.updateOne({
    room: roomId,
    firstName: firstName,
    lastName: lastName,
    bookedFrom: bookedFrom,
    bookedTill: bookedTill,
    finalAmount: finalAmount
  });
  if (!updatedBooking)
    throw {
      status: 500,
      message: "Unexpected error, couldn't update booking!",
    };

  return updatedBooking;
};

// cancel an existing booking
const cancel = async (bookingId, lastName) => {
  //validation
  bookingId = checkString(bookingId, "Booking Id");
  lastName = checkString(lastName, "Last Name");

  //check if booking exists
  const booking = await Booking.findById(bookingId);
  if (!booking)
    throw {
      status: 404,
      message: "Booking with this `bookingId` doesn't exist!",
    };

  //check if last name matches
  if (booking.lastName !== lastName)
    throw { status: 400, message: "Last name doesn't match!" };

  //cancel booking
  await booking.deleteOne();
  const updatedBooking = await booking.save();
  if (!updatedBooking)
    throw {
      status: 500,
      message: "Unexpected error, couldn't cancel booking!",
    };

  return updatedBooking;
};

const get = async (bookingId) => {
  //validation
  bookingId = checkId(bookingId, "Booking Id");

  //check if booking exists
  const booking = await Booking.findById(bookingId);
  if (!booking)
    throw {
      status: 404,
      message: "Booking with this `bookingId` doesn't exist!",
    };

  return booking;
};

const getAllAvailableRooms = async (hotelId, bookedFrom, bookedTill) => {
  //validation
  hotelId = checkId(hotelId, "Hotel Id");
  bookedFrom = checkCheckin(bookedFrom, "Booked From");
  bookedTill = checkCheckout(bookedTill, "Booked Till");

  //check if hotel exists
  const hotel = await Hotel.findById(hotelId);
  if (!hotel)
    throw { status: 404, message: "Hotel with this `hotelId` doesn't exist!" };

  //check available rooms at selteced dates
  const availableRooms = hotel.rooms.filter((room) => {
    if (
      !room.bookedFrom &&
      !room.bookedTill &&
      dayjs(room.bookedFrom).isBefore(bookedFrom, 'hour') &&
      dayjs(room.bookedTill).isAfter(bookedTill, 'hour')
    )
      return room;
  });

  return availableRooms;
};

export default { create, update, cancel, get, getAllAvailableRooms };
