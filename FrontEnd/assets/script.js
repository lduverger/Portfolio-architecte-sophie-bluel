//variables

const divGallery = document.querySelector(".gallery");

console.log(divGallery);




createGallery();


async function createGallery(){

    try{

        const response = await fetch(`http://localhost:5678/api/works`);
        const works = await response.json();
    
        if(!response.ok){
            console.log(works.description);
            return;
        }

        console.log(works);

        /*for (let i = 0; i < works.length; i++) {
            let div = `
			<figure>
				<img src="${works[i].imageUrl}" alt="${works[i].title}">
				<figcaption>${works[i].title}</figcaption>
			</figure>
            `;

            console.log(div);
            divGallery.innerHTML += div;
        }

        console.log("for ... in")


        for (const proper in works){
            console.log(`${proper}: ${works[proper].title}`);
        }*/

        //console.log("for ... of")

        for (const element of works){
            console.log(element.title)
            let div = `
			<figure>
				<img src="${element.imageUrl}" alt="${element.title}">
				<figcaption>${element.title}</figcaption>
			</figure>
            `;

            divGallery.innerHTML += div;
        }


    }catch(error){
        console.log(error);
    }
}

