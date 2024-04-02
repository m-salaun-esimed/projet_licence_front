import FavoriteRoute from "../services/favoriteRoute.js";
import UserModel from "./userModel.js";

export default class FavoriteModel {
    constructor() {
        this.api = new FavoriteRoute();
        this.userModel = new UserModel();
    }

    async postFavoriteMovie(token, data){
        //const response = await this.userModel.verifyToken(token)
            try {
                return await this.api.postFavoriteMovie(token, data);
            } catch (error) {
                console.error("Erreur lors de la vérification de l'event", error);
            }
    }

    async removeFavoriteMovie(token, movieidapi){
        try {
            return await this.api.removeFavoriteMovie(token, movieidapi);
        } catch (error) {
            console.error("Erreur lors de la vérification de l'event", error);
        }
    }

    async getAllFavorite(idUser){
            try {
                return await this.api.getAllFavoriteApi(idUser);
            } catch (error) {
                console.error("Erreur lors de la vérification de l'event", error);
            }
    }
}
