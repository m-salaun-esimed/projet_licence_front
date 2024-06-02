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
        let routeAuthenticate = "createAccount";
        const headers = new Headers();
        headers.append('authorization',  sessionStorage.getItem("token"));

        return fetch(`${this.apiServer}/${this.routesUrl}/${routeAuthenticate}`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `${sessionStorage.getItem("token")}`},
            body: JSON.stringify(data) })
    }

    async verifyEstAdmin(idUser){
        console.log("idUser " + idUser)
        let routeAuthenticate = "user/estAdmin"
        try {
            const headers = new Headers();
            headers.append('iduser', idUser);
            headers.append('authorization',  sessionStorage.getItem("token"));
            const response = await fetch(`${this.apiServer}/${routeAuthenticate}`, { method: 'GET', headers });
            const data = await response.json();
            console.log(data);
            return data;
        } catch (e) {
            console.error(e);
            throw e;
        }
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

    async refreshToken(token){
            let events = `user/refreshtoken`;
            const headers = new Headers();
            headers.append('Authorization', token);
            const response = await fetch(`${this.apiServer}/${events}`, { method: 'GET', headers });
            const data = await response.json();
            return data;
    }

    async deleteUser(displayname){
        try {
            let events = `user`;
            const headers = new Headers();
            headers.append('displayname', displayname);
            headers.append('Authorization', sessionStorage.getItem("token"));
            const response = await fetch(`${this.apiServer}/${events}`, { method: 'DELETE', headers });
            const data = await response.json();
            return data;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    async updatePwd(login, pwd) {
        try {
            let events = `user/pwd`;
            const body = JSON.stringify({ login: login, pwd: pwd });
            const headers = new Headers({
                'Authorization': sessionStorage.getItem('token'),
                'Content-Type': 'application/json' // Specify content type as JSON
            });
            const response = await fetch(`${this.apiServer}/${events}`, { method: 'PUT', headers, body });
            console.log(login)
            console.log(pwd)

            if (!response.ok) {
                throw new Error(`Erreur lors de la mise à jour du mot de passe: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }
}
