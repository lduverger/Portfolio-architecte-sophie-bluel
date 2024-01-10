//variables

const divGallery = document.querySelector(".gallery");
const divFilters = document.querySelector(".filters");
const divModalGallery = document.querySelector(".modal-photos");
const editMode = document.querySelector(".edit-mode");
const btnAddWork = document.getElementById("button-add");

const linkModalGallery = document.querySelector('.js-modal-gallery');
const linkModalAddWork = document.querySelector('.js-modal-add-work');
const linkLogin = document.getElementById("login");

const urlCategories = "http://localhost:5678/api/categories";
const urlWorks = "http://localhost:5678/api/works";

//console.log(divGallery);

const messageDelete = document.querySelector(".modal-delete-message");
const messageAddWork = document.querySelector(".modal-add-message");

let dataWorks = null;
let dataCategories = null;

let modalGallery = null;
let modalAddWork = null;


disabledButton();
displayFilters();
displayWorks();
addListenerAddWork();
if (window.localStorage.getItem("token")) {
    const decode = JSON.parse(atob(window.localStorage.getItem("token").split('.')[1]));
    if (decode.exp * 1000 < new Date().getTime()) {
        logout();
        console.log('Time Expired');
    }
    else {
        isLogged();
    }
}

/**
 * display the page as a logged user
 */
function isLogged() {
    linkLogin.innerText = "logout";
    linkLogin.href = "index.html";
    divFilters.classList.add("not_displayed");
    linkModalGallery.classList.remove("not_displayed");
    editMode.classList.remove("not_displayed");

    linkLogin.addEventListener("click", (event) => {
        event.preventDefault();
        logout();
    })
}


/**
 * Hide edit functionnalities 
 */
function logout() {
    window.localStorage.removeItem("token");
    linkLogin.innerText = "login";
    linkLogin.href = "login.html";
    divFilters.classList.remove("not_displayed");
    linkModalGallery.classList.add("not_displayed");
    editMode.classList.add("not_displayed");
    window.location.href = "index.html";

    linkLogin.removeEventListener("click", (event) => {
        event.preventDefault();
        logout();
    })
}

// Section Mes projets


/**
 * 
 * @param {api} url 
 * @returns data of fetch 
 */
async function getFetch(url) {
    try {
        const response = await fetch(url);
        const datas = await response.json();

        if (!response.ok) {
            console.log(datas.description);
            return;
        }

        console.log(datas);

        return datas;
    }
    catch (error) {
        console.log(error);
    }
}

/**
 * 
 * @param filters data of filters(names of filters) 
 * @returns html block for display filters
 */
function createDivFilters(filters) {

    let divFilter = `<div class="filter filter_selected" categoryid="0">Tous</div>
    `;

    for (const element of filters) {
        //console.log(element.name)
        divFilter += `
        <div class="filter" categoryid="${element.id}">${element.name}</div>
        `;
    }
    //console.log(divFilter);
    return divFilter;
}

/**
 * 
 * @param works data of works 
 * @returns  html block for display works
 */
function createDivWorks(works) {
    let divWork = ``;

    for (const element of works) {
        //console.log(element)
        divWork += `
        <figure>
            <img src="${element.imageUrl}" alt="${element.title}">
            <figcaption>${element.title}</figcaption>
        </figure>
        `;
    }

    //console.log(divWork);

    return divWork;
}

async function displayWorks() {
    dataWorks = await getFetch(urlWorks);
    divGallery.innerHTML = createDivWorks(dataWorks);
}

/**
 * display filters and create event listener on each filter
 * create list for the select in the modal add work
 */
async function displayFilters() {
    dataCategories = await getFetch(urlCategories);
    divFilters.innerHTML = createDivFilters(dataCategories);
    let filters = document.querySelectorAll(".filter");
    //console.log(filters);

    for (const element of filters) {
        element.addEventListener("click", (event) => {
            displayFilteredWorks(event);
        })
    }

    createSelectCategories(dataCategories);

}

async function displayFilteredWorks(event) {

    let filters = document.querySelectorAll(".filter");
    for (const element of filters) {
        element.classList.remove("filter_selected");
    }
    event.target.classList.add("filter_selected");

    if (event.target.getAttribute("categoryid").toString() === "0") {
        divGallery.innerHTML = createDivWorks(dataWorks);
        return;
    }

    const filteredWorks = dataWorks.filter((work) => work.categoryId.toString() === event.target.getAttribute("categoryid"))
    console.log(filteredWorks);
    divGallery.innerHTML = createDivWorks(filteredWorks);
}





