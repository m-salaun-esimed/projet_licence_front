import Api from "./api.js";

export default class UserRoute extends Api {
    constructor() {
        super();
        this.routesUrl = `user`;
    }

    authenticate(data){
        console.log("UserRoute : authenticate")
        let routeAuthenticate = "authenticate"
        return fetch(`${this.apiServer}/${this.routesUrl}/${routeAuthenticate}`, { method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data) })
    }

    createAccount(data){
        console.log("UserRoute : authenticate")
        let routeAuthenticate = "createAccount"
        return fetch(`${this.apiServer}/${this.routesUrl}/${routeAuthenticate}`, { method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data) })
    }

    verifyToken(data){
        let routeAuthenticate = "api/verifyToken"
        return fetch(`${this.apiServer}/${routeAuthenticate}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${data.authorization}`
            },
        })
    }

    async getIdUserApi(token, login){
        console.log("getIdUserApi " + login)
        let routeAuthenticate = "user/IdByLogin"
        try {
            let route = `user/IdByLogin`;
            const headers = new Headers();
            headers.append('login', login);
            headers.append('authorization', token);

            const response = await fetch(`${this.apiServer}/${routeAuthenticate}`, { method: 'GET', headers });
            const data = await response.json();
            return data;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    async displaynamebyid(token, sender_id){
        try {
            let events = `user/displaynamebyid`;
            const headers = new Headers();
            headers.append('iduser', sender_id);
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
