import Hotel from '../schema/Hotel.js';

const create = async (name, manager) => {
	// TODO: add validation for fields
	// name: valid string
	// manager: valid ObjectId
	// manager: check if User with this ObjectId exists

	const newHotel = new Hotel({ name, manager });
	const hotel = await newHotel.save();

	if (!hotel) throw new Error("Couldn't create hotel!");

	return hotel;
};

const update = async (id, name, manager) => {
	// TODO: add validation for fields
	// id: valid ObjectId -> check if hotel exists
	// name: valid string
	// manager: valid ObjectId -> check if user exists
	// return the updated Hotel
};

const remove = async (id) => {
	// TODO: add validation for fields
	// id: valid ObjectId -> check if hotel exists
	// return the removed Hotel
};

const getAll = async () => {
	const hotels = await Hotel.find().populate('manager');

	return hotels;
};

export default { create, update, remove, getAll };
