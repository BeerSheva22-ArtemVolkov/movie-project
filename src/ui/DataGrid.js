const selectColor = "black";
// const imageURL = 'https://image.tmdb.org/t/p/w500/';

export default class DataGrid {

    #tBodyElement;
    #keys;
    #callbackFn;
    #selectedRow;
    #parentID;

    constructor(parentID) {
        this.#parentID = parentID;
        this.#tBodyElement = document.getElementById(parentID);
        // this.#keys = columns.map(column => column.field);
        // this.#buildTable(parentID, columns.map(c => c.headerName));
    }

    async fillData(dataArray) {
        this.#tBodyElement.innerHTML = '';
        dataArray.results.forEach((movie, index) => {
            // Создаем контейнер для всего фильма
            const movieDiv = document.createElement('div');
            movieDiv.className = 'movie-item';
            //Создаем img для фильма
            const imgURL = dataArray.imageURL + movie.poster_path;
            const img = document.createElement('img');
            img.src = imgURL;
            //Контейнер для кнопок
            const buttonsDiv = document.createElement('div'); 
            buttonsDiv.className = 'buttons-container';
            const likeBtn = document.createElement('button');
            likeBtn.className = 'like-btn';
            const watchBtn = document.createElement('button');
            watchBtn.className = 'watch-btn';
            //Вставляем кнопки в контейнер для кнопок
            buttonsDiv.appendChild(likeBtn)
            buttonsDiv.appendChild(watchBtn)
            //Создаем контейнер для мини описания
            const movieInfoDiv = document.createElement('div');
            const movieNameLabel = document.createElement('a');
            movieNameLabel.innerHTML = movie.title;
            const moviedDescDiv = document.createElement('div');
            moviedDescDiv.innerHTML = movie.original_title;
            movieInfoDiv.appendChild(movieNameLabel);
            movieInfoDiv.appendChild(moviedDescDiv);
            //Вставляем созданное
            movieDiv.appendChild(buttonsDiv);
            movieDiv.appendChild(img);
            movieDiv.appendChild(movieInfoDiv);
            movieDiv.setAttribute('movie-description', movie.overview)
            movieDiv.setAttribute('genre-ids', movie.genre_ids.reduce((g1, g2) => `${g1}, ${g2}`))
            movieDiv.setAttribute('movie-backdrop', dataArray.imageURL + movie.backdrop_path)
            movieDiv.setAttribute('movie-name', movie.title)
            movieDiv.setAttribute('movie-rating', movie.vote_average)
            movieDiv.setAttribute('movie-count', movie.vote_count)
            // movieDiv.setAttribute('id', `movie-item-${index}`)
            this.#tBodyElement.appendChild(movieDiv);
        })
        this.#addListeners();
    }

    #getRow(obj) {
        return `<tr>
                   ${this.#keys.map(key => `<td>${obj[key]}</td>`).join('')}
                </tr>`
    }

    addHandler(handler) {
        this.#callbackFn = handler;
        // this.#addListeners();
    }

    selectRow(nRow) {
        if (this.#selectedRow != undefined) {
            this.#deselectRow();
        }
        const element = this.#tBodyElement.getElementsByTagName("tr")[nRow];
        let hasChanged = false;
        if (this.#selectedRow != nRow) {
            if (element.style.backgroundColor != selectColor) {
                element.style.backgroundColor = selectColor;
                hasChanged = true;
            } else {
                element.style.backgroundColor = '';
            }
            this.#selectedRow = nRow;
        } else {
            this.#selectedRow = undefined;
        }

        return hasChanged;
    }

    #deselectRow() {
        this.#tBodyElement.getElementsByTagName("tr")[this.#selectedRow].style.backgroundColor = '';
    }

    insertRow(obj) {
        this.#tBodyElement.innerHTML += this.#getRow(obj);
    }

    deleteRow(nRow) {
        this.#tBodyElement.deleteRow(nRow);
        this.#selectedRow = undefined;
    }

    editRow(obj, nRow) {
        this.#tBodyElement.getElementsByTagName("tr")[nRow].innerHTML = this.#getRow(obj);
    }

    #addListeners() {
        this.#tBodyElement.childNodes.forEach((row, index) => {
            row.addEventListener("click", this.#handler.bind(this, index))
        })
    }

    #buildTableHeader(parentID, columnNames) {
        const tableSectionElement = document.getElementById(parentID);
        tableSectionElement.innerHTML =
            `<table>
            <thead>
                <tr>
                    ${columnNames.map(headerName => `<th>${headerName}</th>`).join('')}
                </tr>
            </thead>
            <tbody id="${parentID}-table"></tbody>
        </table>`
        this.#tBodyElement = document.getElementById(parentID + "-table");
    }

    async #handler(index) {
        await this.#callbackFn(index);
    }

    async getID(nRow) {
        const indexOfColumn = this.#keys.indexOf('id');
        const ID = +this.#tBodyElement.getElementsByTagName("tr")[nRow].getElementsByTagName("td")[indexOfColumn].innerText;
        return ID;
    }
}