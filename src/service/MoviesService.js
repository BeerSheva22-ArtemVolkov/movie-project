const popolarURL = 'https://api.themoviedb.org/3/movie/popular?';
const imageURL = 'https://image.tmdb.org/t/p/w500/';
const language = 'ru';
const apiKey = '2c46288716a18fb7aadcc2a801f3fc6b';
const genresURL = 'https://api.themoviedb.org/3/genre/movie/list?'

export default class MoviesService {

    #movies;
    #pages;
    #callbackFn;
    #ganresObj;

    constructor(handler){
        this.#callbackFn = handler;
        this.#movies = {};
        this.#getGanres();
    }

    async getMoviesData(){
        const response = await fetch(`${popolarURL}language=${language}-${language.toUpperCase}&api_key=${apiKey}`);
        const data = await response.json();
        data.imageURL = imageURL;
        return data;
    }

    async #getGanres(){
        const response = await fetch(`${genresURL}language=${language}&api_key=${apiKey}`)
        this.#ganresObj = await response.json();
    }
}

