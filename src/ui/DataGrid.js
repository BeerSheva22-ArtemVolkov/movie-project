const selectColor = "black";

export default class DataGrid {

    #tBodyElement;
    #keys;
    #callbackFn;
    #parentID;

    constructor(parentID) {
        this.#parentID = parentID;
        this.#tBodyElement = document.getElementById(parentID);
        // this.#keys = columns.map(column => column.field);
        // this.#buildTable(parentID, columns.map(c => c.headerName));
    }

    async fillData(dataArray, user) {
        this.#tBodyElement.innerHTML = dataArray.results.map(movie => {
            return `<div class="movie-item" movie-description="${movie.overview}" genre-ids="${movie.genre_ids.reduce((g1, g2) => `${g1}, ${g2}`)}" movie-backdrop="${dataArray.imageURL + movie.backdrop_path}" movie-name="${movie.title}" movie-rating="${movie.vote_average}" movie-count="${movie.vote_count}">
                        <div class="buttons-container">
                            <button class="like-btn ${user == undefined ? '' : this.#switchButton(user.favorites, movie.id)}" movie-id=${movie.id} ${user == undefined ? 'disabled' : ''}></button>
                            <button class="watch-btn ${user == undefined ? '' : this.#switchButton(user.watchlist, movie.id)}" movie-id=${movie.id} ${user == undefined ? 'disabled' : ''}></button>
                        </div>
                        <div class="movie-item-info">
                            <img src="${dataArray.imageURL + movie.poster_path}">
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