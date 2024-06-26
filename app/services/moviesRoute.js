import Api from "./api.js";
export default class MoviesRoute extends Api {
    constructor() {
        super();
        this.routesUrl = ``;
    }

    async get5RandomMovies(categoryids,platformsids, token) {
        try {
            let events = `movie/randomMovies`;
            const headers = new Headers();
            headers.append('categoryids', categoryids.join(','));
            headers.append('platformsIds', platformsids.join(','));
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

    async getMoviePlatforms(idapi, token){
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

    async getPlatforms(){
        try {
            let events = `platforms`;
            const headers = new Headers();
            headers.append('Authorization', sessionStorage.getItem("token"));
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

    async updateMovie(arg){
        try {
                const events = 'movie';
                const headers = new Headers({
                    'Authorization': sessionStorage.getItem('token'),
                    'Content-Type': 'application/json' // Specify content type as JSON
                });
                let body
                if(arg.id){
                    body = JSON.stringify({
                        id: arg.id,
                        newName: arg.newName,
                        overview: arg.overview
                    });
                }else{
                    body = JSON.stringify({
                        name: arg.name,
                        newName: arg.newName,
                        overview: arg.overview
                    });
                }

                const response = await fetch(`${this.apiServer}/${events}`, { method: 'PUT', headers, body });
                console.log(response);

                if (response.ok) {
                    alert('Film mise à jour avec succès.');
                } else {
                    alert('Erreur lors de la mise à jour du film.');
                }

                const data = await response.json();
                return data;
            } catch (error) {
                console.error(error);
                throw error;
            }
    }

}
