import moviesConfig from "../config/moviesConfig.json" assert {type: 'json'}

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
        const URL = `${moviesConfig.mainURL}${category == undefined ? this.#activeCategory : category}?language=${moviesConfig.language}-${moviesConfig.language.toUpperCase()}${pageNum == undefined ? '' : `&page=${pageNum}`}${genres == undefined ? this.#activeGenres == undefined ? '' : this.#activeGenres : `&with_genres=${genres.replace(',', '|')}`}&api_key=${moviesConfig.apiKey}`;
        const response = await fetch(URL);
        const data = await response.json();

        if (data.success !== false) {
            if (category != undefined) {
                this.#activeCategory = category;
            }
            if (genres != undefined) {
                this.#activeGenres = genres;
            }

            data.imageURL = moviesConfig.imageURL;

        }
        return data;

    }

    async #getGenres() {
        const response = await fetch(`${moviesConfig.genresURL}language=${moviesConfig.language}&api_key=${moviesConfig.apiKey}`)
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
        return { results: movies, imageURL: moviesConfig.imageURL };
    }

    async #getMovieByID(movieID) {
        const response = await fetch(`${moviesConfig.mainURL}${movieID}?language=${moviesConfig.language}-${moviesConfig.language.toUpperCase()}&api_key=${moviesConfig.apiKey}`);
        const movie = await response.json();
        return movie;
    }

    async getMoviesByName(movieName) {
        const response = await fetch(`${moviesConfig.searchMovieURL}query=${movieName}&language=${moviesConfig.language}-${moviesConfig.language.toUpperCase()}&api_key=${moviesConfig.apiKey}`);
        const movie = await response.json();
        movie.imageURL = moviesConfig.imageURL;
        return movie;
    }

}

