// import employeesConfig from "./config/employees-config.json" assert {type: 'json'}
import ApplicationBar from "./ui/ApplicationBar.js";
import DataGrid from "./ui/DataGrid.js";
import MoviesService from "./service/MoviesService.js"
import DetailsMovieForm from "./ui/DetailsMovieForm.js"


const sections = [
    { title: "Home", id: "home-section" },
    { title: "Favorite", id: "favorite-section" },
    { title: "Watch list", id: "watch-list-section" },
    { title: "Search", id: "search-section"},
    { title: "Log in", id: "log-in-section"},
    { title: "Registration", id: "registration-section"},
    { title: "Log out", id: "log-out-section"}
];

const homeIndex = sections.findIndex(s => s.title == "Home");
const favoriteIndex = sections.findIndex(s => s.title == "Favorite");
const watchListIndex = sections.findIndex(s => s.title == "Watch list");
const searchIndex = sections.findIndex(s => s.title == "Search");
const logInIndex = sections.findIndex(s => s.title == "Log in");
const registrationIndex = sections.findIndex(s => s.title == "Registration");
const logOutIndex = sections.findIndex(s => s.title == "Log out");

const menu = new ApplicationBar("menu-container", sections, menuHandler);
const moviesService = new MoviesService(menuHandler);
const moviesTable = new DataGrid("movies-list");
const detailsMovieForm = new DetailsMovieForm('movie-detail');

async function menuHandler(index) {

    switch (index) {
        case homeIndex: {
            // получаем список фильмов, количество страниц, заполняем меню с фильтрами
            const movies = await action(moviesService.getMoviesData.bind(moviesService));
            moviesTable.fillData(movies);
            moviesTable.addHandler(movieHandler);
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
    console.log('movie handler', index);
    if(detailsMovieForm.getActiveIndex() == index){
        detailsMovieForm.hide()

    } else {
        detailsMovieForm.show(index);
        detailsMovieForm.fillDetailsSection(index);
    }
    //Показать подробное описание
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