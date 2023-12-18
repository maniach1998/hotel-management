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
  let manager1 = undefined;
  let manager2 = undefined;

  let manager3 = undefined;

  let manager4 = undefined;

  let manager5 = undefined;
  let user5 = undefined;
  let user3 = undefined;
  let user4 = undefined;
  let hotel1 = undefined;
  let hotel2 = undefined;
  let hotel3 = undefined;

  try {
    hotel1 = await hotelData.create(
      "Sheraton",
      "Sheraton is a global hotel brand that is part of the Marriott International group. Sheraton hotels are known for providing upscale accommodations and services, targeting both business and leisure travelers. ",
      manager1._id
    );
  } catch (e) {
    console.log(e);
  }
  try {
    hotel2 = await hotelData.create(
      "Conrad",
      "Conrad Hotels & Resorts is a luxury hotel brand under the Hilton Worldwide portfolio. Known for its sophisticated and upscale accommodations, Conrad caters to discerning travelers seeking premium experiences.",
      manager2._id
    );
  } catch (e) {
    console.log(e);
  }
  try {
    hotel3 = await hotelData.create(
      "Marriott",
      "Marriott Hotels is a globally recognized hotel brand and a flagship part of the Marriott International portfolio. Catering to a diverse range of travelers, Marriott Hotels are known for their commitment to providing comfortable accommodations, modern amenities, and excellent service.",
      manager3._id
    );
  } catch (e) {
    console.log(e);
  }

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
      "gill@2023",
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

  console.log(
    user1,
    user2,
    user4,
    user3,
    user5,
    manager3,
    manager5,
    manager4,
    manager1,
    manager2
  );
}

await dropDB();
main();
