import AmiModel from "../dataModel/amiModel.js";
import UserModel from "../dataModel/userModel.js";

class AmiController {
    constructor() {
        this.ajouterAmiModel = new AmiModel()
        this.userModel = new UserModel()

        this.afficherLesAmis()
        this.init();
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
    async init(){
        const responses = await this.ajouterAmiModel.afficherLesDemandes(sessionStorage.getItem("token"));
        var badge = document.getElementById("notification");
        badge.innerText = `${responses.length}`
    }
    async afficherLesAmis() {
        try {
            const friends = await this.ajouterAmiModel.getFriends(sessionStorage.getItem("token"));
            const friendsContainer = document.querySelector('.friends');
            friendsContainer.innerHTML = "";
            document.getElementById("nbrFriends").innerText = friends.length

            for (let i = 0; i < friends.length; i++) {
                const friend = friends[i][0];

                const card = document.createElement('div');
                card.classList.add('card');
                card.classList.add('mb-3');

                card.innerHTML = `
                <div class="card-body">
                    <div class="row">
                        <div class="col-9 d-flex align-items-center">
                            <h5 class="card-title mb-0">${friend.displayname}</h5>
                        </div>
                        <div class="col-3 d-flex justify-content-end align-items-center">
                            <button class="btn btn-outline-danger" onclick="ajouterAmiController.deleteFriend(${friend.id})">
                                <img src="/images/trash-2.svg" alt="">
                            </button>
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

    addFriendsPage(){
        navigate("ajouter_ami");
    }
    addFriendsNotificationsPage(){
        navigate("addFriendsNotifications");
    }
}

export default() => window.amiController = new AmiController()