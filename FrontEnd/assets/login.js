const formLogin = document.getElementById("login");
const inputEmail = document.getElementById("email");
const inputPassword = document.getElementById("password")
const errorMessage = document.getElementById("error_message");


/**
 * add an event listener to catch the submit of the login and password
 * allow to send a request to the backend
 */
formLogin.addEventListener("submit", async (event) => {
    event.preventDefault();
    const login = {
        email: inputEmail.value,
        password: inputPassword.value,
    };

    const jsonLogin = JSON.stringify(login);


    try {
        const responseLogin = await fetch('http://localhost:5678/api/users/login', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: jsonLogin
        });

        const jsonResponse = await responseLogin.json();
        errorMessage.innerText = "";

        if (!responseLogin.ok) {

            if(responseLogin.status === 401) {
                errorMessage.innerText = "Login/mot de passe incorrect";
                return;
            }
            if(responseLogin.status === 404){
                errorMessage.innerText = "Cet e-mail est inconnu";
                return;
            }

            errorMessage.innerText = "Erreur non connu";
            return;
        }
        window.localStorage.setItem("token", jsonResponse.token);
        window.location.href = "index.html";

    }
    catch (error) {
        console.log(error);
    }

})