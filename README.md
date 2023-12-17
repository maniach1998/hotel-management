### User data and routes

- Dhanesh
- Dhruvin

### Hotel, comments and reviews data and routes

- Kshitij
- Manas

### Bookings data and routes

- Chen
- Manas

### Templating

- Everyone

### TODO

- [x] add middlewares for auth
- [x] setup express-session
- [ ] add xss
- [ ] add checking for dates using dayjs
- [ ] allow users to post reviews only once per hotel
- [ ] add type checking helper for optional fields (allows empty string)
- [ ] add type checking for room capacity
- [ ] add address and contact info to hotel schema
- [ ] delete related data when delete function is called (eg. manager acc deleted should also delete created hotels, and hotels bookings)

### Bookings flow

1. Method one

- create check available rooms method (hotelId, bookFrom, bookTill) which returns all available rooms for that hotel with bookFrom-bookTill date
- check for every room of that hotel if there is a booking in bookFrom-bookTill range. If booking exists, room is unavailable
- display available rooms list for users to choose from
