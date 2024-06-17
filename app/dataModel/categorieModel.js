import CategorieRoute from "../services/categorieRoute.js";
import UserModel from "./userModel.js";

export default class CategorieModel {
    constructor() {
        this.api = new CategorieRoute();
        this.userModel = new UserModel();
    }

    async getAllCategorieMovie(token){
            try {
                const response = await this.api.getAllCategorieMovie(token);
                console.log(response);
                return response;
            } catch (error) {
                console.error("Erreur lors de la vérification de l'event", error);
            }
    }

    async getAllCategorieSerie(token){
        try {
            const response = await this.api.getAllCategorieSerie(token);
            console.log(response);
            return response;
        } catch (error) {
            console.error("Erreur lors de la vérification de l'event", error);
        }
    }
}
