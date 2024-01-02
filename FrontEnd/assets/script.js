//variables

const divGallery = document.querySelector(".gallery");
const divFilters = document.querySelector(".filters");
const divModalGallery = document.querySelector(".modal-photos");

const linkModalGallery = document.querySelector('.js-modal-gallery');
const linkModalAddWork = document.querySelector('.js-modal-add-work');

const urlCategories = "http://localhost:5678/api/categories";
const urlWorks = "http://localhost:5678/api/works";

console.log(divGallery);

let dataWorks = null;
let dataCategories = null;

let modalGallery = null;
let modalAddWork = null;



displayFilters();
displayWorks();
addListenerAddWork();


// Section Mes projets

async function getFetch(url){
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

function createDivWorks(works) {
    let divWork =``;

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

async function displayFilters() {
    dataCategories = await getFetch(urlCategories);
    divFilters.innerHTML = createDivFilters(dataCategories);
    let filters = document.querySelectorAll(".filter");
    //console.log(filters);

    for(const element of filters){
        element.addEventListener("click", (event) => {
            displayFilteredWorks(event);
        } )
    }

    createSelectCategories(dataCategories);

}

async function displayFilteredWorks(event){
    //console.log(event.target);
    //console.log(event.target.getAttribute("categoryid"));
    
    let filters = document.querySelectorAll(".filter");
    for(const element of filters){
        element.classList.remove("filter_selected");
    }
    event.target.classList.add("filter_selected");

    if(event.target.getAttribute("categoryid").toString() === "0"){
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

function openModalGallery(e){
    e.preventDefault();
    displayModalWorks();
    const target = document.querySelector(e.currentTarget.getAttribute('href'));
    target.classList.remove("modal-not-displayed");
    target.classList.add("modal-displayed");
    target.removeAttribute('aria-hidden');
    target.setAttribute('aria-modal', 'true');

    

    modalGallery = target;
    modalGallery.addEventListener('click', (event) => closeModalGallery(event));
    modalGallery.querySelector('.js-closing-cross').addEventListener('click', (event) => closeModalGallery(event));
    modalGallery.querySelector('.js-modal-stop').addEventListener('click', (event) => stopPropagation(event));
}


function closeModalGallery(e){
    if(modalGallery === null) return;
    e.preventDefault();
    modalGallery.classList.remove("modal-displayed");
    modalGallery.classList.add("modal-not-displayed");

    modalGallery.removeAttribute('aria-modal');
    modalGallery.setAttribute('aria-hidden', 'true');

    modalGallery.removeEventListener('click', (event) => closeModalGallery(event));
    modalGallery.querySelector('.js-closing-cross').removeEventListener('click', (event) => closeModalGallery(event));
    modalGallery.querySelector('.js-modal-stop').removeEventListener('click', (event) => stopPropagation(event));
    
    modalGallery = null;
}

function stopPropagation(e){
     e.stopPropagation();
}

window.addEventListener('keydown', function(e) {
    if(e.key === "Escape" || e.key === "Esc"){
        closeModalGallery(e);
        //closeModalAddWork(e);
    }
})


function createDivModalWorks(works) {
    let divModalWork =``;

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
        element.addEventListener('click',(event) => deleteWork(event))
    });
}

async function deleteWork(e){

    const deleteResponse = await fetch('http://localhost:5678/api/works/' + e.target.getAttribute("trashid"), {
            method: "DELETE",
            headers: { Authorization: `Bearer ${window.localStorage.getItem("token")}`  },
        });

    console.log("http://localhost:5678/api/works/" + e.target.getAttribute("trashid"));

    if (!deleteResponse.ok) {

        if(deleteResponse.status === 401) {
            console.log("Not Authorized");
            return;
        }
        if(deleteResponse.status === 500){
            console.log("Unexpected Behaviour");
            return;
        }

        console.log("Erreur non connu")
        return;
    }

    displayModalWorks();
    displayWorks();
}

/** modal add work */

const pu = document.getElementById("photo_upload")
const imagePreview = document.getElementById("imagePreview")

const divLabel =  document.querySelectorAll(".lbl_photo_upload span, .lbl_photo_upload i")
let prewiewDisplayed = false;


/**Display preview */

pu.onchange = evt => {
    const [file] = pu.files
    if (file) {
        
        divLabel.forEach(element => element.style.display = "none")
        imagePreview.classList.remove("not_displayed")
        imagePreview.src = URL.createObjectURL(file)

        prewiewDisplayed = true;
    }
}


function openModalAddWork(e){
    e.preventDefault();
    displayModalAddWork();
    const target = document.querySelector(e.currentTarget.getAttribute('href'));

    

    
    target.classList.remove("modal-not-displayed");
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


function closeModalAddWork(e){
    if(modalAddWork === null) return;
    e.preventDefault();
    modalAddWork.classList.remove("modal-displayed");
    modalAddWork.classList.add("modal-not-displayed");

    modalAddWork.removeAttribute('aria-modal');
    modalAddWork.setAttribute('aria-hidden', 'true');

    modalAddWork.removeEventListener('click', (event) => closeModalAddWork(event));
    modalAddWork.querySelector('.js-closing-cross').removeEventListener('click', (event) => closeModalAddWork(event));
    modalAddWork.querySelector('.js-modal-stop').removeEventListener('click', (event) => stopPropagation(event));
    modalAddWork.querySelector('.js-return').removeEventListener('click', (event) => {
        closeModalAddWork(event);
        openModalGallery(event);
    })
    
    const form = modalAddWork.querySelector(".form_add-work");
    form.reset();

    //clean form add work

    if(prewiewDisplayed){
        divLabel.forEach(element => element.style.display = "inherit")
        imagePreview.classList.add("not_displayed")
        imagePreview.src = "#"
        prewiewDisplayed = false;
    }
    modalAddWork = null;
}





async function displayModalAddWork() {
    let dataCategories = await getFetch(urlCategories);

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

function addListenerAddWork(){
    const formAddWork = document.querySelector(".form_add-work");
    formAddWork.addEventListener("submit", async function (event) {
        event.preventDefault();

        const formData = new FormData(formAddWork);

        //console.log(formData);

        const resAddWork = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: { Authorization: `Bearer ${window.localStorage.getItem("token")}`},
            body: formData,
        });

        if (!resAddWork.ok) {

            if(resAddWork.status === 400) {
                console.log("Bad Request");
                return;
            }
            if(resAddWork.status === 401) {
                console.log("Unauthorized");
                return;
            }
            if(resAddWork.status === 500){
                console.log("Unexpected Behaviour");
                return;
            }

            console.log("Erreur non connu")
            return;
        }

        console.log("Created");
        displayWorks();
    })
}


