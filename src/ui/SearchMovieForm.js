export default class SearchMovieForm {

    #parentElement;

    constructor(parentID) {
        this.#parentElement = document.getElementById(parentID);
    }

    fillForm() {
        this.#parentElement.innerHTML = `<div>
                                            <input id="movieToSearch" type="text">
                                        </div>
                                        <div>
                                            </input><button id="startSearchBtn">Поиск</button>
                                        </div>`
    }

    addHandler(fn){
        document.getElementById('startSearchBtn').addEventListener("click", async ()=>{
            const movieName = document.getElementById('movieToSearch').value;
            await fn(movieName)
        })
    }
}
