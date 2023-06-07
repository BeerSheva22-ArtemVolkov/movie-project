export default class Filters {

    #parentElement;
    #categories;
    #genres;
    #activeIndex;
    #categoriesCallback;
    #genresCallback
    #expanded;

    constructor(parentID, categories, genres) {
        this.#parentElement = document.getElementById(parentID);
        this.#categories = categories;
        this.#genres = genres;
        this.#activeIndex;
        this.#expanded = false;
    }

    fillToolbar() {
        this.#parentElement.innerHTML = `<div id="filter-categories">${this.#categories.map(category => `<div id="category-${category.name}">${category.title}</div>`).join('')}</div>`
        this.#parentElement.innerHTML +=    `<div id="select-genres">
                                                <div id="expand-dropdown-genres">
                                                    <button>Жанры</button>
                                                </div>
                                                <div id="dropdown-genres">
                                                    <form class="genres-form">
                                                        <div>
                                                            ${this.#genres.map(genre => {
                                                                return `<label for="genre-id-${genre.id}">
                                                                    <input type="checkbox" id="genre-id-${genre.id}" class="genres"/>${genre.name}</label>
                                                                </label>`
                                                            }).join('')}
                                                        </div>
                                                    </form>
                                                </div>
                                                <div id="submit-form">
                                                    <button id="submitBtn" type="submit">Submit</button>
                                                </div>
                                                
                                            </div>`;            
        document.getElementById("expand-dropdown-genres").addEventListener("click", this.#showCheckboxes.bind(this))
    }

    #addCategoriesListeners() {
        document.getElementById("filter-categories").childNodes.forEach((row, index) => {
            console.log(row, index);
            row.addEventListener("click", this.#categoriesHandler.bind(this, row.id, index))
        })
    }

    #addGenresListeners() {
        document.getElementById("submitBtn").addEventListener("click", this.#genresHandler.bind(this, 'str', 1))
    }

    async #categoriesHandler(id, index) {
        await this.#categoriesCallback(id, index);
    }

    async #genresHandler() {
        console.log('here');
        const arr = document.getElementsByClassName("genres");
        const out = Array.from(arr).filter(ar =>{
            if (ar.checked){
                return ar;
            }
        }).map(ar => {
            return ar.id.replace('genre-id-', '');
        }).join(',');
        await this.#genresCallback(out);
    }

    addCategoriesHandler(handler) {
        this.#categoriesCallback = handler;
        this.#addCategoriesListeners();
    }

    addGenresHandler(handler) {
        this.#genresCallback = handler;
        this.#addGenresListeners();
    }

    setActive(categoryName, index) {
        if (this.#activeIndex != index) {
            if (document.getElementById("filter-categories").childNodes[this.#activeIndex]) {
                document.getElementById("filter-categories").childNodes[this.#activeIndex].classList.remove('ACTIVE-CATEGORY');
            }
            document.getElementById("filter-categories").childNodes[index].className = 'ACTIVE-CATEGORY';
            this.#activeIndex = index;
        }

    }

    #showCheckboxes() {
        console.log('called');
        const checkboxes = document.getElementById("dropdown-genres");
        const submitForm = document.getElementById("submit-form");
        if (!this.#expanded) {
            checkboxes.style.display = "block";
            submitForm.style.display = "block";
            this.#expanded = true;
        } else {
            checkboxes.style.display = "none";
            submitForm.style.display = "none";
            this.#expanded = false;
        }
    }
}