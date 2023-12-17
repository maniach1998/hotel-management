const hotelForm = document.getElementById('create-hotel-form');
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

// Helpers //

document.addEventListener('DOMContentLoaded', function () {
	console.log('Loaded');

	hotelForm && hotelForm.addEventListener('submit', handleSubmit);
});

async function handleSubmit(e) {
	e.preventDefault();

	const errors = [];
	errorsList.innerHTML = '';
	errorsDiv.hidden = true;

	const formData = {
		name: hotelForm.elements['name'].value,
		description: hotelForm.elements['description'].value,
	};

	// Validation
	try {
		formData.name = checkString(formData.name, 'Hotel name');
	} catch (e) {
		errors.push(e.message);
	}

	try {
		formData.description = checkString(formData.description, 'Hotel description');
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
		// POST data to the API route
		hotelForm.submit();
	}
}
