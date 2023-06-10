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
        this.#totalPages = totalPages;
        this.#parentElement.innerHTML = `<div id="prev-page" class="paginator-item">prev</div>
        ${this.#fillMiddlePart()}
        <div id="next-page" class="paginator-item">next</div>`;
    }

    #fillMiddlePart() {
        return `${this.#activePage == 1 ? '' : `<div>1</div><div>...</div>`}
                ${`${this.#buildPrev()}<div id="active-page">${this.#activePage}</div>${this.#buildNext()}`}
                ${this.#activePage == this.#totalPages ? '' : `<div>...</div><div>${this.#totalPages}</div>`}`
    }

    #buildPrev(){
        let res = [];
        let count = 0;
        let i = this.#activePage - 1;
        while (i > 1 && count < 5){
            res.push(`<div>${i--}</div>`);
            count++;
        }
        return res.reverse().map(x => x).join('');
    }

    #buildNext(){
        let res = '';
        let count = 0;
        let i = this.#activePage;
        while (i < this.#totalPages - 1 && count < 5){
            res += `<div>${++i}</div>`
            count++;
        }
        return res;
    }

    // #setActive(){
    //     document.getElementById('active-page').style.backgroundColor = 'blue';
    // }

    getActive(){
        return this.#activePage;
    }

    getTotal(){
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