import imagesConfig from "../config/imagesConfig.json" assert {type: 'json'}

export default class DetailsMovieForm {

    #activeIndex;

    show(index, parentID) {
        document.getElementById(parentID).classList.add('BLURE');
        document.getElementById(parentID + '-details').style.display = "block";
        this.#activeIndex = index;
    }

    hide(parentID) {
        document.getElementById(parentID).classList.remove('BLURE');
        document.getElementById(parentID + '-details').style.display = "none";
        this.#activeIndex = undefined;
    }

    getActiveIndex() {
        return this.#activeIndex;
    }

    fillForm(parentID, index, genres) {
        const movieItem = document.getElementById(parentID).getElementsByClassName('movie-item')[index];
        console.log(movieItem);
        document.getElementById(parentID + '-details').innerHTML = `
            <div id="details-head">
                <div id="details-name">
                    <a id="title-place">${movieItem.getAttribute('movie-name')}</a>
                </div>
                <div>
                    <button id="close-details-button"></button>
                </div>
            </div>
            <div id="details-info">
            <div id="details-buttons-container">${movieItem.getElementsByClassName('buttons-container')[0].innerHTML}</div>
                <div id="details-img">
                    <img id="img-place" src="${movieItem.getAttribute('movie-backdrop') ? movieItem.getAttribute('movie-backdrop') : `${imagesConfig["details-no-image"]}`}">
                </div>
                
            </div>
            <div id="details-overview">
                <table id="details-description">
                    <tbody>
                        <tr>
                            <td>
                                <label>Рейтинг: </label>
                            </td>
                            <td>
                                <a id="raiting-place">${movieItem.getAttribute('movie-rating')}(${movieItem.getAttribute('movie-count')})</a>
                            </td>
                        </tr>
                        <tr>
                            <td style="vertical-align: top;">
                                <label>Жанр: </label>
                            </td>
                            <td>
                                <a id="genres-place">${movieItem.getAttribute('genre-ids') ? movieItem.getAttribute('genre-ids').split(',').map(genre => {
                                    return genres.find(x => x.id == Number(genre)).name;
                                }).join(', ') : ''}</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div>
                    <a id="overview-place">${movieItem.getAttribute('movie-description') ? movieItem.getAttribute('movie-description') : `Описание к фильму отсутствует...`}</a>
                </div>
            </div>`
        const closeButton = document.getElementById(parentID + '-details').querySelector('#close-details-button');
        closeButton.addEventListener("click", this.hide.bind(this, parentID));
        closeButton.style.backgroundImage = `url('${imagesConfig["close-icon"]}')`;
    }

}
