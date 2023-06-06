export default class DetailsMovieForm {

    #parentElement;
    #activeIndex;

    constructor(parentID) {
        const parentElement = document.getElementById(parentID);
        this.#parentElement = parentElement;
        this.#fillForm();
    }

    show(index) {
        this.#parentElement.style.display = "block";
        this.#activeIndex = index;
    }

    hide() {
        this.#parentElement.style.display = "none";
        this.#activeIndex = undefined;
    }

    getActiveIndex() {
        return this.#activeIndex;
    }

    #fillForm() {
        const headDiv = document.createElement('div');
        const detailsDiv = document.createElement('div');
        const overviewDiv = document.createElement('div');

        const nameDiv = document.createElement('div');
        const nameA = document.createElement('a');
        nameDiv.appendChild(nameA);
        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'buttons-container';
        const likeBtn = document.createElement('button');
        likeBtn.className = 'like-btn';
        const watchBtn = document.createElement('button');
        watchBtn.className = 'watch-btn';
        buttonsDiv.appendChild(likeBtn)
        buttonsDiv.appendChild(watchBtn)
        headDiv.appendChild(nameDiv);
        headDiv.appendChild(buttonsDiv);

        const imgDiv = document.createElement('div');
        const img = document.createElement('img');
        imgDiv.appendChild(img);
        const aboutDiv = document.createElement('div');
        const raitingA = document.createElement('a');
        const genresA = document.createElement('a');
        const raitingCountA = document.createElement('a');
        aboutDiv.appendChild(raitingA);
        aboutDiv.appendChild(genresA);
        aboutDiv.appendChild(raitingCountA);
        detailsDiv.appendChild(imgDiv);
        detailsDiv.appendChild(aboutDiv);

        const descriptionA = document.createElement('a');
        overviewDiv.appendChild(descriptionA);

        this.#parentElement.appendChild(headDiv);
        this.#parentElement.appendChild(detailsDiv);
        this.#parentElement.appendChild(overviewDiv);
    }

    fillDetailsSection(index) {
        const movieItem = document.getElementsByClassName('movie-item')[index];
        console.log(movieItem);
        
        // div с названием и кнопками 

    }
}
