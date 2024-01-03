const formLogin = document.getElementById("login");
const inputEmail = document.getElementById("email");
const inputPassword = document.getElementById("password")
const errorMessage = document.getElementById("error_message");

// console.log(inputEmail);
// console.log(inputPassword);




formLogin.addEventListener("submit", async (event) => {
    event.preventDefault();
    const login = {
        email: inputEmail.value,
        password: inputPassword.value,
    };

    const jsonLogin = JSON.stringify(login);


    // const responseLogin = fetch('http://localhost:5678/api/users/login', {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: jsonLogin
    // });

    // const tmpLogin = await responseLogin.json();

    // if (!responseLogin.ok) {
    //     console.log(tmpLogin.description);
    //     return;
    // }

    // console.log(responseLogin)



    try {
        const responseLogin = await fetch('http://localhost:5678/api/users/login', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: jsonLogin
        });

        const jsonResponse = await responseLogin.json();
        //console.log(responseLogin.status);

        if (!responseLogin.ok) {

            if(responseLogin.status === 401) {
                errorMessage.innerText = "Not Authorized";
                console.log("Not Authorized");
                return;
            }
            if(responseLogin.status === 404){
                errorMessage.innerText = "User not found";
                console.log("User not found");
                return;
            }

            console.log("Erreur non connu")
            return;
        }

        console.log(jsonResponse.token);
        window.localStorage.setItem("token", jsonResponse.token);
        window.location.href = "index.html";

    }
    catch (error) {
        console.log(error);
    }

})