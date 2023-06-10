export default class DataGrid {

    #tBodyElement;
    #keys;
    #callbackFn;
    #parentID;

    constructor(parentID) {
        this.#parentID = parentID;
        this.#tBodyElement = document.getElementById(parentID);
    }

    async fillData(dataArray, user) {
        this.#tBodyElement.innerHTML = dataArray.results.map(movie => {
            return `<div class="movie-item" movie-description="${movie.overview}" genre-ids="${movie.genre_ids.length ? movie.genre_ids.reduce((g1, g2) => `${g1}, ${g2}`) : ''}" movie-backdrop="${movie.backdrop_path ? dataArray.imageURL + movie.backdrop_path : ''}" movie-name="${movie.title}" movie-rating="${movie.vote_average}" movie-count="${movie.vote_count}">
                        <div class="buttons-container">
                            <button class="like-btn ${user == undefined ? '' : this.#switchButton(user.favorites, movie.id)}" movie-id=${movie.id} ${user == undefined ? 'disabled hidden' : ''}></button>
                            <button class="watch-btn ${user == undefined ? '' : this.#switchButton(user.watchlist, movie.id)}" movie-id=${movie.id} ${user == undefined ? 'disabled hidden' : ''}></button>
                        </div>
                        <div class="movie-item-info">
                            <img src="${movie.poster_path ? dataArray.imageURL + movie.poster_path : "./img/no-poster.png"}">
                            <div>
                                <a>${movie.title}</a>
                                <div>${movie.original_title}</div>
                            </div>
                        </div>
                    </div>`
        }).join('')
        Array.from(document.getElementsByClassName("like-btn")).forEach(btn => btn.style.backgroundImage = "url('./img/like-icon.png')");
        Array.from(document.getElementsByClassName("watch-btn")).forEach(btn => btn.style.backgroundImage = "url('./img/watch-icon.png')");
    }

    #switchButton(array, id){
        return array.includes(String(id), 0) ? 'selectedBTN' : '';
    }

    addHandler(handler) {
        this.#callbackFn = handler;
        this.#addListeners();
    }

    #addListeners() {
        this.#tBodyElement.childNodes.forEach((row, index) => {
            row.getElementsByClassName('movie-item-info')[0].addEventListener("click", this.#handler.bind(this, index))
        })
    }

    async #handler(index) {
        await this.#callbackFn(index, this.#parentID);
    }

    async getID(nRow) {
        const indexOfColumn = this.#keys.indexOf('id');
        const ID = +this.#tBodyElement.getElementsByTagName("tr")[nRow].getElementsByTagName("td")[indexOfColumn].innerText;
        return ID;
    }
}