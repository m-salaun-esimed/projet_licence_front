import Api from "./api.js";

export default class FavoriteRoute extends Api {
    constructor() {
        super();
    }

    async postFavoriteMovie(token, data) {
        try {
            console.log(data)
            let events = `favorite/post`
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


    async removeFavoriteMovie(token, idapi) {
        const data = {
            idapi : idapi
        }
        console.log("token " + token + "movieidapi " + JSON.stringify(data))
        try {
            let route = `favorite/delete`
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


    async getAllFavoriteApi(idUser, type){
        const token = sessionStorage.getItem("token")
        try {
            const headers = new Headers();
            headers.append('iduser', idUser);
            headers.append('Authorization', token);
            let events = `favorite`
            const response = await fetch(`${this.apiServer}/${events}`, { method: 'GET', headers });
            const data = await response.json();
            return data;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }
}
