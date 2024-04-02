import Api from "./api.js";
export default class MoviesRoute extends Api {
    constructor() {
        super();
        this.routesUrl = ``;
    }

    async get5RandomMovies(categoryids, token) {
        try {
            let events = `getRandomMovies`;
            const headers = new Headers();
            headers.append('categoryids', categoryids.join(','));
            headers.append('Authorization', token);
            const response = await fetch(`${this.apiServer}/${events}`, { method: 'GET', headers });
            const data = await response.json();
            return data;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    async getMovieByIdMovieApi(idmovieapi){
        const token = sessionStorage.getItem("token")
        try {
            let events = `movieByIdMovieApi`;
            const headers = new Headers();
            headers.append('idmovieapi', idmovieapi);
            headers.append('Authorization', token);
            const response = await fetch(`${this.apiServer}/${events}`, { method: 'GET', headers });
            const data = await response.json();
            return data;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    async searchMovies(query) {
        try {
            let events = `searchMovies`;
            const token = sessionStorage.getItem("token");
            const headers = new Headers();
            headers.append('query', query);
            headers.append('Authorization', token);
            const response = await fetch(`${this.apiServer}/${events}`, { method: 'GET', headers });
            const data = await response.json();
            return data;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

}
