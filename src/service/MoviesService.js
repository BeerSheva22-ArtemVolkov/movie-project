const mainURL = 'https://api.themoviedb.org/3/movie/';
const imageURL = 'https://image.tmdb.org/t/p/w500/';
const language = 'ru';
const apiKey = '2c46288716a18fb7aadcc2a801f3fc6b';
const genresURL = 'https://api.themoviedb.org/3/genre/movie/list?'
const searchMovieURL = 'https://api.themoviedb.org/3/search/movie?'

export default class MoviesService {

    #categoriesArray;
    #activeCategory;
    #activeGenres;

    constructor(categories) {
        this.#categoriesArray = categories;
        this.#getGenres();
    }

    async getMoviesData(pageNum, category, genres) {
        if (category == undefined && this.#activeCategory == undefined) {
            category = this.#categoriesArray[0].type;
        }
        if (genres == undefined) {
            genres = this.#activeGenres;
        }
        const URL = `${mainURL}${category == undefined ? this.#activeCategory : category}?language=${language}-${language.toUpperCase()}${pageNum == undefined ? '' : `&page=${pageNum}`}${genres == undefined ? this.#activeGenres == undefined ? '' : this.#activeGenres : `&with_genres=${genres.replace(',', '|')}`}&api_key=${apiKey}`;
        const response = await fetch(URL);
        const data = await response.json();

        if (data.success !== false) {
            if (category != undefined) {
                this.#activeCategory = category;
            }
            if (genres != undefined) {
                this.#activeGenres = genres;
            }

            data.imageURL = imageURL;

        }
        return data;

    }

    async #getGenres() {
        const response = await fetch(`${genresURL}language=${language}&api_key=${apiKey}`)
        const genresObj = await response.json();
        return genresObj.genres;
    }

    async getGenres() {
        return await this.#getGenres();
    }

    async getMoviesFromArray(user, type) {
        const movies = [];
        for (const movieID of user[type]) {
            const movie = await this.#getMovieByID(movieID);
            movie.genre_ids = movie.genres.map(genre => genre.id);
            movies.push(movie);
        }
        return { results: movies, imageURL: imageURL };
    }

    async #getMovieByID(movieID) {
        const response = await fetch(`${mainURL}${movieID}?language=${language}-${language.toUpperCase()}&api_key=${apiKey}`);
        const movie = await response.json();
        return movie;
    }

    async getMoviesByName(movieName) {
        const response = await fetch(`${searchMovieURL}query=${movieName}&language=${language}-${language.toUpperCase()}&api_key=${apiKey}`);
        const movie = await response.json();
        movie.imageURL = imageURL;
        return movie;
    }

}

