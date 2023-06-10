// import employeesConfig from "./config/employees-config.json" assert {type: 'json'}
import ApplicationBar from "./ui/ApplicationBar.js";
import DataGrid from "./ui/DataGrid.js";
import MoviesService from "./service/MoviesService.js"
import UsersService from "./service/UsersService.js"
import DetailsMovieForm from "./ui/DetailsMovieForm.js"
import SearchMovieForm from "./ui/SearchMovieForm.js"
import Paginator from "./ui/Paginator.js"
import Filters from "./ui/Filters.js"
import UsersActionPage from "./ui/UsersActionPage.js"


const sections = [
    { title: "Home", id: "home-section", buttonID: "home-menu-button" },
    { title: "Favorite", id: "favorite-section", buttonID: "favorite-menu-button" },
    { title: "Watch list", id: "watch-list-section", buttonID: "watch-list-menu-button" },
    { title: "Search", id: "search-section", buttonID: "search-menu-button" },
    { title: "Log in", id: "log-in-section", buttonID: "log-in-menu-button" },
    { title: "Registration", id: "registration-section", buttonID: "registration-menu-button" },
    { title: "Log out", id: "log-out-section", buttonID: "log-out-menu-button" }
];

const categories = [
    { title: 'Popular', type: 'popular', name: 'popular' },
    { title: 'Now Playing', type: 'now_playing', name: 'now-playing' },
    { title: 'Top Rated', type: 'top_rated', name: 'top-rated' },
    { title: 'Upcoming', type: 'upcoming', name: 'upcoming' }
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
const homeMoviesTable = new DataGrid("home-movies-list");
const favoriteMoviesTable = new DataGrid("favorite-movies-list");
const watchlistMoviesTable = new DataGrid("watch-list-movies-list");
const searchMoviesTable = new DataGrid("search-movies-list");
const detailsMovieForm = new DetailsMovieForm();
const paginator = new Paginator('pages-toolbar');
const userService = new UsersService();
const searchMovieForm = new SearchMovieForm('search-movie');
const userLogInPage = new UsersActionPage('log-in-section', 'login');
const registrationPage = new UsersActionPage('registration-section', 'registration');


const genres = await moviesService.getGenres();
const filters = new Filters('search-toolbar', categories, genres)

let currentUser;
const response = await userService.getActiveUser();
if (response.length) {
    currentUser = response[0];
    menu.setActiveUser(currentUser);
    menu.hideButtons([logInIndex, registrationIndex]);
} else {
    menu.setActiveUser('');
    menu.hideButtons([logOutIndex, favoriteIndex, watchListIndex]);
}

// const intervalID = setInterval(userService.updateUser.bind(userService, currentUser), 5000);

async function menuHandler(index) {

    switch (index) {
        case homeIndex: {

            const movies = await action(moviesService.getMoviesData.bind(moviesService));

            filters.fillToolbar();
            filters.setActive();
            filters.addCategoriesHandler(filtersHandler)
            filters.addGenresHandler(genresHandler)

            homeMoviesTable.fillData(movies, currentUser);
            homeMoviesTable.addHandler(movieDetailsHandler);

            paginator.fillForm(1, movies.total_pages)
            paginator.addHandler(paginatorHandler);

            buttonsHandler('home-movies-list');

            break;
        }

        case favoriteIndex: {

            const movies = await action(moviesService.getMoviesFromArray.bind(moviesService, currentUser, 'favorites'));
            favoriteMoviesTable.fillData(movies, currentUser);
            favoriteMoviesTable.addHandler(movieDetailsHandler);

            buttonsHandler('favorite-movies-list');

            break;
        }

        case watchListIndex: {

            const movies = await action(moviesService.getMoviesFromArray.bind(moviesService, currentUser, 'watchlist'));

            watchlistMoviesTable.fillData(movies, currentUser);
            watchlistMoviesTable.addHandler(movieDetailsHandler);

            buttonsHandler('watch-list-movies-list');

            break;
        }

        case searchIndex: {

            searchMovieForm.fillForm();
            searchMovieForm.addEventListener(searchHandler);

            break;
        }

        case logInIndex: {

            userLogInPage.fillForm();
            userLogInPage.addHandler(async (login, password) => {
                const user = await action(userService.login.bind(userService, login, password));
                if (user) {
                    menu.hideButtons([logInIndex, registrationIndex]);
                    menu.showButtons([logOutIndex, favoriteIndex, watchListIndex]);
                }
                currentUser = user;
                menu.setActiveUser(currentUser);
                menu.setActiveIndex.call(menu, homeIndex);
                return user;
            })
            break;
        }

        case registrationIndex: {
            registrationPage.fillForm();
            registrationPage.addHandler(async (newUser) => {
                const user = await action(userService.registerUser.bind(userService, newUser));
                if (user){
                    currentUser = user;
                    menu.setActiveUser(currentUser);
                    menu.hideButtons([logInIndex, registrationIndex]);
                    menu.showButtons([logOutIndex, favoriteIndex, watchListIndex]);
                    menu.setActiveIndex.call(menu, homeIndex);
                    return user;
                }
            })
            break;
        }

        case logOutIndex: {
            userService.updateUser.call(userService, currentUser);
            await action(userService.logout.bind(userService, currentUser));
            currentUser = undefined;
            menu.setActiveUser('');
            menu.showButtons([logInIndex, registrationIndex]);
            menu.hideButtons([logOutIndex, favoriteIndex, watchListIndex]);
            break;
        }
    }
}

async function buttonsHandler(parentID) {
    const likeButtons = document.getElementById(parentID).getElementsByClassName('like-btn');
    Array.from(likeButtons).forEach(button => button.addEventListener("click", likeHandler.bind(this, button)));
    const watchButtons = document.getElementById(parentID).getElementsByClassName('watch-btn');
    Array.from(watchButtons).forEach(button => button.addEventListener("click", watchHandler.bind(this, button)));
}

async function likeHandler(button) {
    const movieID = button.getAttribute('movie-id');
    const buttons = document.querySelectorAll(`button.like-btn[movie-id="${movieID}"]`);
    const indexOfButton = currentUser.favorites.indexOf(movieID);
    if (indexOfButton == -1) {
        buttons.forEach(b => b.classList.add('selectedBTN'));
        currentUser.favorites.push(movieID);
    } else {
        buttons.forEach(b => b.classList.remove('selectedBTN'));
        currentUser.favorites.splice(indexOfButton, 1);
    }
}

async function watchHandler(button) {
    const movieID = button.getAttribute('movie-id');
    const buttons = document.querySelectorAll(`button.watch-btn[movie-id="${movieID}"]`);
    const indexOfButton = currentUser.watchlist.indexOf(String(movieID));
    if (indexOfButton == -1) {
        buttons.forEach(b => b.classList.add('selectedBTN'));
        currentUser.watchlist.push(movieID);
    } else {
        buttons.forEach(b => b.classList.remove('selectedBTN'));
        currentUser.watchlist.splice(indexOfButton, 1);
    }
}

async function movieDetailsHandler(index, section) {
    if (detailsMovieForm.getActiveIndex() == index) {
        detailsMovieForm.hide(section)
    } else {
        detailsMovieForm.show(index, section);
        detailsMovieForm.fillForm(section, index, genres)
        buttonsHandler(section + '-details')
    }
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
        homeMoviesTable.fillData(movies, currentUser);
        homeMoviesTable.addHandler(movieDetailsHandler);
        paginator.fillForm(newPage, movies.total_pages)
        paginator.addHandler(paginatorHandler);
        buttonsHandler('home-movies-list');
    }
}

