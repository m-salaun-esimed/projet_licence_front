import CategorieRoute from "../services/categorieRoute.js";

export default class userModel {
    constructor() {
        this.api = new CategorieRoute();
    }

    async getAllCategorieMovie(){
        try {
            const response = await this.api.getAllCategorieMovie();
            console.log(response);
            return response;
        } catch (error) {
            console.error("Erreur lors de la vérification de l'event", error);
        }
    }
}
