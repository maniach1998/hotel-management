document.addEventListener('DOMContentLoaded', function () {
	const userProfileButton = document.getElementById('user-profile');

	userProfileButton.addEventListener('click', function () {
		window.location.href = '/userprofile';
	});
});
