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
                <button id="${this.#type}-submitBtn" type="submit">Submit</button>
            </form>
        </div>`
        this.#formElement = document.getElementById(`${this.#parentID}-form-id`);
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
