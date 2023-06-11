import config from "../config/config.json" assert {type: 'json'}

const URL = 'http://localhost:3500/users'
// const usernameRegex = '/^[A-Za-z][A-Za-z0-9_]{6,20}$/'
// const passwordRegex = '/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/'

export default class ServerCompanyService {

    async getActiveUser(){
        const allUsers = await this.#getAllUsers();
        const user = allUsers.filter(user => user.active == true);
        return user;
    }

    async #getUser(username){
        const data = await fetch(`${URL}/?username=${username}`)
        const user = await data.json();
        return user;
    }

    async registerUser(newUser){
        const userExist = await this.#getUser(newUser.username)
        if (userExist.length){
            alert ("Такой пользователь уже существует")
        } else {
            if (config.usernameRegex.match(newUser.username)){
                alert ("Недопустимое имя пользователя")
            } else if (config.passwordRegex.match(newUser.password)) {
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

    async #getAllUsers() {
        const response = await fetch(URL);
        const allUsers = await response.json();
        return allUsers;
    }

    async updateUser(user){
        if (user != undefined){
            await fetch(`${URL}/${user.id}`, {
                method: 'PUT',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(user)
            });
        }
        
    }
}