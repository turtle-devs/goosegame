function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

function getCookie(cname) {
	  let name = cname + "=";
	  let decodedCookie = decodeURIComponent(document.cookie);
	  let ca = decodedCookie.split(';');
	  for(let i = 0; i <ca.length; i++) {
	    let c = ca[i];
	    while (c.charAt(0) == ' ') {
	      c = c.substring(1);
	    }
	    if (c.indexOf(name) == 0) {
	      return c.substring(name.length, c.length);
	    }
	  }
	  return "";
	}
/*
	function decodeJWTResponse(token) {
	    var base64Url = token.split('.')[1];
	    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
	    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
	        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
	    }).join(''));
	
	    return JSON.parse(jsonPayload);
	}
	if (getCookie(`loggedin`) != 'true') {
		//         data-login_uri="https://goosegame.turtlesda.repl.co"
		glogin.innerHTML = `
	 <div id="g_id_onload"
	         data-client_id="1085811017462-jls85p7ge8068jb6vuu1c1e27gch0t1r.apps.googleusercontent.com"
	         data-auto_prompt="true"
			 data-callback="handleCredentialResponse">
	      </div>
	      <div class="g_id_signin"
	         data-type="standard"
	         data-size="large"
	         data-theme="outline"
	         data-text="sign_in_with"
	         data-shape="rectangular"
	         data-logo_alignment="left">
	      </div>`
	}
	else {
		function handleCredentialResponse(response) {
	     const responsePayload = decodeJWTResponse(response.credential);
	
	     console.log("ID: " + responsePayload.sub);
	     console.log('Full Name: ' + responsePayload.name);
	     console.log('Given Name: ' + responsePayload.given_name);
	     console.log('Family Name: ' + responsePayload.family_name);
	     console.log("Image URL: " + responsePayload.picture);
	     console.log("Email: " + responsePayload.email);
		}
		glogin.innerHTML = `<h3>Signed in as <img src="${responsePayload.picture}">${responsePayload.name}</h3>`
	}
*/
/*
if (getCookie(`LoggedInWithReplit`) === `true`) {
	const loginbutton = document.getElementById(`LoginWithReplitButton`)
	loginbutton.style.display = "none"
}
*/
if (getCookie(`REPL_AUTH`) === null) {
	const loginbutton = document.getElementById(`LoginWithReplitButton`)
	loginbutton.style.display = "none"
}

function closeLoginWithReplitButton() {
	//document.cookie = `LoggedInWithReplit = true`
	const loginbutton = document.getElementById(`LoginWithReplitButton`)
	loginbutton.style.display = "none"
}
/*
sleep(1200)
document.body.innerHTML = `<style>img { position: relative; }</style><center><img src="images/banpagegoose.png"><h1>Banned</h1><h3>goosegame Discord Server: <a href="https://discord.gg/m8y5hrp8a">discord.gg/m8y5hrp8aq</a></h3></center>`
alert(`You've been banned from goosegame. Please open a ticket in the goosegame Discord server if you believe this is a mistake.`)
*/