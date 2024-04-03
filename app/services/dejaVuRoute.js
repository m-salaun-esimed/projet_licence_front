import Api from "./api.js";

export default class DejaVuRoute extends Api {
    constructor() {
        super();
    }

    async postAlreadySeenMovie(token, data) {
        try {
            console.log("data"+data)
            let events = `postAlreadySeenMovie`
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

    async getAllAlreadySeenMovie(){
        const token = sessionStorage.getItem("token")
        try {
            const headers = new Headers();
            headers.append('Authorization', token);
            let events = `getAllAlreadySeenMovie`
            const response = await fetch(`${this.apiServer}/${events}`, { method: 'GET', headers });
            const data = await response.json();
            return data;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    async removeAlreadySeenMovie(token, movieidapi){
        const data = {
            movieidapi : movieidapi
        }
        console.log("token " + token + "movieidapi " + JSON.stringify(data))

        try {
            let route = `deleteAlreadySeenMovieByMovieIdApiUser`
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
}
