import AmiModel from "../dataModel/amiModel.js";
import UserModel from "../dataModel/userModel.js";

class FriendsNotification {
    constructor() {
        this.ajouterAmiModel = new AmiModel()
        this.userModel = new UserModel()
        this.afficherLesDemandes();
        this.verifyAdmin();

    }

    async verifyAdmin(){
        const responseIdUser = await this.userModel.getIdUser(sessionStorage.getItem("token"), localStorage.getItem("login"))
        const estAdmin = await this.userModel.verifyEstAdmin(responseIdUser[0].id);
        console.log(estAdmin[0].admin)
        sessionStorage.setItem("admin", estAdmin[0].admin)
        if (sessionStorage.getItem("admin") === "true") {
            document.getElementById("admin").style.display = "block";
        } else {
            document.getElementById("admin").style.display = "none";
        }
    }
    async afficherLesDemandes() {
        const responses = await this.ajouterAmiModel.afficherLesDemandes(sessionStorage.getItem("token"));
        console.log("responses : " + responses)
        const container = document.querySelector('.friendsRequests');

        container.innerHTML = '';

        let row;
        for (let i = 0; i < responses.length; i += 2) {
            row = document.createElement('div');
            row.classList.add('row', 'mb-3');
            container.appendChild(row);

            for (let j = 0; j < 2 && (i + j) < responses.length; j++) {
                const demande = responses[i + j];
                const senderInfo = await this.userModel.displaynamebyid(sessionStorage.getItem("token"), demande.sender_id);
                const notification = await this.ajouterAmiModel.getNotificationById(sessionStorage.getItem("token"), demande.notification_id)

                const card = document.createElement('div');
                card.classList.add('col-12');
                card.classList.add('m-3');

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
                                <p class="card-text">Envoyée le : <br>${sentAtFormatted}</p>
                            </div>
                        </div>
                        <button class="btn btn-primary accepter m-1" data-id="${demande.id}" onclick="friendsNotification.accepterDemande(${demande.id}, ${notification[0].id})"><img src="/images/user-check.svg" alt=""></button>
                        <button class="btn btn-danger refuser m-1" data-id="${demande.id}" onclick="friendsNotification.refuserDemande(${demande.id}, ${notification[0].id})"><img src="/images/user-x.svg" alt=""></button>
                    </div>
                </div>
            `;

                row.appendChild(card);
            }
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
}

export default() => window.friendsNotification = new FriendsNotification()