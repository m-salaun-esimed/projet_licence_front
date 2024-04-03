import AjouterAmiRoute from "../services/ajouterAmiRoute.js";

export default class AjouterAmiModel {
    constructor() {
        this.api = new AjouterAmiRoute();
    }

    async getSuggestions(token, recherche){
        try {
            const response = await this.api.getSuggestions(token, recherche);
            console.log(response);
            return response;
        } catch (error) {
            console.error("Erreur lors de la vérification de l'event", error);
        }
    }

    async ajouter(token, data){
        try {
            const response = await this.api.ajouter(token, data);
            console.log(response);
            return response;
        } catch (error) {
            console.error("Erreur lors de la vérification de l'event", error);
        }
    }

    async getFriendsRequests(token){
        try {
            const response = await this.api.getFriendsRequests(token);
            console.log(response);
            return response;
        } catch (error) {
            console.error("Erreur lors de la vérification de l'event", error);
        }
    }

    async afficherLesDemandes(token){
        try {
            const response = await this.api.afficherLesDemandes(token);
            console.log(response);
            return response;
        } catch (error) {
            console.error("Erreur lors de la vérification de l'event", error);
        }
    }
}
