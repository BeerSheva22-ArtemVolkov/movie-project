import ApplicationBar from "./ui/ApplicationBar.js";
import DataGrid from "./ui/DataGrid.js";
import MoviesService from "./service/MoviesService.js"
import UsersService from "./service/UsersService.js"
import DetailsMovieForm from "./ui/DetailsMovieForm.js"
import SearchMovieForm from "./ui/SearchMovieForm.js"
import Paginator from "./ui/Paginator.js"
import Filters from "./ui/Filters.js"
import UsersActionPage from "./ui/UsersActionPage.js"
import Spinner from "./ui/Spinner.js";

const sections = [
    { title: "Home", id: "home-section", buttonID: "home-menu-button", iconID: "home-menu-button-icon" },
    { title: "Favorite", id: "favorite-section", buttonID: "favorite-menu-button", iconID: "favorite-menu-button-icon" },
    { title: "Watch list", id: "watch-list-section", buttonID: "watch-list-menu-button", iconID: "watch-list-menu-button-icon" },
    { title: "Search", id: "search-section", buttonID: "search-menu-button", iconID: "search-menu-button-icon" },
    { title: "Log in", id: "log-in-section", buttonID: "log-in-menu-button", iconID: "log-in-menu-button-icon" },
    { title: "Registration", id: "registration-section", buttonID: "registration-menu-button", iconID: "registration-menu-button-icon" },
    { title: "Log out", id: "log-out-section", buttonID: "log-out-menu-button", iconID: "log-out-menu-button-icon" }
];

const categories = [
    { title: 'Популярные', type: 'popular', name: 'popular' },
    { title: 'Уже в кино', type: 'now_playing', name: 'now-playing' },
    { title: 'Высокий рейтинг', type: 'top_rated', name: 'top-rated' },
    { title: 'Скоро в прокате', type: 'upcoming', name: 'upcoming' }
];

const homeIndex = sections.findIndex(s => s.title == "Home");
const favoriteIndex = sections.findIndex(s => s.title == "Favorite");
const watchListIndex = sections.findIndex(s => s.title == "Watch list");
const searchIndex = sections.findIndex(s => s.title == "Search");
const logInIndex = sections.findIndex(s => s.title == "Log in");
const registrationIndex = sections.findIndex(s => s.title == "Registration");
const logOutIndex = sections.findIndex(s => s.title == "Log out");

const menu = new ApplicationBar("menu-container", sections, menuHandler);
const moviesService = new MoviesService(categories);
const homeMoviesTable = new DataGrid("home-movies-list");
const favoriteMoviesTable = new DataGrid("favorite-movies-list");
const watchlistMoviesTable = new DataGrid("watch-list-movies-list");
const searchMoviesTable = new DataGrid("search-movies-list");
const detailsMovieForm = new DetailsMovieForm();
const paginator = new Paginator('pages-toolbar');
const userService = new UsersService();
const searchMovieForm = new SearchMovieForm('search-movie');
const userLogInPage = new UsersActionPage('log-in-section', 'login', sections);
const registrationPage = new UsersActionPage('registration-section', 'registration', sections);
const spinner = new Spinner();

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

            const movies = await action(moviesService.getMoviesData.bind(moviesService), sections[index].id);

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

            const movies = await action(moviesService.getMoviesFromArray.bind(moviesService, currentUser, 'favorites'), sections[index].id);
            favoriteMoviesTable.fillData(movies, currentUser);
            favoriteMoviesTable.addHandler(movieDetailsHandler);

            buttonsHandler('favorite-movies-list');

            break;
        }

        case watchListIndex: {

            const movies = await action(moviesService.getMoviesFromArray.bind(moviesService, currentUser, 'watchlist'), sections[index].id);

            watchlistMoviesTable.fillData(movies, currentUser);
            watchlistMoviesTable.addHandler(movieDetailsHandler);

            buttonsHandler('watch-list-movies-list');

            break;
        }

        case searchIndex: {

            searchMovieForm.fillForm();
            searchMovieForm.addHandler(searchHandler);

            break;
        }

        case logInIndex: {

            userLogInPage.fillForm();
            userLogInPage.addHandler(logInHandler)
            break;
        }

        case registrationIndex: {
            registrationPage.fillForm();
            registrationPage.addHandler(registrationHandler)
            break;
        }

        case logOutIndex: {
            userService.updateUser.call(userService, currentUser);
            await userService.logout.call(userService, currentUser);
            currentUser = undefined;
            menu.setActiveUser('');
            menu.showButtons([logInIndex, registrationIndex]);
            menu.hideButtons([logOutIndex, favoriteIndex, watchListIndex]);
            break;
        }
    }
}

