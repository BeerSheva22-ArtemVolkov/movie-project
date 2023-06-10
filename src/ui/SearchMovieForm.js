export default class SearchMovieForm {

    #parentElement;

    constructor(parentID) {
        this.#parentElement = document.getElementById(parentID);
    }

    show(index, parentID) {
        // document.getElementById(parentID).classList.add('BLURE');
        this.#parentElement.style.display = "block";
    }

    hide(parentID) {
        // document.getElementById(parentID).classList.remove('BLURE');
        this.#parentElement.style.display = "none";
    }

    fillForm() {
        this.#parentElement.innerHTML = `<div>
                                            <input id="movieToSearch" type="text">
                                        </div>
                                        <div>
                                            </input><button id="startSearchBtn">Submit</button>
                                        </div>`
    }

    addEventListener(fn){
        document.getElementById('startSearchBtn').addEventListener("click", async ()=>{
            const movieName = document.getElementById('movieToSearch').value;
            await fn(movieName)
        })
    }
}
