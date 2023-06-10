const ACTIVE = "active";

export default class ApplicationBar {

    #Buttons;
    #sectionElements;
    #activeIndex;
    #callbackFn;

    constructor(parentId, sections, handler) {
        this.#callbackFn = handler;
        this.#fillButtons(parentId, sections.map(s => s.title + "_" + s.buttonID));
        this.#setSectionsElements(sections.map(s => s.id));
        this.#addListeners();
    }

    #fillButtons(parentId, titles) {
        const parentElement = document.getElementById(parentId);
        parentElement.innerHTML = titles.map(t => `<button class="menu-button" title="${t.split("_")[0]}"id="${t.split("_")[1]}" style="background-image: url(img/${t.split("_")[1]}-icon.png)"></button>`).join('');
        parentElement.innerHTML += '<div id="active-user-container"></div>';
        this.#Buttons = parentElement.getElementsByClassName("menu-button");
    }

    #setSectionsElements(sectionIds) {
        this.#sectionElements = sectionIds.map(id => document.getElementById(id));
    }

    #addListeners() {
        Array.from(this.#Buttons).forEach((button, index) => {
            button.addEventListener("click", this.#handler.bind(this, index))
        })
    }

    async #handler(index) {
        if (this.#activeIndex == undefined || index != this.#activeIndex) {
            
            if (this.#activeIndex != undefined) {
                this.#Buttons[this.#activeIndex].classList.remove(ACTIVE);
                this.#sectionElements[this.#activeIndex].hidden = true;
            }

            await this.#callbackFn(index);

            this.#sectionElements[index].hidden = false;
            this.#Buttons[index].classList.add(ACTIVE);
            this.#activeIndex = index;
        }

    }

    getActiveIndex() {
        return this.#activeIndex;
    }

    setActiveIndex(index) {
        const indexToCall = index != undefined ? index : this.#activeIndex;
        this.#handler(indexToCall)
    }

    hideButtons(buttonArray) {
        buttonArray.forEach(b => {
            this.#Buttons[b].style.display = 'none';
        })
    }

    showButtons(buttonArray) {
        buttonArray.forEach(b => {
            this.#Buttons[b].style.display = 'inline-block';
        })
    }

    setActiveUser(user){
        document.getElementById("active-user-container").innerHTML = `<a>${user.username ? `Welcome, ${user.username}` : ''}</a>`
    }
}