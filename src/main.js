// import employeesConfig from "./config/employees-config.json" assert {type: 'json'}
import ApplicationBar from "./ui/ApplicationBar.js";
import DataGrid from "./ui/DataGrid.js";
import MoviesService from "./service/MoviesService.js"
import DetailsMovieForm from "./ui/DetailsMovieForm.js"
import Paginator from "./ui/Paginator.js"
import Filters from "./ui/Filters.js"


const sections = [
    { title: "Home", id: "home-section" },
    { title: "Favorite", id: "favorite-section" },
    { title: "Watch list", id: "watch-list-section" },
    { title: "Search", id: "search-section" },
    { title: "Log in", id: "log-in-section" },
    { title: "Registration", id: "registration-section" },
    { title: "Log out", id: "log-out-section" }
];

const categories = [
    { title: 'Popular', type: 'popular', name: 'popular'},
    { title: 'Now Playing', type: 'now_playing', name: 'now-playing'},
    { title: 'Top Rated', type: 'top_rated', name: 'top-rated'},
    { title: 'Upcoming', type: 'upcoming', name: 'upcoming'}
];

const homeIndex = sections.findIndex(s => s.title == "Home");
const favoriteIndex = sections.findIndex(s => s.title == "Favorite");
const watchListIndex = sections.findIndex(s => s.title == "Watch list");
const searchIndex = sections.findIndex(s => s.title == "Search");
const logInIndex = sections.findIndex(s => s.title == "Log in");
const registrationIndex = sections.findIndex(s => s.title == "Registration");
const logOutIndex = sections.findIndex(s => s.title == "Log out");

const menu = new ApplicationBar("menu-container", sections, menuHandler);
const moviesService = new MoviesService(menuHandler, categories);
const moviesTable = new DataGrid("movies-list");
const detailsMovieForm = new DetailsMovieForm('movie-detail');
const paginator = new Paginator('pages-toolbar');

moviesTable.addHandler(movieHandler);
const genres = await moviesService.getGenres();
const filters = new Filters('search-toolbar', categories, genres)
// filters.addHandler(filtersHandler);

async function menuHandler(index) {

    switch (index) {
        case homeIndex: {

            // получаем список фильмов, количество страниц, заполняем меню с фильтрами
            const movies = await action(moviesService.getMoviesData.bind(moviesService));
            filters.fillToolbar();
            filters.setActive(categories[0].name, index);
            filters.addCategoriesHandler(filtersHandler)
            filters.addGenresHandler(genresHandler)
            moviesTable.fillData(movies);
            paginator.fillForm(1, movies.total_pages)
            paginator.addHandler(paginatorHandler);
            break;
        }

        case favoriteIndex: {

            break;
        }

        case watchListIndex: {

            break;
        }

        case favoriteIndex: {

            break;
        }

        case searchIndex: {

            break;
        }

        case logInIndex: {

            break;
        }

        case registrationIndex: {

            break;
        }

        case logOutIndex: {

            break;
        }
    }

}

async function movieHandler(index) {
    if (detailsMovieForm.getActiveIndex() == index) {
        detailsMovieForm.hide()
    } else {
        detailsMovieForm.show(index);
        detailsMovieForm.fillDetailsSection(index, genres);
    }
    //Показать подробное описание
}

async function paginatorHandler(divText) {
    let newPage;
    const activePage = paginator.getActive();
    const totalPages = paginator.getTotal();
    if (divText == 'prev' && activePage > 1) {
        newPage = activePage - 1;
    } else if (divText == 'next' && activePage < totalPages) {
        newPage = activePage + 1;
    } else {
        newPage = Number(divText);
    }
    if (newPage) {
        const movies = await action(moviesService.getMoviesData.bind(moviesService, newPage));
        moviesTable.fillData(movies);
        paginator.fillForm(newPage, movies.total_pages)
        paginator.addHandler(paginatorHandler);
    }
}

async function filtersHandler(categoryID, index) {
    console.log('filters handler', categoryID, index);
    const cat = categories.find(x => `category-${x.name}` == categoryID);
    const movies = await action(moviesService.getMoviesData.bind(moviesService, 1, cat.type));
    filters.setActive(categoryID, index);
    moviesTable.fillData(movies);
    paginator.fillForm(1, movies.total_pages)
    paginator.addHandler(paginatorHandler);
}

async function genresHandler(genres) {
    console.log('genres handler', genres);
    const movies = await action(moviesService.getMoviesData.bind(moviesService, 1, undefined, genres));
    // filters.setActive(categoryID, index);
    moviesTable.fillData(movies);
    paginator.fillForm(1, movies.total_pages)
    paginator.addHandler(paginatorHandler);
}

async function action(serviceFn) {
    // spinner.start();
    try {
        const res = await serviceFn();
        return res;
    } catch (error) {
        alert(error.code ? 'server responded with ' + code : 'server is unavailable')
    } finally {
        // spinner.stop();
    }
}