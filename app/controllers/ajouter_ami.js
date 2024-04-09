import AjouterAmiModel from "../dataModel/ajouterAmiModel.js";
import UserModel from "../dataModel/userModel.js";

class AjouterAmiController {
    constructor() {
        this.ajouterAmiModel = new AjouterAmiModel()
        this.userModel = new UserModel()
        this.recherche = ""
        document.getElementById("success").style.display = "none"
        const rechercheInput = document.getElementById('recherche');
        rechercheInput.addEventListener('input', this.autocomplete.bind(this));
        this.afficherLesDemandes()
        this.afficherLesAmis()
    }
    async autocomplete(event) {
        this.recherche = event.target.value.trim();

        if (this.recherche.length === 0) {
            this.clearAutocompleteResults();
            return;
        }

        try {
            this.suggestions = await this.ajouterAmiModel.getSuggestions(sessionStorage.getItem("token"), this.recherche);
            console.log(this.suggestions)
            this.renderAutocompleteResults(this.suggestions);

        } catch (error) {
            console.error(error);
        }
    }

    renderAutocompleteResults(suggestions) {
        const autocompleteList = document.querySelector('.autocomplete-results');
        autocompleteList.innerHTML = '';

        suggestions.forEach(suggestion => {
            const listItem = document.createElement('li');
            listItem.textContent = suggestion.displayname;
            listItem.addEventListener('click', () => {
                document.getElementById('recherche').value = suggestion.displayname;
                this.clearAutocompleteResults();
            });
            autocompleteList.appendChild(listItem);
        });
    }

    clearAutocompleteResults() {
        const autocompleteList = document.querySelector('.autocomplete-results');
        autocompleteList.innerHTML = '';
    }

    async ajouter() {
        const displayName = document.getElementById("recherche").value;

        for (const suggestion of this.suggestions) {
            if (suggestion.displayname === displayName) {
                try {
                    const responsesSend = await this.ajouterAmiModel.getFriendsRequestsSend(sessionStorage.getItem("token"));

                    const requestExists = responsesSend.some(request => request.receiver_id === suggestion.id && (request.status !== 'accepted' || request.status !== 'pending'));

                    console.log("requestExists " + requestExists)
                    if (requestExists) {
                        alert("Demande d'ami déjà envoyée ou acceptée");
                        return;
                    }
                    else {
                        const data = {
                            idUser: suggestion.id
                        };
                        const responsesAdd = await this.ajouterAmiModel.ajouter(sessionStorage.getItem("token"), data);

                        document.getElementById('recherche').value = '';
                        document.getElementById("success").style.display = "block";
                        return;
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        }
    }


    roulettePage(){
        navigate("rouletteAleatoire")
    }

    async afficherLesDemandes() {
        const responses = await this.ajouterAmiModel.afficherLesDemandes(sessionStorage.getItem("token"));
        console.log("responses : " + responses)
        const container = document.querySelector('.friendsRequests');

        container.innerHTML = '';

        let row;
        for (const demande of responses) {
            const index = responses.indexOf(demande);
            const senderInfo = await this.userModel.displaynamebyid(sessionStorage.getItem("token"), demande.sender_id);
            const notification = await  this.ajouterAmiModel.getNotificationById(sessionStorage.getItem("token"), demande.notification_id)
            if (index % 2 === 0) {
                row = document.createElement('div');
                row.classList.add('row', 'mb-3');
                container.appendChild(row);
            }

            const card = document.createElement('div');
            card.classList.add('col-md-6');
            card.classList.add('m-3');

            // Formater la date et l'heure
            const sentAtDate = new Date(demande.sent_at);
            const options = { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric" };
            const sentAtFormatted = sentAtDate.toLocaleDateString("fr-FR", options);

            card.innerHTML = `    
            <div class="card">
                <div class="card-body">
                    <div class="row">
                        <div class="col">
                            <p class="card-text">Demande de: ${senderInfo[0].displayname}</p>
                        </div>
                        <div class="col">
                            <p class="card-text">Envoyée le : 
<br>${sentAtFormatted}</p>
                        </div>
                    </div>
                    <button class="btn btn-primary accepter m-1" data-id="${demande.id}" onclick="ajouterAmiController.accepterDemande(${demande.id}, ${notification[0].id})">Accepter</button>
                    <button class="btn btn-danger refuser m-1" data-id="${demande.id}" onclick="ajouterAmiController.refuserDemande(${demande.id}, ${notification[0].id})">Refuser</button>
                </div>
            </div>
        `;

            row.appendChild(card);
        }
    }



    async afficherLesAmis() {
        try {
            const friends = await this.ajouterAmiModel.getFriends(sessionStorage.getItem("token"));
            const friendsContainer = document.querySelector('.friends');
            friendsContainer.innerHTML = ""
            for (let i = 0; i < friends.length; i++) {
                const friend = friends[i][0];

                const card = document.createElement('div');
                card.classList.add('card');
                card.classList.add('mb-3');

                card.innerHTML = `
                <div class="card-body">
                    <div class="row">
                        <div class="col-6">
                            <h5 class="card-title">${friend.displayname}</h5>
                        </div>
                        <div class="col-6">
                            <button class="btn btn-outline-danger" onclick="ajouterAmiController.deleteFriend(${friend.id})"><img src="/images/x-lg.svg" alt=""></button>
                        </div> 
                    </div>
                </div>
            `;

                friendsContainer.appendChild(card);
            }
        } catch (error) {
            console.error(error);
        }
    }




    async accepterDemande(friendRequestId, notificationId){
        console.log("accepter : " + friendRequestId + " notificationId : " + notificationId )
        await this.ajouterAmiModel.accpeterDemande(sessionStorage.getItem("token"),friendRequestId,notificationId);
        alert("demande d'ami acceptée")
        this.afficherLesDemandes()
        this.afficherLesAmis()

    }

    async refuserDemande(friendRequestId, notificationId){
        console.log("refuser : " + friendRequestId + " notificationId : " + notificationId )
        await this.ajouterAmiModel.refuserDemande(sessionStorage.getItem("token"),friendRequestId,notificationId);
        alert("demande d'ami refusé")
        this.afficherLesDemandes()
    }

    async deleteFriend(iduser){
        console.log("deleteFriend : " + iduser)
        await this.ajouterAmiModel.deleteFriend(sessionStorage.getItem("token"), iduser);
        this.afficherLesAmis()
    }
}

export default() => window.ajouterAmiController = new AjouterAmiController()