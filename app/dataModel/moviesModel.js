import MoviesRoute from "../services/moviesRoute.js";

export default class MoviesModel {
    constructor() {
        this.api = new MoviesRoute();
    }

    async get5RandomMovies(categoryids, platformsids, token){
        try {
            return await this.api.get5RandomMovies(categoryids, platformsids, token)
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

    async getMoviePlatforms(idapi, token){
        try {
            return await this.api.getMoviePlatforms(idapi, token)
        }catch (e){
            throw e;
        }
    }

    async getPlatforms(){
        try {
            return await this.api.getPlatforms()
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

    async deleteMovie(identifierType, value){
        try {
            return await this.api.deleteMovie(identifierType, value)
        }catch (e){
            throw e;
        }
    }

    async updateMovie(args){
        try {
            return await this.api.updateMovie(args)
        }catch (e){
            throw e;
        }
    }
}
