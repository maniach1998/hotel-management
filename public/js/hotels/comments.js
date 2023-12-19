// Helpers //
function checkString(value, name) {
	if (!value || typeof value !== 'string')
		throw new Error(`\`${name}\` must be a non-empty string!`);

	value = value.trim();
	if (value.length === 0) throw new Error(`\`${name}\` cannot be empty string or just spaces!`);

	return value;
}
// Helpers //

const commentForm = document.getElementById('create-comment-form');
const commentErrors = document.getElementById('comment-errors');
const commentsList = document.getElementById('comments-list');

document.addEventListener('DOMContentLoaded', function () {
	commentForm && commentForm.addEventListener('submit', handleComment);
});

function handleClick(id) {
	window.location.href = `/hotels/${id}/rooms`;
}

const handleComment = async (e) => {
	e.preventDefault();

	const errors = [];
	commentErrors.hidden = true;
	commentErrors.innerHTML = '';

	try {
		commentForm.elements['content'].value = checkString(
			commentForm.elements['content'].value,
			'Comment content'
		);
	} catch (e) {
		errors.push(e.message);
	}

	if (errors.length > 0) {
		errors.forEach((error) => {
			const errorElement = document.createElement('li');
			errorElement.innerHTML = error;

			commentErrors.appendChild(errorElement);
		});

		commentErrors.hidden = false;
	} else {
		const formData = { content: commentForm.elements['content'].value };

		await fetch(commentForm.action, {
			method: 'POST',
			body: JSON.stringify(formData),
			headers: { 'Content-Type': 'application/json' },
		})
			.then((res) => res.json())
			.then((data) => {
				const comment = data.comment;

				const commentElement = document.createElement('li');
				commentElement.setAttribute('id', comment._id);

				commentElement.innerHTML = `<div><h5>${comment.author}</h5><p>${comment.content}</p><p>Posted on: ${comment.createdAt}</p></div>`;

				commentsList.appendChild(commentElement);
			})
			.catch((err) => {
				const errorElement = document.createElement('li');
				errorElement.innerHTML = `<pre>${err}</pre>`;

				commentErrors.appendChild(errorElement);
				commentErrors.hidden = false;
			});
	}
};
