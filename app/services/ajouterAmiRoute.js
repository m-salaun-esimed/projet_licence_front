import Api from "./api.js";

export default class AjouterAmiRoute extends Api {
    constructor() {
        super();
    }
    async getSuggestions(token, recherche){
        try {
            const headers = new Headers();
            headers.append('authorization', token);
            headers.append('recherche', recherche);
            let events = `user/searchdisplaynames`
            const response = await fetch(`${this.apiServer}/${events}`, { method: 'GET', headers });
            const data = await response.json();
            return data;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    async ajouter(token, data){
        try {
            console.log("data"+data)
            let events = `addFriend`
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

    async getFriendsRequests(token){
        try {
            const headers = new Headers();
            headers.append('authorization', token);
            let events = `getFriendsRequests`
            const response = await fetch(`${this.apiServer}/${events}`, { method: 'GET', headers });
            const data = await response.json();
            return data;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    async afficherLesDemandes(token){
        try {
            const headers = new Headers();
            headers.append('authorization', token);
            let events = `notification`
            const response = await fetch(`${this.apiServer}/${events}`, { method: 'GET', headers });
            const data = await response.json();
            return data;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }
}