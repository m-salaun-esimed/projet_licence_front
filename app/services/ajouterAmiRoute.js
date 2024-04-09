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

    async getFriendsRequestsSend(token){
        try {
            const headers = new Headers();
            headers.append('authorization', token);
            let events = `getFriendsRequestsSend`
            const response = await fetch(`${this.apiServer}/${events}`, { method: 'GET', headers });
            const data = await response.json();
            return data;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    async getFriendsRequestsReceived(token){
        try {
            const headers = new Headers();
            headers.append('authorization', token);
            let events = `getFriendsRequestsReceived`
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
            let events = `getFriendsRequestsReceived`
            const response = await fetch(`${this.apiServer}/${events}`, { method: 'GET', headers });
            const data = await response.json();
            return data;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    async getNotificationById(token, notification_id){
        try {
            const headers = new Headers();
            headers.append('authorization', token);
            headers.append('idnotification', notification_id);
            let events = `notificationbyid`
            const response = await fetch(`${this.apiServer}/${events}`, { method: 'GET', headers });
            const data = await response.json();
            return data;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    async getFriends(token){
        try {
            const headers = new Headers();
            headers.append('authorization', token);
            let events = `ami`
            const response = await fetch(`${this.apiServer}/${events}`, { method: 'GET', headers });
            const data = await response.json();
            return data;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    async accpeterDemande(token, friendrequestid, notificationid){
        try {
            const headers = new Headers();
            headers.append('Authorization', token);
            headers.append('Content-Type', 'application/json');

            const bodyData = JSON.stringify({ friendrequestid, notificationid });

            let events = `valider`;

            const response = await fetch(`${this.apiServer}/${events}`, {
                method: 'PUT',
                headers,
                body: bodyData
            });

            const data = await response.json();
            return data;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    async refuserDemande(token, friendrequestid, notificationid){
        try {
            const headers = new Headers();
            headers.append('Authorization', token);
            headers.append('Content-Type', 'application/json');

            const bodyData = JSON.stringify({ friendrequestid, notificationid });

            let events = `rejeter`;

            const response = await fetch(`${this.apiServer}/${events}`, {
                method: 'PUT',
                headers,
                body: bodyData
            });

            const data = await response.json();
            return data;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    async deleteFriend(token, iduser){
        console.log("deleteFriendRoute : " + iduser)
        try {
            const headers = new Headers();
            headers.append('authorization', token);
            headers.append('Content-Type', 'application/json');

            const bodyData = {
                idfriend : iduser
            };

            const events = `ami`;
            const response = await fetch(`${this.apiServer}/${events}`, {
                method: 'DELETE',
                headers: headers,
                body: JSON.stringify(bodyData)
            });
            const data = await response.json();
            return data;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

}