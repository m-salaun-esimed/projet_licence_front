import FavoriteRoute from "../services/favoriteRoute.js";
import UserModel from "./userModel.js";

export default class FavoriteModel {
    constructor() {
        this.api = new FavoriteRoute();
        this.userModel = new UserModel();
    }

    async postFavoriteMovie(token, data){
            try {
                return await this.api.postFavoriteMovie(token, data);
            } catch (error) {
                console.error("Erreur lors de la vérification de l'event", error);
            }
    }

    async removeFavoriteMovie(token, idapi){
        try {
            return await this.api.removeFavoriteMovie(token, idapi);
        } catch (error) {
            console.error("Erreur lors de la vérification de l'event", error);
        }
    }

    async getAllFavorite(idUser, type){
            try {
                return await this.api.getAllFavoriteApi(idUser, type);
            } catch (error) {
                console.error("Erreur lors de la vérification de l'event", error);
            }
    }
}
