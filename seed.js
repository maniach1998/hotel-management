import mongoose from 'mongoose';
import { userData, hotelData, commentData, reviewData, bookingData } from './data/index.js';

async function dropDB() {
	const conn = mongoose.createConnection('mongodb://127.0.0.1:27017/Group25_Hotel_Management');

	await conn.dropDatabase();

	await conn.close();
}

async function main() {
	await mongoose.connect('mongodb://127.0.0.1:27017/Group25_Hotel_Management');

	let user1 = undefined;
	let user2 = undefined;
	let manager1 = undefined;
	let manager2 = undefined;

	try {
		user1 = await userData.create('John', 'Doe', 'jdoe@gmail.com', 'Jdoe@2023', 'user');
	} catch (e) {
		console.log(e);
	}

	try {
		user2 = await userData.create('Atilla', 'Duck', 'aduckie@gmail.com', 'AkewlDuck@2020', 'user');
	} catch (e) {
		console.log(e);
	}

	try {
		manager1 = await userData.create(
			'Jane',
			'Parker',
			'jparker@gmail.com',
			'parkItHere@1998',
			'hotel'
		);
	} catch (e) {
		console.log(e);
	}

	try {
		manager2 = await userData.create('Teddy', 'Chan', 'chantee@gmail.com', 'WuzGood@1337', 'hotel');
	} catch (e) {
		console.log(e);
	}

	console.log(user1, user2, manager1, manager2);
}

await dropDB();
main();
