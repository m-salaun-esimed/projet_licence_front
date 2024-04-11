import MoviesRoute from "../services/moviesRoute.js";

export default class MoviesModel {
    constructor() {
        this.api = new MoviesRoute();
    }

    async get5RandomMovies(categoryids, token){
        try {
            return await this.api.get5RandomMovies(categoryids, token)
        }catch (e){
            throw e;
        }
    }

    async getMovieByIdMovieApi(idmovieapi){
        return await this.api.getMovieByIdMovieApi(idmovieapi)
    }

    async searchMovies(query) {
        try {
            return await this.api.searchMovies(query);
        }catch (e){
            throw e;
        }
    }

    async getPlatforms(idmovieapi, token){
        try {
            return await this.api.getPlatforms(idmovieapi, token)
        }catch (e){
            throw e;
        }
    }

    async getCompletion(token, recherche){
        try {
            return await this.api.getCompletion(token, recherche)
        }catch (e){
            throw e;
        }
    }
}
