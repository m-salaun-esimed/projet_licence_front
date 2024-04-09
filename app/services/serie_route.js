import Api from "./api.js";
export default class SerieRoute extends Api {
    constructor() {
        super();
        this.routesUrl = ``;
    }

    async get5RandomSeries(categoryids, token) {
        try {
            let events = `getRandomSeries`;
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

    async getSerieByIdSerieApi(idserieapi){
        const token = sessionStorage.getItem("token")
        try {
            let events = `serieByIdSerieApi`;
            const headers = new Headers();
            headers.append('idserieapi', idserieapi);
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
            let events = `serie/platform`;
            const headers = new Headers();
            headers.append('idserieapi', idapi);
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