async function logInHandler(login, password) {
    const user = await userService.login.call(userService, login, password);
    if (user) {
        menu.hideButtons([logInIndex, registrationIndex]);
        menu.showButtons([logOutIndex, favoriteIndex, watchListIndex]);
    }
    currentUser = user;
    menu.setActiveUser(currentUser);
    menu.setActiveIndex.call(menu, homeIndex);
    return user;
}

async function registrationHandler(newUser) {
    const user = await userService.registerUser.call(userService, newUser);
    if (user) {
        currentUser = user;
        menu.setActiveUser(currentUser);
        menu.hideButtons([logInIndex, registrationIndex]);
        menu.showButtons([logOutIndex, favoriteIndex, watchListIndex]);
        menu.setActiveIndex.call(menu, homeIndex);
        return user;
    }
}

async function buttonsHandler(parentID) {
    const likeButtons = document.getElementById(parentID).getElementsByClassName('like-btn');
    Array.from(likeButtons).forEach(button => button.addEventListener("click", watchLikeHandler.bind(this, button, 'like-btn')));
    const watchButtons = document.getElementById(parentID).getElementsByClassName('watch-btn');
    Array.from(watchButtons).forEach(button => button.addEventListener("click", watchLikeHandler.bind(this, button, 'watch-btn')));
}

async function watchLikeHandler(button, type) {
    const movieID = button.getAttribute('movie-id');
    const buttons = document.querySelectorAll(`button.${type}[movie-id="${movieID}"]`);
    const indexOfButton = currentUser.favorites.indexOf(movieID);
    if (indexOfButton == -1) {
        buttons.forEach(b => b.classList.add('selectedBTN'));
        currentUser.favorites.push(movieID);
    } else {
        buttons.forEach(b => b.classList.remove('selectedBTN'));
        currentUser.favorites.splice(indexOfButton, 1);
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
        const movies = await moviesService.getMoviesData.call(moviesService, newPage);
        homeMoviesTable.fillData(movies, currentUser);
        homeMoviesTable.addHandler(movieDetailsHandler);
        paginator.fillForm(newPage, movies.total_pages)
        paginator.addHandler(paginatorHandler);
        buttonsHandler('home-movies-list');
    }
}

async function filtersHandler(categoryID, index) {
    const category = categories.find(x => `category-${x.name}` == categoryID);
    const movies = await moviesService.getMoviesData.call(moviesService, 1, category.type);
    filters.setActive(index);
    homeMoviesTable.fillData(movies, currentUser);
    homeMoviesTable.addHandler(movieDetailsHandler);
    paginator.fillForm(1, movies.total_pages)
    paginator.addHandler(paginatorHandler);
    buttonsHandler('home-movies-list');
}

async function genresHandler(genres) {
    const movies = await moviesService.getMoviesData.call(moviesService, 1, undefined, genres);
    homeMoviesTable.fillData(movies, currentUser);
    paginator.fillForm(1, movies.total_pages)
    paginator.addHandler(paginatorHandler);
}

async function searchHandler(movieName) {
    const movies = await moviesService.getMoviesByName.call(moviesService, movieName);
    searchMoviesTable.fillData(movies, currentUser);
    searchMoviesTable.addHandler(movieDetailsHandler);

    buttonsHandler('search-movies-list');
}

async function action(serviceFn, sectionName) {
    spinner.start(sectionName);
    try {
        const res = await serviceFn();
        return res;
    } catch (error) {
        alert(error.code ? 'server responded with ' + code : 'server is unavailable' + error)
    } finally {
        spinner.stop(sectionName);
    }
}