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
        this.#parentElement.innerHTML = `<div id="${this.#type}-box">
            <div><h1>${this.#type.toUpperCase()}</h1></div>
            <form class="${this.#type}-control" id="${this.#parentID}-form-id" autocomplete="off">
                        <div class="username-container">
                            <input type="text" name="username" id="${this.#type}-username-id" placeholder="Username" required>
                        </div>
                        <div class="password-container">
                            <input type="password" name="password" id="${this.#type}-password-id" placeholder="Password" required>
                        </div>
                        ${this.#type == 'registration' ? `<div class="confirm-password-container">
                            <input type="password" name="confirm-password" id="${this.#type}-confirm-password-id" placeholder="Confirm password" required>
                        </div>` : ''}
                        <div class="button-container">
                            <button id="${this.#type}-submitBtn" type="submit">${this.#type.charAt(0).toUpperCase() + this.#type.slice(1)}</button>
                        </div>
                <div class="additional-info">
                    <a>${this.#type == 'login' ? `You have no account? <a id="link-from-${this.#type}">Register now</a>` : `You have an account? <a id="link-from-${this.#type}">Log in now</a>`}</a>
                </div>
            </form>
        </div>`
        this.#formElement = document.getElementById(`${this.#parentID}-form-id`);
        document.getElementById(`link-from-${this.#type}`).addEventListener("click", () => document.getElementById(`${this.#type == 'login' ? 'registration-menu-button' : 'log-in-menu-button'}`).click());
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
