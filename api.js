const API_LINK = "";
const message_container = document.querySelector("#message_container");
const dots = document.querySelectorAll(".dot");
const img_element = document.querySelector("#img");
const submit_button = document.querySelector("#submit-button");
const form = document.querySelector("#form");
let myInterval;

async function load_pic(url, formDataString) {
	const options = {
		method: "GET"
	}

	const response = await fetch(url + "?" + formDataString, options)

	console.log(response.status);

	const imageBlob = await response.blob()
	const imageBase64 = URL.createObjectURL(imageBlob);

	img_element.src = imageBase64;
	// img_element.style.opacity = "1";

	// message_container.style.display = "none";
	message_container.style.opacity = "0";
	submit_button.disabled = false;
	img_element.classList.remove("out_of_focus");
	clearInterval(myInterval);

	download(url, imageBase64);
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

let count = 0;

function get_badge(e) {
	e.preventDefault(); // Prevent the default form submission

	message_container.style.opacity = "1";
	// message_container.style.display = "block";

	img_element.classList.add("out_of_focus");

	myInterval = window.setInterval( function() {
		if ( count == dots.length ) {
			setTimeout(() => {
				dots.forEach(dot => {
					dot.style.opacity = "0";
				});
				count = 0;
			}, 600);
		}
		else {
			dots[count].style.opacity = "1";
			count++;
		}
		},
		300
	);

	// img_element.style.opacity = "0";

	submit_button.disabled = true;

	// Collect the form data
	const formData = new FormData(this);
	let keyValuePairs = [];
	for (let pair of formData.entries()) {
		keyValuePairs.push(pair[0][0].toLowerCase() + "=" + pair[1].split(" ").join("+"));
	}

	load_pic("https://btf.pythonanywhere.com/badge-going", keyValuePairs.join("&"));
}

form.addEventListener("submit", get_badge);


submit_button.disabled = true;
submit_button.classList.add("disabled");
document.querySelectorAll('.required').forEach(inputElt => {
	inputElt.addEventListener("input", function () {
		if (this.value === "" && submit_button.disabled===false) {
			submit_button.disabled = true;
			submit_button.classList.add("disabled");
			return
		}
		submit_button.disabled = false;
		submit_button.classList.remove("disabled");
	})
});

// form.addEventListener("submit", submit_to_gsheets);