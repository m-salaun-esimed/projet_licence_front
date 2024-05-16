import Api from "./api.js";
export default class SerieRoute extends Api {
    constructor() {
        super();
        this.routesUrl = ``;
    }

    async get5RandomSeries(categoryids, token) {
        try {
            let events = `serie/random`;
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
            let events = `serie/byidserieapi`;
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
            console.log(response)
            const data = await response.json();
            return data;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    async deleteSerie(identifierType, value){
        try {
            let events = `serie`;
            const headers = new Headers();
            headers.append(identifierType, value);
            headers.append('Authorization', sessionStorage.getItem("token"));
            const response = await fetch(`${this.apiServer}/${events}`, { method: 'DELETE', headers });
            console.log(response)
            if (response.ok) {
                alert('Série supprimée avec succès.');
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

    async updateSerie(arg) {
        try {
            const events = 'serie';
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
                alert('Série mise à jour avec succès.');
            } else {
                alert('Erreur lors de la mise à jour de la série.');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

}
