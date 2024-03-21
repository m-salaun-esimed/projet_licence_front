import Api from "./api.js";

export default class UserRoute extends Api {
    constructor() {
        super();
    }

    async getAllCategorieMovie() {
        try {
            let events = `movieCategory`
            const response = await fetch(`${this.apiServer}/${events}`, { method: 'GET' });
            const data = await response.json();
            return data;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }
}
