//variables

const divGallery = document.querySelector(".gallery");
const divFilters = document.querySelector(".filters");

console.log(divGallery);

let dataWorks = null;
let dataCategories = null;



displayFilters();
displayWorks();


// Section Mes projets

async function getCategories() {
    try {
        const response = await fetch(`http://localhost:5678/api/categories`);
        const categories = await response.json();

        if (!response.ok) {
            console.log(categories.description);
            return;
        }

        console.log(categories);

        return categories;
    }
    catch (error) {
        console.log(error);
    }
}

async function getWorks() {

    try {

        const response = await fetch(`http://localhost:5678/api/works`);
        const works = await response.json();

        if (!response.ok) {
            console.log(works.description);
            return;
        }

        console.log(works);

        return works;
    } catch (error) {
        console.log(error);
    }
}



async function createDivFilters(filters) {

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

async function createDivWorks(works) {
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
    dataWorks = await getWorks();
    divGallery.innerHTML = await createDivWorks(dataWorks);
}

async function displayFilters() {
    dataCategories = await getCategories();
    divFilters.innerHTML = await createDivFilters(dataCategories);
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

    if(event.target.getAttribute("categoryid").toString() == 0){
        divGallery.innerHTML = await createDivWorks(dataWorks);
        return;
    }

    const filteredWorks = dataWorks.filter((work) => work.categoryId.toString() === event.target.getAttribute("categoryid"))
    console.log(filteredWorks);
    divGallery.innerHTML = await createDivWorks(filteredWorks);
}

