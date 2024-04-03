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
                    const responses = await this.ajouterAmiModel.getFriendsRequests(sessionStorage.getItem("token"));
                    console.log(responses)
                    const requestExists = responses.some(request => request.receiver_id === suggestion.id);
                    if (requestExists) {
                        alert("Demande d'ami déjà envoyée");
                        return;
                    }

                    const data = {
                        idUser: suggestion.id
                    };
                    const responsesAdd = await this.ajouterAmiModel.ajouter(sessionStorage.getItem("token"), data);

                    document.getElementById('recherche').value = '';
                    document.getElementById("success").style.display = "block";
                    return;
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
        const container = document.querySelector('.friendsRequests');

        // Supprimer le contenu existant du conteneur
        container.innerHTML = '';

        let row;
        for (const demande of responses) {
            const index = responses.indexOf(demande);
            const senderInfo = await this.userModel.displaynamebyid(sessionStorage.getItem("token"), demande.sender_id);

            if (index % 5 === 0) {
                row = document.createElement('div');
                row.classList.add('row', 'mb-3');
                container.appendChild(row);
            }

            const card = document.createElement('div');
            card.classList.add('col-md-2');
            card.classList.add('m-3');

            card.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Notification de demande d'ami</h5>
                    <p class="card-text">Expéditeur: ${senderInfo[0].displayname}</p>
                    <p class="card-text">Message: ${demande.notification_message}</p>
                    <button class="btn btn-primary accepter m-1" data-id="${demande.id}">Accepter</button>
                    <button class="btn btn-danger refuser m-1" data-id="${demande.id}">Refuser</button>
                </div>
            </div>
        `;

            row.appendChild(card);
        }
    }


}

export default() => window.ajouterAmiController = new AjouterAmiController()