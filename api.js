const API_LINK = "";
const message_container = document.querySelector("#message_container");
const dots = document.querySelectorAll(".dot");
const img_element = document.querySelector("#img");
const submit_button = document.querySelector("#submit-button");
const form = document.querySelector("#form");

const share_button = document.querySelector("#share_button");
const share_container = document.querySelector("#share_container");

let first_time_generating = true;

let myInterval;

let imageBlob;
let imageBase64;
const url = "https://btf.pythonanywhere.com/badge-going";

async function load_pic(url, formDataString) {
	const options = {
		method: "GET"
	}

	const response = await fetch(url + "?" + formDataString, options)

	console.log(response.status);

	imageBlob = await response.blob()
	imageBase64 = URL.createObjectURL(imageBlob);

	img_element.src = imageBase64;
	// img_element.style.opacity = "1";

	// message_container.style.display = "none";
	message_container.style.opacity = "0";
	
	img_element.classList.remove("out_of_focus");

	submit_button.disabled = false;
	share_button.disabled = false;

	clearInterval(myInterval);

	// setTimeout(
	// 	async function () {
	// 		await export_image(url, imageBase64, imageBlob)
	// 	},
	// 	1 * 1000
	// )
	setTimeout(
		async function () {
			img_element.classList.remove("out_of_focus");
		},
		1000
	)

	setTimeout(
		async function () {
			document.getElementById('content').classList.add("out_of_focus");
			share_container.classList.add("bring-front");
		},
		150
	)


	share_button.classList.remove("disabled");
}

async function export_image(url, imageBase64, imageBlob) {
	try {
		if (navigator.canShare) {
			const name_input = document.querySelector("#name_input");

			const file = new File(
				[imageBlob],
				"BITS Tech Fest Badge_" + name_input + ".jpg",
				{ type: imageBlob.type, lastModified: new Date().getTime() }
			);

			const shareData = {
				title: "BTF",
				text: "BITS Tech Fest Badge",
				files: [file]
			};

			await navigator.share(shareData);

		} else {
			download(url, imageBase64);
		}
	} catch (e) {
		document.querySelector("#console").innerHTML = e;
		console.log(e);
	}
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

	share_button.classList.add("disabled");

	message_container.style.opacity = "1";
	// message_container.style.display = "block";

	img_element.classList.add("out_of_focus");

	myInterval = window.setInterval(function () {
		if (count == dots.length) {
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
	let key;
	let value;
	for (let pair of formData.entries()) {
		key = pair[0][0].toLowerCase();
		value = (
			cleanup(pair[1])
				.split(" ")
				.join("+")
		);
		keyValuePairs.push(key + "=" + value);
	}

	load_pic(url, keyValuePairs.join("&"));
}

function cleanup(string) {
	return (
		string
			.replace("  ", " ")
			.trim()
	)
}


form.addEventListener("submit", get_badge);


share_button.disabled = true;
submit_button.disabled = true;

share_button.classList.add("disabled");
submit_button.classList.add("disabled");

document.querySelectorAll('.required').forEach(inputElt => {
	inputElt.addEventListener("input", function () {
		if (cleanup(this.value) === "" && submit_button.disabled === false) {
			submit_button.disabled = true;
			submit_button.classList.add("disabled");
		} else {
			submit_button.disabled = false;
			submit_button.classList.remove("disabled");
		}
	})
});

// form.addEventListener("submit", submit_to_gsheets);
// function show_share_popup() {
// 	share_container.classList.remove("hidden");
// }

function hide_share_popup() {
	share_container.classList.add("hidden");
	share_container.classList.remove("bring-front");
	document.getElementById('content').classList.remove("out_of_focus");

}