//variables

const divGallery = document.querySelector(".gallery");
const divFilters = document.querySelector(".filters");
const divModalGallery = document.querySelector(".modal-photos");

const linkModalGallery = document.querySelector('.js-modal-gallery');

const urlCategories = "http://localhost:5678/api/categories";
const urlWorks = "http://localhost:5678/api/works";


console.log(divGallery);

let dataWorks = null;
let dataCategories = null;

let modalGallery = null;
let modalAddPhoto = null;



displayFilters();
displayWorks();


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

    modalGallery.removeEventListener('click', (event) => closeModal(event));
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


