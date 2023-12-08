//import { checkCheckout, checkNumber } from "../helpers.js";
import Hotel from "../schema/Hotel.js";
import Room from "../schema/Room.js";

import User from "../schema/User.js";

const create = async (name, manager) => {
  // TODO: add validation for fields
  // name: valid string
  // manager: valid ObjectId
  // manager: check if User with this ObjectId exists
  
  name = checkString(name, "name");

  const newHotel = new Hotel({ name, manager });
  const hotel = await newHotel.save();

  if (!hotel) throw new Error("Couldn't create hotel!");

  return hotel;
};

const get = async (hotelId) => {
  // TODO: find hotel with _id: hotelId
  // hotelId: valid ObjectId -> check if hotel exists
  // return hotel
  // Validation
  hotelId = checkId(hotelId, "hotel Id");

  // Find and return the hotel
  const hotel = await Hotel.findById(hotelId).populate("author");
  if (!hotel) throw { status: 404, message: "Couldn't find this hotel!" };

  return hotel;
};

const update = async (hotelId, name, description) => {
  // TODO: add validation for fields
  // hotelId: valid ObjectId -> check if hotel exists
  // name: valid string
  // description: valid string
  // return the updated Hotel

  // Validation
  hotelId = checkId(hotelId, "hotel Id");
  name = checkString(name, "name");
  description = checkString(description, "description");

  // Update the hotel with new content
  const updatedhotel = await Hotel.findByIdAndUpdate(
    hotelId,
    { name },
    { description },
    { returnDocument: "after" }
  );
  if (!updatedhotel)
    throw {
      status: 404,
      message: "hotel with this hotelId doesn't exist!",
    };

  return updatedhotel.populate("author");
};

const remove = async (hotelId) => {
  // TODO: add validation for fields
  // hotelId: valid ObjectId -> check if hotel exists
  // return the removed Hotel

  // Validation
  hotelId = checkId(hotelId, "hotel Id");

  // Find and delete the hotel
  const deletedhotel = await Hotel.findByIdAndDelete(hotelId);
  if (!deletedhotel)
    throw {
      status: 404,
      message: "hotel with this hotelId doesn't exist!",
    };

  // Remove hotelId from the Hotel's hotels array
  await Hotel.findByIdAndUpdate(deletedhotel.hotel, {
    $pull: { hotels: deletedhotel._id },
  });
  // TODO: delete all replies of a hotel
  return deletedhotel;
};

const getAll = async () => {
  const hotels = await Hotel.find().populate("manager");

  return hotels;
};

const createRoom = async (hotelId, type, number, price) => {
  // TODO: create a new Room in hotel with _id: hotelId
  // hotelId: valid ObjectId -> check if hotel exists
  // type: valid string
  // number: valid number
  // price: valid number

  // Validation
  hotelId = checkId(hotelId, "Hotel Id");
  type = checkString(type, "Type");
  number = checkString(number, "Number");
  price = checkString(price, "Price");

  const newRoom = new room({ type, number, price });
  const room = await newRoom.save();

  if (!room) throw new Error("Couldn't create room!");

  return room;
};

const getRoom = async (hotelId, roomId) => {
  // TODO: get room with _id: roomId of a hotel with _id: hotelId
  // hotelId: valid ObjectId -> check if hotel exists
  // roomId: valid ObjectId -> check if room exists
  // return room
  hotelId = checkId(hotelId, "Hotel Id");
  roomId = checkId(roomId, "Room Id");

  // Find and return the hotel
  const room = await Hotel.findById(hotelId && roomId).populate("author");
  if (!room) throw { status: 404, message: "Couldn't find this room!" };

  return room;
};

const updateRoom = async (hotelId, roomId, type, number, price) => {
  // TODO: update room with _id: roomId in hotel with _id: hotelId
  // hotelId: valid ObjectId -> check if hotel exists
  // roomId: valid ObjectId -> check if room exists
  // Validation fields-
  // type: valid string (optional)
  // number: valid number (optional)
  // price: valid number (optional)
  // return updated room

  // Validation
  hotelId = checkId(hotelId, "hotel Id");
  roomId = checkId(roomId, "Room Id");
  type = checkString(type, "Type");
  number = checkNumber(number, "Number");
  price = checkNumber(price, "Price");
  // Update the hotel with new content
  const updatedroom = await Hotel.findByIdAndUpdate(
    hotelId && roomId,
    { type },
    { number },
    { price },
    { returnDocument: "after" }
  );
  if (!updatedroom)
    throw {
      status: 404,
      message: "room with this hotelId and roomId doesn't exist!",
    };

  return updatedroom.populate("author");
};

const removeRoom = async (hotelId, roomId) => {
  // TODO: delete room with _id: roomId in hotel with _id: hotelId
  // hotelId: valid ObjectId -> check if hotel exists
  // roomId: valid ObjectId -> check if room exists
  // return deleted room
  hotelId = checkId(hotelId, "hotel Id");
  roomId = checkId(roomId, "Room Id");

  // Find and delete the hotel
  const deletedroom = await Hotel.findByIdAndDelete(hotelId);
  if (!deletedroom)
    throw {
      status: 404,
      message: "room with this roomId doesn't exist!",
    };

  // Remove roomId from the room's rooms array
  await Hotel.findByIdAndUpdate(deletedroom.hotel, {
    $pull: { rooms: deletedroom._id },
  });
  // TODO: delete all replies of a hotel
  return deletedroom;
};

const bookRoom = async (hotelId, roomId, bookedBy, bookedFrom, bookedTill) => {
  // TODO: book room with _id: roomId in hotel with _id: hotelId
  // hotelId: valid ObjectId -> check if hotel exists
  // roomId: valid ObjectId -> check if room exists
  // Validation fields-
  // bookedBy: valid ObjectId -> check if user exists
  // bookedFrom: valid Date -> check if date is in the future
  // bookedTill: valid Date -> check if date is in the future AND after bookedFrom date
  // return booking status and booked room

  hotelId = checkId(hotelId, "hotel Id");
  roomId = checkId(roomId, "Room Id");
  bookedBy = checkId(bookedBy, "User Id");

  bookedFrom = checkCheckin(bookedFrom, "Check In");
  bookedTill = checkCheckout(bookedTill, "Check Out");
};

const getAllRooms = async (hotelId) => {
  // TODO: get all rooms of a hotel with _id: hotelId
  // hotelId: valid ObjectId -> check if hotel exists
  // return rooms
};

export default {
  create,
  get,
  update,
  remove,
  getAll,
  createRoom,
  getRoom,
  updateRoom,
  removeRoom,
  bookRoom,
  getAllRooms,
};
