import FavoriteRoute from "../services/favoriteRoute.js";
import UserModel from "./userModel.js";

export default class FavoriteModel {
    constructor() {
        this.api = new FavoriteRoute();
        this.userModel = new UserModel();
    }

    async postFavoriteMovie(token, data){
        return await this.api.postFavoriteMovie(token, data);
    }

    async removeFavoriteMovie(token, idapi){
        return await this.api.removeFavoriteMovie(token, idapi);
    }

    async getAllFavorite(idUser, type){
        return await this.api.getAllFavoriteApi(idUser, type);
    }

    async afficherFavorisUser(idUser){
        return await this.api.getAllFavoriteApiByUserId(idUser);
    }
}
