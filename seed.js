import mongoose from "mongoose";
import {
  userData,
  hotelData,
  commentData,
  reviewData,
  bookingData,
} from "./data/index.js";

async function dropDB() {
  const conn = mongoose.createConnection(
    "mongodb://127.0.0.1:27017/Group25_Hotel_Management"
  );

  await conn.dropDatabase();

  await conn.close();
}

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/Group25_Hotel_Management");

  let user1 = undefined;
  let user2 = undefined;
  let user3 = undefined;
  let user4 = undefined;
  let user5 = undefined;

  let manager1 = undefined;
  let manager2 = undefined;
  let manager3 = undefined;
  let manager4 = undefined;
  let manager5 = undefined;

  let hotel1 = undefined;
  let hotel2 = undefined;
  let hotel3 = undefined;

  let comment1 = undefined;
  let comment2 = undefined;
  let comment3 = undefined;

  let review1 = undefined;
  let review2 = undefined;
  let review3 = undefined;

  let room1 = undefined;
  let room2 = undefined;
  let room3 = undefined;
  let room4 = undefined;
  let room5 = undefined;
  let room6 = undefined;
  let room7 = undefined;
  let room8 = undefined;
  let room9 = undefined;

  let booking1 = undefined;
  let booking2 = undefined;
  let booking3 = undefined;
  let booking4 = undefined;
  let booking5 = undefined;
  let booking6 = undefined;

  try {
    user1 = await userData.create(
      "John",
      "Doe",
      "jdoe@gmail.com",
      "Jdoe@2023",
      "user"
    );
  } catch (e) {
    console.log(e);
  }

  try {
    user2 = await userData.create(
      "Atilla",
      "Duck",
      "aduckie@gmail.com",
      "AkewlDuck@2020",
      "user"
    );
  } catch (e) {
    console.log(e);
  }

  try {
    user3 = await userData.create(
      "Joe",
      "Doe",
      "joe@gmail.com",
      "Joe@2023",
      "user"
    );
  } catch (e) {
    console.log(e);
  }

  try {
    user4 = await userData.create(
      "Jone",
      "Doe",
      "jdone@gmail.com",
      "Jdone@2023",
      "user"
    );
  } catch (e) {
    console.log(e);
  }

  try {
    user5 = await userData.create(
      "jerry",
      "gill",
      "gill@gmail.com",
      "Gill@2023",
      "user"
    );
  } catch (e) {
    console.log(e);
  }

  try {
    manager1 = await userData.create(
      "Jane",
      "Parker",
      "jparker@gmail.com",
      "parkItHere@1998",
      "hotel"
    );
  } catch (e) {
    console.log(e);
  }

  try {
    manager2 = await userData.create(
      "Teddy",
      "Chan",
      "chantee@gmail.com",
      "WuzGood@1337",
      "hotel"
    );
  } catch (e) {
    console.log(e);
  }

  try {
    manager3 = await userData.create(
      "lane",
      "Parker",
      "lparker@gmail.com",
      "parkIt@1998",
      "hotel"
    );
  } catch (e) {
    console.log(e);
  }

  try {
    manager4 = await userData.create(
      "dane",
      "tarker",
      "jtarker@gmail.com",
      "tarkItHere@1998",
      "hotel"
    );
  } catch (e) {
    console.log(e);
  }

  try {
    manager5 = await userData.create(
      "mane",
      "Parker",
      "mparker@gmail.com",
      "parkHere@1998",
      "hotel"
    );
  } catch (e) {
    console.log(e);
  }

  try {
    hotel1 = await hotelData.create(
      "Sheraton",
      "Sheraton is a global hotel brand that is part of the Marriott International group. Sheraton hotels are known for providing upscale accommodations and services, targeting both business and leisure travelers. ",
      manager1._id.toString()
    );
  } catch (e) {
    console.log(e);
  }

  try {
    hotel2 = await hotelData.create(
      "Conrad",
      "Conrad Hotels & Resorts is a luxury hotel brand under the Hilton Worldwide portfolio. Known for its sophisticated and upscale accommodations, Conrad caters to discerning travelers seeking premium experiences.",
      manager2._id.toString()
    );
  } catch (e) {
    console.log(e);
  }

  try {
    hotel3 = await hotelData.create(
      "Marriott",
      "Marriott Hotels is a globally recognized hotel brand and a flagship part of the Marriott International portfolio. Catering to a diverse range of travelers, Marriott Hotels are known for their commitment to providing comfortable accommodations, modern amenities, and excellent service.",
      manager3._id.toString()
    );
  } catch (e) {
    console.log(e);
  }

  try {
    comment1 = await commentData.create(
      hotel1._id.toString(),
      user1._id.toString(),
      "Loved The stay"
    );
  } catch (e) {
    console.log(e);
  }

  try {
    comment2 = await commentData.create(
      hotel1._id.toString(),
      user2._id.toString(),
      "Loved The Food"
    );
  } catch (e) {
    console.log(e);
  }

  try {
    comment3 = await commentData.create(
      hotel3._id.toString(),
      user3._id.toString(),
      "Loved The Ambience around the hotel!"
    );
  } catch (e) {
    console.log(e);
  }

  try {
    review1 = await reviewData.create(
      hotel1._id.toString(),
      user1._id.toString(),
      "Loved The stay",
      4
    );
  } catch (e) {
    console.log(e);
  }

  try {
    review2 = await reviewData.create(
      hotel1._id.toString(),
      user2._id.toString(),
      "Loved The Food",
      3
    );
  } catch (e) {
    console.log(e);
  }

  try {
    review3 = await reviewData.create(
      hotel3._id.toString(),
      user3._id.toString(),
      "Loved The Ambience around the hotel!",
      4
    );
  } catch (e) {
    console.log(e);
  }

  try {
    room1 = await hotelData.createRoom(
      hotel1._id.toString(),
      manager1._id.toString(),
      "Deluxe",
      402,
      2,
      1000
    );
  } catch (e) {
    console.log(e);
  }

  try {
    room2 = await hotelData.createRoom(
      hotel1._id.toString(),
      manager1._id.toString(),
      "Super Deluxe",
      302,
      3,
      150
    );
  } catch (e) {
    console.log(e);
  }

  try {
    room3 = await hotelData.createRoom(
      hotel1._id.toString(),
      manager1._id.toString(),
      "Super Deluxe Suite",
      405,
      4,
      280
    );
  } catch (e) {
    console.log(e);
  }

  try {
    room4 = await hotelData.createRoom(
      hotel2._id.toString(),
      manager2._id.toString(),
      "Deluxe",
      402,
      2,
      1000
    );
  } catch (e) {
    console.log(e);
  }

  try {
    room5 = await hotelData.createRoom(
      hotel2._id.toString(),
      manager2._id.toString(),
      "Super Deluxe",
      302,
      3,
      150
    );
  } catch (e) {
    console.log(e);
  }

  try {
    room6 = await hotelData.createRoom(
      hotel2._id.toString(),
      manager2._id.toString(),
      "Super Deluxe Suite",
      405,
      4,
      280
    );
  } catch (e) {
    console.log(e);
  }

  try {
    room7 = await hotelData.createRoom(
      hotel3._id.toString(),
      manager3._id.toString(),
      "Deluxe",
      402,
      2,
      1000
    );
  } catch (e) {
    console.log(e);
  }

  try {
    room8 = await hotelData.createRoom(
      hotel3._id.toString(),
      manager3._id.toString(),
      "Super Deluxe",
      302,
      3,
      150
    );
  } catch (e) {
    console.log(e);
  }

  try {
    room9 = await hotelData.createRoom(
      hotel3._id.toString(),
      manager3._id.toString(),
      "Super Deluxe Suite",
      405,
      4,
      280
    );
  } catch (e) {
    console.log(e);
  }

  try {
    booking1 = await bookingData.create(
      hotel3._id.toString(),
      room9._id.toString(),
      user3._id.toString(),
      "05/23/2024",
      "05/29/2024"
    );
  } catch (e) {
    console.log(e);
  }

  try {
    booking2 = await bookingData.create(
      hotel3._id.toString(),
      room8._id.toString(),
      user4._id.toString(),
      "08/23/2024",
      "08/26/2024"
    );
  } catch (e) {
    console.log(e);
  }

  try {
    booking3 = await bookingData.create(
      hotel2._id.toString(),
      room6._id.toString(),
      user5._id.toString(),
      "03/23/2024",
      "03/25/2024"
    );
  } catch (e) {
    console.log(e);
  }

  try {
    booking4 = await bookingData.create(
      hotel2._id.toString(),
      room5._id.toString(),
      user4._id.toString(),
      "01/23/2024",
      "01/25/2024"
    );
  } catch (e) {
    console.log(e);
  }

  try {
    booking5 = await bookingData.create(
      hotel3._id.toString(),
      room7._id.toString(),
      user1._id.toString(),
      "01/12/2024",
      "01/13/2024"
    );
  } catch (e) {
    console.log(e);
  }

  try {
    booking6 = await bookingData.create(
      hotel3._id.toString(),
      room7._id.toString(),
      user2._id.toString(),
      "01/23/2024",
      "01/24/2024"
    );
  } catch (e) {
    console.log(e);
  }

  console.log(
    manager3,
    manager5,
    manager4,
    manager1,
    manager2
    // hotel1,
    // hotel2,
    // hotel3,
    // comment1,
    // comment2,
    // comment3,
    // review1,
    // review2,
    // review3,
    // booking1,
    // booking2,
    // booking3,
    // booking4,
    // booking5,
    // booking6,
    // room1,
    // room2,
    // room3,
    // room4,
    // room5,
    // room6,
    // room7,
    // room8,
    // room9
  );

  console.log("Done seeding :)");
  process.exit(1);
}

await dropDB();
main();
