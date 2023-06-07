const mainURL = 'https://api.themoviedb.org/3/movie/';
const imageURL = 'https://image.tmdb.org/t/p/w500/';
const language = 'ru';
const apiKey = '2c46288716a18fb7aadcc2a801f3fc6b';
const genresURL = 'https://api.themoviedb.org/3/genre/movie/list?'

export default class MoviesService {

    #movies;
    #pages;
    #callbackFn;
    #genresArray;
    #categoriesArray;
    #activeCategory;
    #activeGenres;

    constructor(handler, categories){
        this.#callbackFn = handler;
        this.#categoriesArray = categories;
        this.#movies = {};
        this.#getGenres();
    }

    async getMoviesData(pageNum, category, genres){
        if (category == undefined && this.#activeCategory == undefined){
            category = this.#categoriesArray[0].type;
        }
        if (genres == undefined){
            genres = this.#activeGenres;
        }

        const URL = `   ${mainURL}${category == undefined ? this.#activeCategory : category}?language=${language}-${language.toUpperCase()}${pageNum == undefined ? '' : `&page=${pageNum}`}${genres == undefined ? this.#activeGenres == undefined ? '' : this.#activeGenres : `&with_genres=${genres.replace(',','|')}`}&api_key=${apiKey}`;
        const response = await fetch(URL);
        const data = await response.json();

        if (category != undefined){
            this.#activeCategory = category;
        }
        if (genres != undefined){
            this.#activeGenres = genres;
        }
        
        data.imageURL = imageURL;
        return data;
    }

    async #getGenres(){
        const response = await fetch(`${genresURL}language=${language}&api_key=${apiKey}`)
        const genresObj = await response.json();
        this.#genresArray = genresObj.genres;
        return genresObj.genres;
    }

    async getGenres(){
        return await this.#getGenres();
    }
}

