import { Router } from "express";
const router = Router();
import { bookingData } from "../data/index.js";
import { checkCheckout } from "../helpers.js";

router
  .route("/booking")
  .get(async (req, res) => {
    return res.render("home/booking", { title: "Booking" });
  })
  .post(async (req, res) => {
    //get booking data
    const bookingData = req.body;

    //validation
    try {
      bookingData.hotelId = checkId(bookingData.hotelId, "hotelId");
      bookingData.roomId = checkId(bookingData.roomId, "roomId");
      bookingData.firstName = checkString(bookingData.firstName, "First Name");
      bookingData.lastName = checkString(bookingData.lastName, "Last Name");
      bookingData.bookedFrom = checkCheckin(
        bookingData.bookedFrom,
        "Booked From"
      );
      bookingData.bookedTill = checkCheckout(
        bookingData.bookedTill,
        "Booked Till"
      );
    } catch (e) {
      return res.status(400).send({ error: e.message });
    }

    //create booking
    try {
      const booking = await bookingData.create(
        bookingData.hotelId,
        bookingData.roomId,
        bookingData.firstName,
        bookingData.lastName,
        bookingData.bookedFrom,
        bookingData.bookedTill
      );
      return res.send({ booking });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  });

router
  .route("/booking/:bookingId")
  .get(async (req, res) => {
    //get bookingId
    let { bookingId } = req.params;

    //validation
    try {
      bookingId = checkId(bookingId, "bookingId");
    } catch (e) {
      return res.status(400).send({ error: e.message });
    }

    try {
      const booking = await bookingData.get(bookingId);
      return res.send({ booking });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  })
  .put(async (req, res) => {
    //get bookingId
    let { bookingId } = req.params;
    //get booking data
    const bookingData = req.body;

    //validation
    try {
      bookingId = checkId(bookingId, "bookingId");
      bookingData.roomId = checkId(bookingData.roomId, "roomId");
      bookingData.firstName = checkString(bookingData.firstName, "First Name");
      bookingData.lastName = checkString(bookingData.lastName, "Last Name");
      bookingData.bookedFrom = checkCheckin(
        bookingData.bookedFrom,
        "Booked From"
      );
      bookingData.bookedTill = checkCheckout(
        bookingData.bookedTill,
        "Booked Till"
      );
    } catch (e) {
      return res.status(400).send({ error: e.message });
    }

    //update booking
    try {
      const booking = await bookingData.update(
        bookingId,
        bookingData.roomId,
        bookingData.firstName,
        bookingData.lastName,
        bookingData.bookedFrom,
        bookingData.bookedTill
      );
      return res.send({ booking });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  })
  .delete(async (req, res) => {
    //get bookingId
    let { bookingId } = req.params;
    const bookingData = req.body;

    //validation
    try {
      bookingId = checkId(bookingId, "bookingId");
    } catch (e) {
      return res.status(400).send({ error: e.message });
    }

    //delete booking
    try {
      const booking = await bookingData.cancel(bookingId, bookingData.lastName);
      return res.send({ booking });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  });
