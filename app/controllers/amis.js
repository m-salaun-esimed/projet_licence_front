import AmiModel from "../dataModel/amiModel.js";
import UserModel from "../dataModel/userModel.js";
import FavoriteModel from "../dataModel/favoriteModel.js";
import MoviesModel from "../dataModel/moviesModel.js";
import SerieModel from "../dataModel/serieModel.js";
class AmiController {
    constructor() {
        this.ajouterAmiModel = new AmiModel()
        this.userModel = new UserModel()
        this.favoriteModel = new FavoriteModel();
        this.moviesModel = new MoviesModel()
        this.serieModel = new SerieModel()
        this.afficherLesAmis()
        this.init();
        this.verifyAdmin();
        document.getElementById("bodyFriendsFavoris").style.display = "none"
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
                    <div class="col-6 d-flex align-items-center">
                        <h5 class="card-title mb-0">${friend.displayname}</h5>
                    </div>
                      <div class="col-3 d-flex justify-content-end align-items-center">
                        <a class="btn btn-outline-primary" onclick="amiController.afficherFavorisUser(${friend.id}, '${friend.displayname}')">

                            <img src="/images/star.svg" alt="">
                        </a>
                    </div> 
                     
                    <div class="col-3 d-flex justify-content-end align-items-center">
                        <button class="btn btn-outline-danger" onclick="amiController.deleteFriend(${friend.id})">
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

    async afficherFavorisUser(id, displayname){
        document.getElementById("userDisplayName").innerText = `${displayname}`
        const listFavorite = document.getElementById("listFavorite");
        const listFavoritePhone = document.getElementById("listFavoritePhone");

        document.getElementById("bodyFriends").style.display = "none";
        document.getElementById("bodyFriendsFavoris").style.display = "block";

        const loadingSpinner = document.getElementById("loadingSpinner");
        loadingSpinner.style.display = "flex";

        try {
            listFavorite.innerHTML = '';
            listFavoritePhone.innerHTML = '';
            this.listeDeFav =  await this.favoriteModel.afficherFavorisUser(id);
            console.log(this.listeDeFav);

            let row = document.createElement("div");
            row.classList.add("row");

            for (const favorite of this.listeDeFav) {
                if (favorite.typecontenu === 'film') {
                    this.responseInfo = await this.moviesModel.getMovieByIdMovieApi(favorite.idapi);
                } else {
                    this.responseInfo = await this.serieModel.getSerieByIdSerieApi(favorite.idapi);
                }
                console.log(this.responseInfo);

                let col = document.createElement("div");
                col.classList.add("col-6", "col-sm-4", "col-md-3", "col-lg-2", "mb-2"); // Adjusted to make the cards smaller

                let card = document.createElement("div");
                card.classList.add("card", "h-100");
                card.style.backgroundColor = "black"
                card.style.borderColor = "white"
                card.innerHTML = `
            <div class="card-body text-center">
                <div class="card-content">
                    <div class="row">
                        <div>
                            <img src="https://image.tmdb.org/t/p/w500${this.responseInfo[0].poster_path}" class="card-img rounded" alt="Image" style="width: 70%"><!-- Adjusted the width to make the image smaller -->
                        </div>
                    </div>
                    <div class="row mt-2">
                        <div class="col-6">
                            <a class="navbar__link" onclick="rouletteAleatoire.removeFavorite(${favorite.idapi})">
                                <img src="../images/trash-2-white.svg" alt="Favori">
                                <span style="z-index: 9999">Supprimer de la liste</span>
                            </a>
                        </div>
                        <div class="col-6">
                            <a class="navbar__link" onclick="favori.showModal(${favorite.idapi})">
                                <img src="../images/infoWhite.svg" alt="Favori">
                                <span style="z-index: 9999">Information</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            `;

                col.appendChild(card);
                row.appendChild(col);
            }

            listFavorite.appendChild(row);

            // Second loop for listFavoritePhone
            for (const favorite of this.listeDeFav) {
                if (favorite.typecontenu === 'film') {
                    this.responseInfo = await this.moviesModel.getMovieByIdMovieApi(favorite.idapi);
                } else {
                    this.responseInfo = await this.serieModel.getSerieByIdSerieApi(favorite.idapi);
                }
                console.log(this.responseInfo);

                let rowPhone = document.createElement("div");
                rowPhone.classList.add("row", "mb-2");

                let cardPhone = document.createElement("div");
                cardPhone.classList.add("card");
                cardPhone.style.backgroundColor = "black"
                cardPhone.innerHTML = `
            <div class="row no-gutters">
                <div class="col-4">
                    <img src="https://image.tmdb.org/t/p/w500${this.responseInfo[0].poster_path}" class="card-img" alt="Image" style="border-radius: 24px">
                </div>
                <div class="col-8">
                    <div class="card-body">
                        <h5 class="card-title" style="color: white">${this.responseInfo[0].name}</h5>
                        <div class="row mt-2">
                            <div class="col-6">
                                <a class="navbar__link" onclick="rouletteAleatoire.removeFavorite(${favorite.idapi})">
                                    <img src="../images/trash-2-white.svg" alt="Favori">
                                    <span style="z-index: 9999">Supprimer de la liste</span>
                                </a>
                            </div>
                            <div class="col-6">
                                <a class="navbar__link" onclick="favori.showModal(${favorite.idapi})">
                                    <img src="../images/infoWhite.svg" alt="Favori">
                                    <span style="z-index: 9999">Information</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;

                rowPhone.appendChild(cardPhone);
                listFavoritePhone.appendChild(rowPhone);
            }

        } catch (error) {
            console.error("An error occurred while fetching favorites:", error);
        } finally {
            console.log("test");
            loadingSpinner.style.display = "none";
        }
    }

    async deleteFriend(iduser){
        console.log("deleteFriend : " + iduser)
        await this.ajouterAmiModel.deleteFriend(sessionStorage.getItem("token"), iduser);
        this.afficherLesAmis()
    }

    eraseFavoris(){
        document.getElementById("bodyFriendsFavoris").style.display = "none";
        document.getElementById("bodyFriends").style.display = "block";
    }
}

export default() => window.amiController = new AmiController()