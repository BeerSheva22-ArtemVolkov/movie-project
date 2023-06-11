import imagesConfig from "../config/imagesConfig.json" assert {type: 'json'}

export default class DataGrid {

    #tBodyElement;
    #callbackFn;
    #parentID;

    constructor(parentID) {
        this.#parentID = parentID;
        this.#tBodyElement = document.getElementById(parentID);
    }

    async fillData(data, user) {
        if (data.success != false) {
            this.#tBodyElement.innerHTML = data.results.map(movie => {
                return `<div class="movie-item" movie-description="${movie.overview}" genre-ids="${movie.genre_ids.length ? movie.genre_ids.reduce((g1, g2) => `${g1}, ${g2}`) : ''}" movie-backdrop="${movie.backdrop_path ? data.imageURL + movie.backdrop_path : ''}" movie-name="${movie.title}" movie-rating="${movie.vote_average}" movie-count="${movie.vote_count}">
                        <div class="buttons-container">
                            <button class="like-btn ${user == undefined ? '' : this.#switchButton(user.favorites, movie.id)}" movie-id=${movie.id} ${user == undefined ? 'disabled hidden' : ''}></button>
                            <button class="watch-btn ${user == undefined ? '' : this.#switchButton(user.watchlist, movie.id)}" movie-id=${movie.id} ${user == undefined ? 'disabled hidden' : ''}></button>
                        </div>
                        <div class="movie-item-info">
                            <img src="${movie.poster_path ? data.imageURL + movie.poster_path : "./img/no-poster.png"}">
                            <div>
                                <a>${movie.title}</a>
                                <div>${movie.original_title}</div>
                            </div>
                        </div>
                    </div>`
            }).join('')
            Array.from(document.getElementsByClassName("like-btn")).forEach(btn => btn.style.backgroundImage = `url(${imagesConfig["like-icon"]})`);
            Array.from(document.getElementsByClassName("watch-btn")).forEach(btn => btn.style.backgroundImage = `url(${imagesConfig["watch-icon"]})`);
        } else {
            this.#tBodyElement.innerHTML = `<div id="error-data"><a>${data.errors[0]}</a></div>`;
            setTimeout(() => document.getElementById('error-data') ? document.getElementById('error-data').innerHTML = '' : '', 2000)
        }

    }

    #switchButton(array, id) {
        return array.includes(String(id), 0) ? 'selectedBTN' : '';
    }

    addHandler(handler) {
        this.#callbackFn = handler;
        this.#addListeners();
    }

    #addListeners() {
        Array.from(this.#tBodyElement.getElementsByClassName('movie-item-info')).forEach((row, index) => {
            row.addEventListener("click", this.#handler.bind(this, index))
        })
    }

    async #handler(index) {
        await this.#callbackFn(index, this.#parentID);
    }
}