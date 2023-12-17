function checkString(value, name) {
	if (!value || typeof value !== 'string')
		throw new Error(`\`${name}\` must be a non-empty string!`);

	value = value.trim();
	if (value.length === 0) throw new Error(`\`${name}\` cannot be empty string or just spaces!`);

	return value;
}

function checkValidEmail(emailAddress, name) {
	emailAddress = checkString(emailAddress, name);

	// Regex taken from https://emailregex.com/
	const emailRegex =
		/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	if (!emailRegex.test(emailAddress))
		throw new Error(`\`${name}\` should be a valid email address!`);

	return emailAddress.toLowerCase();
}

function checkValidPassword(password, name) {
	password = checkString(password, name);

	// remove whitespace from password
	password = password.replace(/\s+/g, '');

	// Regex that matches for atleast one uppercase, atleast one number, atleast one special character, and minimum 8 characters length
	const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[\W]).{8,}$/;

	if (!passwordRegex.test(password))
		throw new Error(
			`\`${name}\` should have at least one uppercase character, at least one number and at least one special character, with a minimum of 8 characters!`
		);

	return password;
}

const form = document.getElementById('form');
const emailElement = document.getElementById('email');
const passwordElement = document.getElementById('password');

form.addEventListener('submit', (e) => {
	e.preventDefault();
	inputValidation();
	form.submit();
});

function inputValidation() {
	const emailValue = emailElement.value.trim();
	const passwordValue = passwordElement.value;

	validateField(emailElement, emailValue, checkValidEmail, 'Email');
	validateField(passwordElement, passwordValue, checkValidPassword, 'Password');
}

function validateField(element, value, validationFunc, fieldName) {
	try {
		validationFunc(value, fieldName);
		setSuccessFor(element);
	} catch (error) {
		setErrorFor(element, error.message);
	}
}

function setErrorFor(input, message) {
	const formControl = input.parentElement;
	const errorMessage = formControl.querySelector('.error-message');
	formControl.classList.add('error');
	errorMessage.innerText = message;
	errorMessage.style.display = 'block';
}

function setSuccessFor(input) {
	const formControl = input.parentElement;
	formControl.className = 'input-container success';
}
