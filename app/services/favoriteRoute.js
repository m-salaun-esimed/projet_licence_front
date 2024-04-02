import Api from "./api.js";

export default class FavoriteRoute extends Api {
    constructor() {
        super();
    }

    async postFavoriteMovie(token, data) {
        try {
            console.log(data)
            let events = `postFavoriteMovie`
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', token);
            const response = await fetch(`${this.apiServer}/${events}`,
                { method: 'POST', headers, body: JSON.stringify(data)});
            const dataRequete = await response.json();
            return dataRequete;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }


    async removeFavoriteMovie(token, movieidapi) {
        const data = {
            movieidapi : movieidapi
        }
        console.log("token " + token + "movieidapi " + JSON.stringify(data))
        try {
            let route = `deleteFavoriteByMovieIdApiUser`
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', token);
            const response = await fetch(`${this.apiServer}/${route}`,
                { method: 'DELETE', headers, body: JSON.stringify(data)});
            const dataRequete = await response.json();
            return dataRequete;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }


    async getAllFavoriteApi(idUser){
        const token = sessionStorage.getItem("token")
        try {
            const headers = new Headers();
            headers.append('iduser', idUser);
            headers.append('Authorization', token);
            let events = `getAllFavoriteByIdUser`
            const response = await fetch(`${this.apiServer}/${events}`, { method: 'GET', headers });
            const data = await response.json();
            return data;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }
}
