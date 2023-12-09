let roomTypeCount = 1; // Initial room type count
    const roomTypesContainer = document.getElementById('roomTypes');
    const addRoomTypeButton = document.getElementById('addRoomType');

    addRoomTypeButton.addEventListener('click', () => {
        roomTypeCount++;

        const newRoomTypeDiv = document.createElement('div');
        newRoomTypeDiv.classList.add('roomType');

        newRoomTypeDiv.innerHTML = `
            <label for="roomType${roomTypeCount}">Room Type:</label>
            <input type="text" id="roomType${roomTypeCount}" name="roomType[]" required>
            <label for="numberOfRooms${roomTypeCount}">Number of Rooms:</label>
            <input type="number" id="numberOfRooms${roomTypeCount}" name="numberOfRooms[]" min="1" required>
        `;

        roomTypesContainer.appendChild(newRoomTypeDiv);
    });