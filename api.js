const API_LINK = "";
const message_element = document.querySelector("#message");
const img_element = document.querySelector("#img");
const submit_button = document.querySelector("#submit-button");
const form = document.querySelector("#form");

async function load_pic(url, formDataString) {
	const options = {
		method: "GET"
	}

	const response = await fetch(url + "?" + formDataString, options)

	const imageBlob = await response.blob()
	const imageBase64 = URL.createObjectURL(imageBlob);

	img_element.src = imageBase64;
	img_element.style.opacity = "1";

	download(url, imageBase64);
	message_element.style.display = "none";
}

function download(url, data) {
	const a = document.createElement('a');
	a.style.display = 'none';
	a.download = url.replace(/^.*[\\\/]/, '');
	a.href = data;

	document.body.appendChild(a);

	a.click();
	a.remove();
}

function get_badge(e) {
	e.preventDefault(); // Prevent the default form submission

	message_element.style.display = "block";
	message_element.textContent = "Generating ...";

	img_element.style.opacity = "0";

	submit_button.disabled = true;

	// Collect the form data
	const formData = new FormData(this);
	let keyValuePairs = [];
	for (let pair of formData.entries()) {
		keyValuePairs.push(pair[0][0].toLowerCase() + "=" + pair[1].split(" ").join("+"));
	}

	load_pic("https://btf.pythonanywhere.com/badge-going", keyValuePairs.join("&"));
}

function submit_to_gsheets(e) {
	e.preventDefault(); // Prevent the default form submission

	message_element.textContent = "Submitting..";
	message_element.style.display = "block";

	submit_button.disabled = true;

	// Collect the form data
	const formData = new FormData(this);
	let keyValuePairs = [];
	for (let pair of formData.entries()) {
		keyValuePairs.push(pair[0] + "=" + pair[1]);
	}

	const formDataString = keyValuePairs.join("&");

	// Send a POST request to your Google Apps Script
	fetch(
		API_LINK,
		{
			redirect: "follow",
			method: "POST",
			body: formDataString,
			headers: {
				"Content-Type": "text/plain;charset=utf-8",
			},
		}
	)
		.then(function (response) {
			// Check if the request was successful
			if (response) {
				return response; // Assuming your script returns JSON response
			} else {
				throw new Error("Failed to submit the form.");
			}
		})
		.then(function (data) {
			// Display a success message
			message_element.textContent =
				"Data submitted successfully!";
			message_element.style.display = "block";
			message_element.style.backgroundColor = "green";
			message_element.style.color = "beige";
			submit_button.disabled = false;
			form.reset();

			setTimeout(function () {
				message_element.textContent = "";
				message_element.style.display = "none";
			}, 2600);
		})
		.catch(function (error) {
			// Handle errors, you can display an error message here
			console.error(error);
			message_element.textContent =
				"An error occurred while submitting the form." + ": " + error;
			message_element.style.display = "block";
		});
}

form.addEventListener("submit", get_badge);
// form.addEventListener("submit", submit_to_gsheets);