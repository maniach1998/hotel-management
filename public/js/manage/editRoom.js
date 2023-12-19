const roomForm = document.getElementById('edit-room');
const errorsDiv = document.getElementById('errors');
const errorsList = document.getElementById('errors-list');

// Helpers //
function checkString(value, name) {
	if (!value || typeof value !== 'string')
		throw new Error(`\`${name}\` must be a non-empty string!`);

	value = value.trim();
	if (value.length === 0) throw new Error(`\`${name}\` cannot be empty string or just spaces!`);

	return value;
}

function checkNumber(value, name) {
	value = Number(value);
	if (value === undefined || typeof value !== 'number')
		throw new Error(`\`${name}\` must be non-empty number!`);
	if (value <= 0) throw new Error(`\`${name}\` must be a positive number greater than 0!`);

	return value;
}
// Helpers //

document.addEventListener('DOMContentLoaded', function () {
	console.log('Loaded');

	roomForm && roomForm.addEventListener('submit', handleEdit);
});

async function handleEdit(e) {
	e.preventDefault();

	const errors = [];
	errorsList.innerHTML = '';
	errorsDiv.hidden = true;

	const formData = {
		type: roomForm.elements['type'].value,
		number: roomForm.elements['number'].value,
		capacity: roomForm.elements['capacity'].value,
		price: roomForm.elements['price'].value,
	};

	// Validation
	try {
		formData.type = checkString(formData.type, 'Room Type');
	} catch (e) {
		errors.push(e.message);
	}

	try {
		formData.number = checkNumber(formData.number, 'Room Number');
	} catch (e) {
		errors.push(e.message);
	}

	try {
		formData.capacity = checkNumber(formData.capacity, 'Room Capacity');
	} catch (e) {
		errors.push(e.message);
	}

	try {
		formData.price = checkNumber(formData.price, 'Room Price');
	} catch (e) {
		errors.push(e.message);
	}

	if (errors.length > 0) {
		errorsDiv.hidden = false;

		errors.forEach((error) => {
			const errorElement = document.createElement('li');
			errorElement.innerHTML = error;

			errorsList.appendChild(errorElement);
		});
	} else {
		// PUT data to the API route
		await fetch(roomForm.action, {
			method: 'PUT',
			body: JSON.stringify(formData),
			headers: { 'Content-Type': 'application/json' },
		})
			.then((res) => res.json())
			.then((data) => {
				window.location.href = window.location.href.replace(data.room._id, '');
			})
			.catch((err) => {
				const errorElement = document.createElement('li');
				errorElement.innerHTML = `<pre>${err}</pre>`;

				errorsList.appendChild(errorElement);
				errorsList.hidden = false;
			});
	}
}