/*** modal part */

linkModalGallery.addEventListener('click', (event) => openModalGallery(event));
linkModalAddWork.addEventListener('click', (event) => {
    openModalAddWork(event);
    closeModalGallery(event);
});

function openModalGallery(e) {
    console.log("target = ", e.target);
    e.preventDefault();
    displayModalWorks();
    const target = document.querySelector(e.currentTarget.getAttribute('href'));
    target.classList.remove("not_displayed");
    target.classList.add("modal-displayed");
    target.removeAttribute('aria-hidden');
    target.setAttribute('aria-modal', 'true');

    modalGallery = target;
    modalGallery.addEventListener('click', (event) => closeModalGallery(event));
    modalGallery.querySelector('.js-closing-cross').addEventListener('click', (event) => closeModalGallery(event));
    modalGallery.querySelector('.js-modal-stop').addEventListener('click', (event) => stopPropagation(event));
}


function closeModalGallery(e) {
    if (modalGallery === null) return;
    e.preventDefault();
    modalGallery.classList.remove("modal-displayed");
    modalGallery.classList.add("not_displayed");

    modalGallery.removeAttribute('aria-modal');
    modalGallery.setAttribute('aria-hidden', 'true');

    modalGallery.removeEventListener('click', (event) => closeModalGallery(event));
    modalGallery.querySelector('.js-closing-cross').removeEventListener('click', (event) => closeModalGallery(event));
    modalGallery.querySelector('.js-modal-stop').removeEventListener('click', (event) => stopPropagation(event));

    modalGallery = null;
}

function stopPropagation(e) {
    e.stopPropagation();
}

window.addEventListener('keydown', function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModalGallery(e);
        closeModalAddWork(e);
    }
})


function createDivModalWorks(works) {
    let divModalWork = ``;

    for (const element of works) {
        //console.log(element)
        divModalWork += `
        <figure>
            <img src="${element.imageUrl}" alt="${element.title}"}>
            <i class="fa-solid fa-trash-can" trashid="${element.id}"></i>
        </figure>
        `;
    }

    //console.log(divWork);

    return divModalWork;
}


async function displayModalWorks() {
    let dataModalWorks = await getFetch(urlWorks);
    divModalGallery.innerHTML = createDivModalWorks(dataModalWorks);

    let trashs = divModalGallery.querySelectorAll(".fa-trash-can");
    console.log(trashs);
    modalGallery.querySelectorAll('.fa-trash-can').forEach(element => {
        element.addEventListener('click', (event) => deleteWork(event))
    });
}

