const forms = document.querySelectorAll(".needs-validation");

Array.prototype.slice.call(forms).forEach(function (form) {
	form.addEventListener(
		"submit",
		function (event) {
			if (!form.checkValidity()) {
				event.preventDefault();
				event.stopPropagation();
			}
			form.classList.add("was-validated");
			if (form.checkValidity()) {
				event.preventDefault();
				const data = new FormData(form);
				let user = {};
				for (const [name, value] of data) {
					user[name] = value;
				}
				localStorage.setItem("user", JSON.stringify(user));
				window.location.replace("index.html");
			}
		},
		false
	);
});

const parseJwt = (token) => {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

function handleCredentialResponse(response) {
  localStorage.setItem("user", JSON.stringify(parseJwt(response.credential)));
	window.location.replace("index.html");
}
window.onload = function () {
	google.accounts.id.initialize({
		client_id:
			"62009142741-5dk8qfhp91idaphbagaa10tcj8rpafcu.apps.googleusercontent.com",
		callback: handleCredentialResponse,
	});
	google.accounts.id.renderButton(
		document.getElementById("buttonDiv"),
		{ theme: "outline", size: "large" } // customization attributes
	);
	google.accounts.id.prompt(); // also display the One Tap dialog
};

// client ID 62009142741-5dk8qfhp91idaphbagaa10tcj8rpafcu.apps.googleusercontent.com
// client secret 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
