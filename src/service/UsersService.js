const URL = 'http://localhost:3500/users'
const usernameRegex = '/^[A-Za-z][A-Za-z0-9_]{6,20}$/'
const passwordRegex = '/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/'

export default class ServerCompanyService {

    constructor(){

    }

    async getActiveUser(){
        const allUsers = await this.#getAllUsers();
        const user = allUsers.filter(user => user.active == true);
        return user;
    }

    async #getUser(username){
        const data = await fetch(`${URL}/?username=${username}`)
        console.log(data);
        const user = await data.json();
        console.log(user);
        return user;
    }

    async registerUser(newUser){
        console.log(newUser);
        const userExist = await this.#getUser(newUser.username)
        if (userExist.length){
            alert ("Такой пользователь уже существует")
        } else {
            if (usernameRegex.match(newUser.username)){
                alert ("Недопустимое имя пользователя")
            } else if (passwordRegex.match(newUser.password)) {
                alert ("Недопустимый пароль")
            } else if (newUser.password != newUser.confirmPassword) {
                alert ("Пароли не совпадают")
            } else {
                const response = await fetch(URL, {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({...newUser, favorites: [], watchlist: [], active: true})
                })
                const addedUser = await response.json();
                return addedUser;
            } 
        }
    }

    async login(username, password){
        const data = await fetch(`${URL}/?username=${username}&password=${password}`);
        let user = await data.json();
        if (user.length){
            const updatedData = await fetch(`${URL}/${user[0].id}`, {
                method: 'PUT',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({...user[0], active: true})
            });
            user = await updatedData.json();
            return user;
        } else {
            alert ("Пользователь не найден")
        }
    }

    async logout(user){
        const data = await fetch(`${URL}/${user.id}`, {
            method: 'PUT',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({...user, active: false})
        });
        const response = await data.json();
    }

    async addToFavoriteList(user, movieID){
        const currentUser = await this.#getUser(user.username);
        console.log(currentUser[0]);
        const favorite = currentUser[0].favorites;
        console.log(favorite);
        favorite.push(movieID);
        const data = await fetch(`${URL}/${user.id}`, {
            method: 'PUT',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({...currentUser[0], favorites: favorite})
        });
        const response = await data.json();
    }

    async addToWatchList(user){

    }

    async getFavoriteList(user){

    }

    async getWatchList(user){

    }

    async #getAllUsers() {
        const response = await fetch(URL);
        const allUsers = await response.json();
        return allUsers;
    }

    async updateUser(user){
        console.log('update');
        if (user != undefined){
            await fetch(`${URL}/${user.id}`, {
                method: 'PUT',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(user)
            });
            console.log('update done');
        }
        
    }
}