async function deleteWork(e) {

    messageDelete.innerText = "";
    messageDelete.classList.remove("error-message");
    messageDelete.classList.remove("success-message");

    const deleteResponse = await fetch('http://localhost:5678/api/works/' + e.target.getAttribute("trashid"), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${window.localStorage.getItem("token")}` },
    });

    console.log("http://localhost:5678/api/works/" + e.target.getAttribute("trashid"));

    if (!deleteResponse.ok) {

        messageDelete.classList.add("error-message");

        if (deleteResponse.status === 401) {
            messageDelete.innerText = "Veuillez vous connecter";
            console.log("Not Authorized");
            return;
        }
        if (deleteResponse.status === 500) {
            messageDelete.innerText = "Suppression non autorisée";
            console.log("Unexpected Behaviour");
            return;
        }

        messageDelete.innerText = "Erreur non connu";
        console.log("Erreur non connu")
        return;
    }


    messageDelete.classList.add("success-message");
    messageDelete.innerText = "Suppression ok";

    displayModalWorks();
    displayWorks();
}

/** modal add work */

const pu = document.getElementById("photo_upload")
const imagePreview = document.getElementById("imagePreview")

const divLabel = document.querySelectorAll(".lbl_photo_upload span, .lbl_photo_upload i")
let prewiewDisplayed = false;


/**For display preview */

pu.onchange = evt => {
    const [file] = pu.files
    if (file) {

        divLabel.forEach(element => element.style.display = "none")
        imagePreview.classList.remove("not_displayed")
        imagePreview.src = URL.createObjectURL(file)

        prewiewDisplayed = true;
    }
}


function openModalAddWork(e) {
    e.preventDefault();
    const target = document.querySelector(e.currentTarget.getAttribute('href'));

    target.classList.remove("not_displayed");
    target.classList.add("modal-displayed");
    target.removeAttribute('aria-hidden');
    target.setAttribute('aria-modal', 'true');

    modalAddWork = target;
    modalAddWork.addEventListener('click', (event) => closeModalAddWork(event));
    modalAddWork.querySelector('.js-closing-cross').addEventListener('click', (event) => closeModalAddWork(event));
    modalAddWork.querySelector('.js-modal-stop').addEventListener('click', (event) => stopPropagation(event));
    modalAddWork.querySelector('.js-return').addEventListener('click', (event) => {
        closeModalAddWork(event);
        openModalGallery(event);
    })

}


function closeModalAddWork(e) {
    if (modalAddWork === null) return;
    e.preventDefault();
    modalAddWork.classList.remove("modal-displayed");
    modalAddWork.classList.add("not_displayed");

    modalAddWork.removeAttribute('aria-modal');
    modalAddWork.setAttribute('aria-hidden', 'true');

    modalAddWork.removeEventListener('click', (event) => closeModalAddWork(event));
    modalAddWork.querySelector('.js-closing-cross').removeEventListener('click', (event) => closeModalAddWork(event));
    modalAddWork.querySelector('.js-modal-stop').removeEventListener('click', (event) => stopPropagation(event));
    modalAddWork.querySelector('.js-return').removeEventListener('click', (event) => {
        closeModalAddWork(event);
        openModalGallery(event);
    })

    const form = modalAddWork.querySelector(".form-add-work");
    form.reset();

    //clean form add work

    if (prewiewDisplayed) {
        divLabel.forEach(element => element.style.display = "inherit")
        imagePreview.classList.add("not_displayed")
        imagePreview.src = "#"
        prewiewDisplayed = false;
    }
    modalAddWork = null;
}

function createSelectCategories(Categories) {

    const select = document.getElementById("select_categories")
    const defaultOption = document.createElement("option");
    defaultOption.value = "0";
    defaultOption.textContent = "Sélectionner une catégorie:";
    select.appendChild(defaultOption);

    for (const element of Categories) {
        const option = document.createElement("option");
        option.value = element.id;
        option.textContent = element.name;
        select.appendChild(option);
    }
}

let image;

function addListenerAddWork() {
    const formAddWork = document.querySelector(".form-add-work");
    formAddWork.addEventListener("submit", async function (event) {
        event.preventDefault();
        messageAddWork.innerText = "";
        messageAddWork.classList.remove("error-message");

        const formData = new FormData(formAddWork);

        console.log(formData);

        const resAddWork = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: { Authorization: `Bearer ${window.localStorage.getItem("token")}` },
            body: formData,
        });

        if (!resAddWork.ok) {
            messageAddWork.classList.add("error-message");

            if (resAddWork.status === 400) {
                messageAddWork.innerText = "Bad Request";
                console.log("Bad Request");
                return;
            }
            if (resAddWork.status === 401) {
                messageAddWork.innerText = "Non autorisé";
                console.log("Unauthorized");
                return;
            }
            if (resAddWork.status === 500) {
                messageAddWork.innerText = "Unexpected Behaviour";
                console.log("Unexpected Behaviour");
                return;
            }

            messageAddWork.innerText = "Erreur non connu";
            console.log("Erreur non connu")
            return;
        }

        console.log("Created");
        closeModalAddWork(event);
        linkModalGallery.click();
        displayWorks();
        disabledButton();
    })

    formAddWork.addEventListener("change", () => {
        const formData = new FormData(formAddWork);

        image = formData.get("image");
        const title = formData.get("title");
        const category = formData.get("category");


        console.log(image);
        console.log(title);
        console.log(category);

        if(image.name == "" || title == "" || category == "0"){
            disabledButton();
        }
        else{
            btnAddWork.removeAttribute('disabled');
            btnAddWork.style.removeProperty("background-color");
        }


        // if(formData.get("image"))
        // for (const value of formData) {
        //     console.log("value =" ,value);

        //     if(value == null){
        //         console.log("pas de valeur");
        //     }
        // }
    });
}

function disabledButton(){
    btnAddWork.setAttribute('disabled', '');
    btnAddWork.style.backgroundColor = "gray"
}


