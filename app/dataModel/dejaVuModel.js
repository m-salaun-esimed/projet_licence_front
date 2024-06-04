import UserModel from "./userModel.js";
import DejaVuRoute from "../services/dejaVuRoute.js";

export default class DejaVuModel {
    constructor() {
        this.api = new DejaVuRoute();
        this.userModel = new UserModel();
    }

    async postAlreadySeenMovie(token, data){
        try {
            return await this.api.postAlreadySeenMovie(token, data);
        } catch (error) {
            console.error("Erreur lors de la vérification de l'event", error);
        }
    }

    async getAllAlreadySeenMovie(){
        try {
            return await this.api.getAllAlreadySeenMovie();
        } catch (error) {
            console.error("Erreur lors de la vérification de l'event", error);
        }
    }

    async getAllAlreadySeenMovieId(id){
        try {
            return await this.api.getAllAlreadySeenMovieId(id);
        } catch (error) {
            console.error("Erreur lors de la vérification de l'event", error);
        }
    }

    async removeDejaVuMovie(token, movieidapi, typecontenu){
        try {
            return await this.api.removeAlreadySeenMovie(token, movieidapi, typecontenu);
        } catch (error) {
            console.error("Erreur lors de la vérification de l'event", error);
        }
    }
}