async function filtersHandler(categoryID, index) {
    const category = categories.find(x => `category-${x.name}` == categoryID);
    const movies = await action(moviesService.getMoviesData.bind(moviesService, 1, category.type));
    filters.setActive(index);
    homeMoviesTable.fillData(movies, currentUser);
    homeMoviesTable.addHandler(movieDetailsHandler);
    paginator.fillForm(1, movies.total_pages)
    paginator.addHandler(paginatorHandler);
    buttonsHandler('home-movies-list');
}

async function genresHandler(genres) {
    const movies = await action(moviesService.getMoviesData.bind(moviesService, 1, undefined, genres));
    // filters.setActive(categoryID, index);
    homeMoviesTable.fillData(movies, currentUser);
    paginator.fillForm(1, movies.total_pages)
    paginator.addHandler(paginatorHandler);
}

async function searchHandler(movieName){
    console.log(movieName);
    const movies = await action(moviesService.getMoviesByName.bind(moviesService, movieName));
    console.log(movies);
    searchMoviesTable.fillData(movies, currentUser);
    searchMoviesTable.addHandler(movieDetailsHandler);

    buttonsHandler('search-movies-list');
}

async function action(serviceFn) {
    // spinner.start();
    try {
        const res = await serviceFn();
        return res;
    } catch (error) {
        alert(error.code ? 'server responded with ' + code : 'server is unavailable' + error)
    } finally {
        // spinner.stop();
    }
}