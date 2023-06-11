export default class Spinner {

    #newDiv

    constructor() {
        this.#newDiv = document.createElement("div");
    }

    start(parentID) {
        this.#newDiv.classList.add("loader");
        document.getElementById(parentID).appendChild(this.#newDiv);
    }

    stop(parentID) {
        document.getElementById(parentID).removeChild(this.#newDiv);
    }
}