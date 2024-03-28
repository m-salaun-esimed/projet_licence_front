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

    async getIdUserApi(login){
        console.log("getIdUserApi " + login)
        let routeAuthenticate = "user/IdByLogin"
        try {
            let route = `user/IdByLogin`;
            const headers = new Headers();
            headers.append('login', login);

            const response = await fetch(`${this.apiServer}/${routeAuthenticate}`, { method: 'GET', headers });
            const data = await response.json();
            return data;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }
}
