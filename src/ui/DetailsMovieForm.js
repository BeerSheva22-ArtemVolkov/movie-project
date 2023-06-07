export default class DetailsMovieForm {

    #parentElement;
    #activeIndex;
    #nameA;
    #img;
    #raitingA;
    #genresA;
    #raitingCountA;
    #overviewA;

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
        const infoDiv = document.createElement('div');
        const overviewDiv = document.createElement('div');
        headDiv.setAttribute('id', 'details-head');
        infoDiv.setAttribute('id', 'details-info');
        overviewDiv.setAttribute('id', 'details-overview');

        const nameDiv = document.createElement('div');
        nameDiv.setAttribute('id', 'details-name');
        this.#nameA = document.createElement('a');
        nameDiv.appendChild(this.#nameA);
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
        imgDiv.setAttribute('id', 'details-img');
        this.#img = document.createElement('img');
        imgDiv.appendChild(this.#img);
        const aboutDiv = document.createElement('div');
        aboutDiv.setAttribute('id', 'details-description');
        this.#raitingA = document.createElement('a');
        this.#genresA = document.createElement('a');
        aboutDiv.appendChild(this.#raitingA);
        aboutDiv.appendChild(this.#genresA);
        infoDiv.appendChild(imgDiv);
        infoDiv.appendChild(aboutDiv);

        this.#overviewA = document.createElement('a');
        overviewDiv.appendChild(this.#overviewA);

        this.#parentElement.appendChild(headDiv);
        this.#parentElement.appendChild(infoDiv);
        this.#parentElement.appendChild(overviewDiv);
    }

    fillDetailsSection(index, genres) {
        const movieItem = document.getElementsByClassName('movie-item')[index];
        this.#img.src = movieItem.getAttribute('movie-backdrop')
        this.#nameA.innerHTML = movieItem.getAttribute('movie-name');
        this.#raitingA.innerHTML = `${movieItem.getAttribute('movie-rating')}(${movieItem.getAttribute('movie-count')})`;
        this.#genresA.innerHTML = movieItem.getAttribute('genre-ids').split(',').map(genre => {
            return genres.find(x => x.id == Number(genre)).name;
        }).join(', ');
        this.#raitingCountA;
        this.#overviewA.innerHTML = movieItem.getAttribute('movie-description');
        // div с названием и кнопками 

    }
}
