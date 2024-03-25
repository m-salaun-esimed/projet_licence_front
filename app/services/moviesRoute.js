import Api from "./api.js";
export default class MoviesRoute extends Api {
    constructor() {
        super();
        this.routesUrl = ``;
    }

    async get5RandomMovies(categoryids) {
        try {
            let events = `getRandomMovies`;
            const headers = new Headers();
            headers.append('categoryids', categoryids);

            const response = await fetch(`${this.apiServer}/${events}`, { method: 'GET', headers });
            const data = await response.json();
            return data;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }


}
