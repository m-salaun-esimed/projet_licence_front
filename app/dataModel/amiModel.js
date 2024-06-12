import AmiRoute from "../services/amiRoute.js";

export default class AmiModel {
    constructor() {
        this.api = new AmiRoute();
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

    async getFriendsRequestsSend(token){
        try {
            const response = await this.api.getFriendsRequestsSend(token);
            console.log(response);
            return response;
        } catch (error) {
            console.error("Erreur lors de la vérification de l'event", error);
        }
    }

    async getFriendsRequestsReceived(token){
        try {
            const response = await this.api.getFriendsRequestsReceived(token);
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

    async getNotificationById(token, notification_id){
        try {
            const response = await this.api.getNotificationById(token, notification_id);
            console.log(response);
            return response;
        } catch (error) {
            console.error("Erreur lors de la vérification de l'event", error);
        }
    }
    async getFriends(token){
        try {
            const response = await this.api.getFriends(token);
            console.log(response);
            return response;
        } catch (error) {
            console.error("Erreur lors de la vérification de l'event", error);
        }
    }

    async accpeterDemande(token, friendRequestId,notificationId){
        try {
            const response = await this.api.accpeterDemande(token, friendRequestId,notificationId);
            console.log(response);
            return response;
        } catch (error) {
            console.error("Erreur lors de la vérification de l'event", error);
        }
    }
    async refuserDemande(token, friendRequestId,notificationId){
        try {
            const response = await this.api.refuserDemande(token, friendRequestId,notificationId);
            console.log(response);
            return response;
        } catch (error) {
            console.error("Erreur lors de la vérification de l'event", error);
        }
    }

    async deleteFriend(token, iduser){
        try {
            const response = await this.api.deleteFriend(token, iduser);
            console.log(response);
            return response;
        } catch (error) {
            console.error("Erreur lors du delete", error);
        }
    }

}
