import Api from "./api.js";
export default class MoviesRoute extends Api {
    constructor() {
        super();
        this.routesUrl = ``;
    }

    async get5RandomMovies(categoryids, token) {
        try {
            let events = `movie/randomMovies`;
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
        console.log("getMovieByIdMovieApi : " + idmovieapi)
        try {
            let events = `movie/ByidMovieApi`;
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

    async getPlatforms(idapi, token){
        try {
            let events = `movie/platform`;
            const headers = new Headers();
            headers.append('idmovieapi', idapi);
            headers.append('Authorization', token);
            const response = await fetch(`${this.apiServer}/${events}`, { method: 'GET', headers });
            const data = await response.json();
            return data;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    async getCompletion(token, recherche){
        try {
            let events = `movie/search`;
            const headers = new Headers();
            headers.append('query', recherche);
            headers.append('Authorization', token);
            const response = await fetch(`${this.apiServer}/${events}`, { method: 'GET', headers });
            const data = await response.json();
            return data;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    async deleteMovie(identifierType, value){
        try {
            let events = `movie`;
            const headers = new Headers();
            headers.append(identifierType, value);
            headers.append('Authorization', sessionStorage.getItem("token"));
            const response = await fetch(`${this.apiServer}/${events}`, { method: 'DELETE', headers });
            console.log(response)
            if (response.ok) {
                alert('Film supprimée avec succès.');
            } else {
                alert('Erreur lors de la suppression de la série.');
            }
            const data = await response.json();
            return data;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

}
