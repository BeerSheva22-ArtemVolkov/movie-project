export default class UsersActionPage {

    #parentElement;
    #type;
    #parentID;
    #formElement;
    #dataObj;

    constructor(parentID, type) {
        const parentElement = document.getElementById(parentID);
        this.#parentElement = parentElement;
        this.#type = type;
        this.#dataObj = {};
        this.#parentID = parentID;
    }

    async fillForm() {
        this.#parentElement.innerHTML = `<form class="${this.#type}-control" id="${this.#parentID}-${this.#type}-form-id" autocomplete="off">
            <table>
                <tbody class="${this.#type}-input-group">
                    <tr class="${this.#type}-username-container">
                        <td><label for="${this.#type}-username-id">Username</label></td>
                        <td><input type="text" name="username" id="${this.#type}-username-id" required></td>
                    </tr>
                    <tr class="${this.#type}-password-container">
                        <td><label for="${this.#type}-password-id">Password</label></td>
                        <td><input type="password" name="password" id="${this.#type}-password-id" required></td>
                    </tr>
                    ${this.#type == 'registration' ? `<tr class="${this.#type}-confirm-password-container">
                        <td><label for="${this.#type}-confirm-password-id">Confirm password</label></td>
                        <td><input type="password" name="confirm-password" id="${this.#type}-confirm-password-id" required></td>
                    </tr>` : ''}
                </tbody> 
            </table>
            <button class="${this.#type}-submitBtn" type="submit">Submit</button>
        </form>`
        this.#formElement = document.getElementById(`${this.#parentID}-${this.#type}-form-id`);
    }

    addHandler(callbackFn) {
        this.#formElement.onsubmit = async (event) => {
            event.preventDefault();
            const formData = new FormData(this.#formElement);
            this.#dataObj.username = formData.get('username');
            this.#dataObj.password = formData.get('password');

            switch (this.#type) {
                case 'login': {
                    const res = await callbackFn(this.#dataObj.username, this.#dataObj.password);
                    console.log(res);
                    if (res) {
                        this.#formElement.reset();
                    }
                    break;
                }
                case 'registration': {
                    this.#dataObj.confirmPassword = formData.get('confirm-password');
                    const res = await callbackFn(this.#dataObj);
                    if (res) {
                        this.#formElement.reset();
                    }
                    break;
                }
            }
        };
    }
}
