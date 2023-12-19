# Group 25 Hotel Management

### Group members

- Manas Acharekar
- Kshitij Gugale
- Dhruvin Raju Vasani
- Dhanesh Jagdish Akolu
- Chen Ye

### How to run the project

- Navigate to the project directory using `cd`
- Run `npm install` to install all required dependencies
- Check if `.env` file is present. It only has 1 environment variable inside it, named `MONGODB_URI="mongodb://127.0.0.1:27017/Group25_Hotel_Management"`, which links to the MongoDB database URI required to connect to the database when running the app
- Run `npm run seed` to seed the database with some test data
- Finally, run `npm start` to start the app. Runs default on port `3000`

### TODO

- [x] add middlewares for auth
- [x] setup express-session
- [x] add xss
- [x] add checking for dates using dayjs
- [x] allow users to post reviews only once per hotel
- [x] add type checking for room capacity
- [ ] add type checking helper for optional fields (allows empty string)
- [ ] add address and contact info to hotel schema

## Booking Functionality Issue

Currently, there seems to be an issue with the frontend implementation for bookings. To facilitate testing and showcase the backend functionality, I've included instructions below on how to make bookings using Postman:

### Instructions for Bookings Testing:

To simulate bookings, you can utilize Postman by sending a POST request to http://localhost:3000/bookings/ with the following raw JSON data:

```
{
  "hotel": "(insert hotelId here)",
  "room": "(insert roomId here)",
  "bookedBy": "(insert userId here)",
  "bookedFrom": "12/25/2023",
  "bookedTill": "12/30/2023"
}
```

### Instructions for Reviews Testing:

To simulate adding reviews, you can utilize Postman by sending a POST request to http://localhost:3000/hotels/:hotelId/reviews with the following raw JSON data:

```
{
  "author": "(insert userId here)",
  "content": "Loved this place, would visit again!",
  "rating": (whole number from 0-5),
  "bookedFrom": "12/25/2023",
  "bookedTill": "12/30/2023"
}
```

Please note that these methods bypass the frontend and directly interact with the backend.
