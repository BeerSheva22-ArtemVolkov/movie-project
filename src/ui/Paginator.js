import config from "../config/config.json" assert {type: 'json'}

export default class Paginator {

    #parentElement;
    #activePage;
    #totalPages;
    #callbackFn

    constructor(parentID) {
        this.#parentElement = document.getElementById(parentID);
        this.#activePage = 1;
    }

    fillForm(activePage, totalPages) {
        this.#activePage = activePage;
        if (totalPages != undefined){
            this.#totalPages = totalPages;
        }
        this.#parentElement.innerHTML = `<div id="prev-page" class="paginator-item">prev</div>
        ${this.#fillMiddlePart()}
        <div id="next-page" class="paginator-item">next</div>`;
    }

    #fillMiddlePart() {
        return `${this.#activePage == 1 ? '' : `<div class="paginator-item">1</div>`}
                ${`${this.#buildPrev()}<div id="active-page" class="paginator-item">${this.#activePage}</div>${this.#buildNext()}`}
                ${this.#activePage == this.#totalPages ? '' : `<div class="paginator-item">${this.#totalPages}</div>`}`
    }

    #buildPrev() {
        let res = [];
        let count = 0;
        let i = this.#activePage - 1;
        while (i > 1 && count < config.sidePagesCount) {
            res.push(`<div class="paginator-item">${i--}</div>`);
            count++;
        }
        if (i > 1) {
            res.push('<div>...</div>');
        }
        return res.reverse().map(x => x).join('');
    }

    #buildNext() {
        let res = '';
        let count = 0;
        let i = this.#activePage;
        while (i < this.#totalPages - 1 && count < config.sidePagesCount) {
            res += `<div class="paginator-item">${++i}</div>`
            count++;
        }
        if (i < this.#totalPages - 1) {
            res += '<div>...</div>';
        }
        return res;
    }

    getActive() {
        return this.#activePage;
    }

    getTotal() {
        return this.#totalPages;
    }

    #addListeners() {
        this.#parentElement.childNodes.forEach((row, index) => {
            row.addEventListener("click", this.#handler.bind(this, row.innerHTML))
        })
    }

    async #handler(index) {
        await this.#callbackFn(index);
    }

    addHandler(handler) {
        this.#callbackFn = handler;
        this.#addListeners();
    }
}
