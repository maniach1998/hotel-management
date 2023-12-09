import { Router } from "express";
const router = Router();

import { hotelData, commentData } from "../data/index.js";
import { checkId, checkString, checkNumber } from "../helpers.js";

router
  .route("/")
  .get(async (req, res) => {
    try {
      const hotels = await hotelData.getAll();

      // TODO: render template for displaying all hotels

      return res.send(hotels);
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  })
  .post(async (req, res) => {
    const newHotelData = req.body;

    if (newHotelData === undefined || Object.keys(newHotelData).length === 0)
      return res
        .status(400)
        .send({ error: "No fields provided in request body!" });

    // TODO: validate new hotel data
    // unauthorized user -> redirect to '/error' (status code 403)
    // authorized user -> check if accountType is 'hotel' -> else redirect to '/error' (status code 403)
    // invalid data -> re-render form with errors (status code 400)

    // Validation fields-
    // name: valid string
    // description: valid string
    // valid data -> create new hotel and redirect to '/hotels/:hotelId' -> if failed, redirect to '/error' (status code 500)

    // try {
    // } catch (e) {
    // 	return res.status(400).send({ error: e.message });
    // }

    try {
      const hotel = await hotelData.create(
        newHotelData.name,
        newHotelData.manager
      );

      return res.send(hotel);
    } catch (e) {
      console.log(e);
      return res.status(500).send({ error: e.message });
    }
  });

router
  .route("/:hotelId")
  .get(async (req, res) => {
    // TODO: get individual hotel with _id: hotelId
    // hotelId: valid ObjectId -> check if hotel exists
    // return hotel
    let { hotelId } = req.params;

    // Check hotel id
    try {
      hotelId = checkId(hotelId, "hotelId");
    } catch (e) {
      return res.status(400).send({ error: e.message });
    }

    try {
      const hotel = await hotelData.get(hotelId);

      return res.send({ hotel });
    } catch (e) {
      return res.status(e.status).send({ error: e.message });
    }
  })
  .patch(async (req, res) => {
    // TODO: update a hotel with _id: hotelId
    // hotelId: valid ObjectId -> check if hotel exists
    // name: valid string
    // description: valid string
    // return updated hotel
    let { hotelId } = req.params;
    const updatedHotelData = req.body;

    const errors = [];

    // Check hotel id
    try {
      hotelId = checkId(hotelId, "hotelId");
    } catch (e) {
      errors.push(e.message);
    }

    // Check name
    try {
      updatedHotelData.name = checkString(updatedHotelData.name, "name");
    } catch (e) {
      errors.push(e.message);
    }

    // Check description
    try {
      updatedHotelData.description = checkString(
        updatedHotelData.description,
        "description"
      );
    } catch (e) {
      errors.push(e.message);
    }

    // If errors exist, return errors with 400
    if (errors.length > 0) {
      return res.status(400).send({ errors });
    }

    try {
      const hotel = await hotelData.update(
        hotelId,
        updatedHotelData.name,
        updatedHotelData.description
      );

      return res.send({ hotel });
    } catch (e) {
      return res.status(e.status).send({ error: e.message });
    }
  })
  .delete(async (req, res) => {
    // TODO: delete a hotel with _id: hotelId if exists
    // return deleted hotel
    let { hotelId } = req.params;

    const errors = [];
    // Check hotel id
    try {
      hotelId = checkId(hotelId, "hotelId");
    } catch (e) {
      errors.push(e.message);
    }

    // If errors exist, return errors with 400
    if (errors.length > 0) {
      return res.status(400).send({ errors });
    }

    try {
      const hotel = await hotelData.delete(hotelId);

      return res.send({ hotel });
    } catch (e) {
      return res.status(e.status).send({ error: e.message });
    }
  });

router
  .route("/:hotelId/rooms")
  .get(async (req, res) => {
    // TODO: get all rooms of a hotel with _id: hotelId
    let { hotelId } = req.params;
    // hotelId: valid ObjectId -> check if hotel exists
    try {
      hotelId = checkId(hotelId, "hotel");
    } catch (e) {
      return res.status(400).send({ error: e.message });
    }

    try {
      const rooms = await hotelData.getAllRooms(hotelId);

      return res.send({ rooms });
    } catch (e) {
      return res.status(e.status).send({ error: e.message });
    }
    // return rooms
  })
  .post(async (req, res) => {
    // TODO: create a new Room in hotel with _id: hotelId
    let { hotelId } = req.params;
    const newRoomData = req.body;

    const errors = [];
    // hotelId: valid ObjectId -> check if hotel exists
    try {
      hotelId = checkId(hotelId, "hotel");
    } catch (e) {
      errors.push(e.message);
    }

    // type: valid string
    try {
      newRoomData.type = checkString(newRoomData.type, "type");
    } catch (e) {
      errors.push(e.message);
    }
    // number: valid number
    try {
      newRoomData.number = checkNumber(newRoomData.number, "number");
    } catch (e) {
      errors.push(e.message);
    }
    // price: valid number

    try {
      newRoomData.price = checkNumber(newRoomData.price, "price");
    } catch (e) {
      errors.push(e.message);
    }

    if (errors.length > 0) {
      return res.status(400).send({ errors });
    }

    // return new room
    try {
      const room = await hotelData.createRoom(
        newRoomData.type,
        newRoomData.number,
        newRoomData.price
      );

      return res.send({ room });
    } catch (e) {
      return res.status(e.status).send({ error: e.message });
    }
  });

router
  .route("/:hotelId/rooms/:roomId")
  .get(async (req, res) => {
    // TODO: get room with _id: roomId of a hotel with _id: hotelId
    // hotelId: valid ObjectId -> check if hotel exists
    // roomId: valid ObjectId -> check if room exists
    // return room

    let { hotelId } = req.params.hotelId;
    let { roomId } = req.params.roomId;

    try {
      hotelId = checkId(hotelId, "hotel");
    } catch (e) {
      return res.status(400).send({ error: e.message });
    }

    try {
      roomId = checkId(roomId, "room");
    } catch (e) {
      return res.status(400).send({ error: e.message });
    }

    try {
      const room = await hotelData.getRoom(hotelId, roomId);

      return res.send({ room });
    } catch (e) {
      return res.status(e.status).send({ error: e.message });
    }
  })
  .post(async (req, res) => {
    // TODO: book room with _id: roomId in hotel with _id: hotelId
    // hotelId: valid ObjectId -> check if hotel exists
    // roomId: valid ObjectId -> check if room exists
    // Validation fields-
    // bookedBy: valid ObjectId -> check if user exists
    // bookedFrom: valid Date -> check if date is in the future
    // bookedTill: valid Date -> check if date is in the future AND after bookedFrom date
    // return booking status and booked room
    let { hotelId } = req.params.hotelId;
    let { roomId } = req.params.roomId;
    const bookingData = req.body;

    const errors = [];

    // Check hotel id
    try {
      hotelId = checkId(hotelId, "hotelId");
    } catch (e) {
      errors.push(e.message);
    }
    // Check room id
    try {
      roomId = checkId(roomId, "roomId");
    } catch (e) {
      errors.push(e.message);
    }
    // Check user id

    try {
      bookingData.bookedBy = checkId(bookingData.bookedBy, "bookedBy");
    } catch (e) {
      errors.push(e.message);
    }

    // Check Checkin
    try {
      bookingData.bookedFrom = checkCheckin(
        bookingData.bookedFrom,
        "bookedFrom"
      );
    } catch (e) {
      errors.push(e.message);
    }

    // Check Checkout
    try {
      bookingData.bookedTill = checkCheckout(
        bookingData.bookedTill,
        "bookedTill"
      );
    } catch (e) {
      errors.push(e.message);
    }

    // If errors exist, return errors with 400
    if (errors.length > 0) {
      return res.status(400).send({ errors });
    }

    try {
      const book = await hotelData.bookRoom(
        hotelId,
        roomId,
        bookingData.bookedBy,
        bookingData.bookedFrom,
        bookingData.bookedTill
      );

      return res.send({ book });
    } catch (e) {
      return res.status(e.status).send({ error: e.message });
    }
  })
  .patch(async (req, res) => {
    // TODO: update room with _id: roomId in hotel with _id: hotelId
    // hotelId: valid ObjectId -> check if hotel exists
    // roomId: valid ObjectId -> check if room exists
    // Validation fields-
    // type: valid string (optional)
    // number: valid number (optional)
    // price: valid number (optional)
    // return updated room
    let { hotelId } = req.params.hotelId;
    let { roomId } = req.params.roomId;
    const updatedRoomData = req.body;

    const errors = [];

    // Check hotel id
    try {
      hotelId = checkId(hotelId, "hotelId");
    } catch (e) {
      errors.push(e.message);
    }
    // Check room id
    try {
      roomId = checkId(roomId, "roomId");
    } catch (e) {
      errors.push(e.message);
    }

    // Check type
    try {
      updatedRoomData.type = checkString(updatedRoomData.type, "type");
    } catch (e) {
      errors.push(e.message);
    }

    // Check number
    try {
      updatedRoomData.number = checkNumber(updatedRoomData.number, "number");
    } catch (e) {
      errors.push(e.message);
    }

    // Check price
    try {
      updatedRoomData.price = checkNumber(updatedRoomData.price, "price");
    } catch (e) {
      errors.push(e.message);
    }

    // If errors exist, return errors with 400
    if (errors.length > 0) {
      return res.status(400).send({ errors });
    }

    try {
      const room = await hotelData.updateRoom(
        hotelId,
        roomId,
        updatedRoomData.type,
        updatedRoomData.number,
        updatedRoomData.price
      );

      return res.send({ room });
    } catch (e) {
      return res.status(e.status).send({ error: e.message });
    }
  })
  .delete(async (req, res) => {
    // TODO: delete room with _id: roomId in hotel with _id: hotelId
    // hotelId: valid ObjectId -> check if hotel exists
    // roomId: valid ObjectId -> check if room exists
    // return deleted room

    let { hotelId } = req.params.hotelId;
    let { roomId } = req.params.roomId;

    try {
      hotelId = checkId(hotelId, "hotel");
    } catch (e) {
      return res.status(400).send({ error: e.message });
    }

    try {
      roomId = checkId(roomId, "room");
    } catch (e) {
      return res.status(400).send({ error: e.message });
    }

    try {
      const room = await hotelData.removeRoom(hotelId, roomId);

      return res.send({ room });
    } catch (e) {
      return res.status(e.status).send({ error: e.message });
    }
  });

router.route("/comment").post(async (req, res) => {
  // Creates a new comment
  const newCommentData = req.body;

  const errors = [];

  // Validation
  // Check comment hotel id
  try {
    newCommentData.hotel = checkId(newCommentData.hotel, "hotel");
  } catch (e) {
    errors.push(e.message);
  }

  // Check comment author id
  try {
    newCommentData.author = checkId(newCommentData.author, "author");
  } catch (e) {
    errors.push(e.message);
  }

  // Check comment content
  try {
    newCommentData.content = checkString(newCommentData.content, "content");
  } catch (e) {
    errors.push(e.message);
  }

  // If errors exist, return errors with 400
  if (errors.length > 0) {
    return res.status(400).send({ errors });
  }

  // If data is valid, create a new comment
  try {
    const comment = await commentData.create(
      newCommentData.hotel,
      newCommentData.author,
      newCommentData.content
    );

    return res.send({ comment });
  } catch (e) {
    return res.status(e.status).send({ error: e.message });
  }
});

router
  .route("/comment/:commentId")
  .get(async (req, res) => {
    // Returns a comment/reply with _id: commentId if exists
    let commentId = req.params.commentId;

    // Validation
    try {
      commentId = checkId(commentId, "commentId");
    } catch (e) {
      return res.status(400).send({ error: e.message });
    }

    // Get the requested comment
    try {
      const comment = await commentData.get(commentId);

      return res.send({ comment });
    } catch (e) {
      return res.status(e.status).send({ error: e.message });
    }
  })
  .patch(async (req, res) => {
    // Updates a comment/reply with _id: commentId if exists
    let commentId = req.params.commentId;
    const updatedCommentData = req.body;

    const errors = [];

    // Validation
    // Check comment id
    try {
      commentId = checkId(commentId, "commentId");
    } catch (e) {
      errors.push(e.message);
    }

    // Check updated content
    try {
      updatedCommentData.content = checkString(
        updatedCommentData.content,
        "content"
      );
    } catch (e) {
      errors.push(e.message);
    }

    // If errors exist, return errors with 400
    if (errors.length > 0) {
      return res.status(400).send({ errors });
    }

    // If data is valid, update the comment
    try {
      const updatedComment = await commentData.update(
        commentId,
        updatedCommentData.content
      );

      return res.send({ comment: updatedComment });
    } catch (e) {
      return res.status(e.status).send({ error: e.message });
    }
  })
  .delete(async (req, res) => {
    // Deletes a comment with _id: commentId if exists
    let commentId = req.params.commentId;

    // Validation
    try {
      commentId = checkId(commentId, "commentId");
    } catch (e) {
      return res.status(400).send({ error: e.message });
    }

    // Delete the comment
    try {
      const deletedComment = await commentData.remove(commentId);

      return res.send({ comment: deletedComment, deleted: true });
    } catch (e) {
      return res.status(e.status).send({ error: e.message });
    }
  });

router
  .route("/comment/:commentId/replies")
  .get(async (req, res) => {
    // Returns the replies of a comment with _id: commentId
    // TODO: testing and populating
    let commentId = req.params.commentId;

    // Validation
    try {
      commentId = checkId(commentId, "commentId");
    } catch (e) {
      return res.status(400).send({ error: e.message });
    }

    // Get all replies of the comment
    try {
      const replies = await commentData.getReplies(commentId);

      return res.send({ replies });
    } catch (e) {
      return res.status(e.status).send({ error: e.message });
    }
  })
  .post(async (req, res) => {
    // TODO: create a new reply to `commentId` comment
  })
  .delete(async (req, res) => {
    // TODO: delete a reply
  });

router
  .route("/comment/:commentId/replies/:replyId")
  .patch(async (req, res) => {
    // TODO: update reply content
    // commentId: valid ObjectId -> check if comment exist
    // replyId: valid ObjectId -> check if reply exists
    // content: valid string
    // return updated reply
  })
  .delete(async (req, res) => {
    // TODO: delete reply from a comment
    // commentId: valid ObjectId -> check if comment exist
    // replyId: valid ObjectId -> check if reply exists
    // return deleted reply
  });

export default router;
