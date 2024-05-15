import SerieRoute from "../services/serie_route.js";
export default class SerieModel {
    constructor() {
        this.api = new SerieRoute();
    }

    async get5RandomSeries(categoryids, token){
        try {
            return await this.api.get5RandomSeries(categoryids, token)
        }catch (e){
            throw e;
        }
    }

    async getSerieByIdSerieApi(idserieapi){
        try {
            return await this.api.getSerieByIdSerieApi(idserieapi)
        }catch (e){
            throw e;
        }
    }

    async getPlatforms(idapi, token){
        try {
            return await this.api.getPlatforms(idapi, token)
        }catch (e){
            throw e;
        }
    }

    async deleteSerie(identifierType, value){
        try {
            return await this.api.deleteSerie(identifierType, value)
        }catch (e){
            throw e;
        }
    }
}
