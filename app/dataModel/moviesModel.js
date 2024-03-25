import MoviesRoute from "../services/moviesRoute.js";

export default class MoviesModel {
    constructor() {
        this.api = new MoviesRoute();
    }

    async get5RandomMovies(categoryids){
        try {
            return await this.api.get5RandomMovies(categoryids)
        }catch (e){
            throw e;
        }
    }
}
