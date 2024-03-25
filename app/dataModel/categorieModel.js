import CategorieRoute from "../services/categorieRoute.js";
import UserModel from "./userModel.js";

export default class CategorieModel {
    constructor() {
        this.api = new CategorieRoute();
        this.userModel = new UserModel();
    }

    async getAllCategorieMovie(token){
        const response = await this.userModel.verifyToken(token)
        if (response.status === 200) {
            try {
                const response = await this.api.getAllCategorieMovie();
                console.log(response);
                return response;
            } catch (error) {
                console.error("Erreur lors de la vérification de l'event", error);
            }
        }
        else{
            sessionStorage.removeItem("token")
            navigate("index")
        }

    }
}
