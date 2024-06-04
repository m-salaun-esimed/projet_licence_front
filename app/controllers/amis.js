import AmiModel from "../dataModel/amiModel.js";
import UserModel from "../dataModel/userModel.js";
import FavoriteModel from "../dataModel/favoriteModel.js";
import MoviesModel from "../dataModel/moviesModel.js";
import SerieModel from "../dataModel/serieModel.js";
import DejaVuModel from "../dataModel/dejaVuModel.js";

class AmiController {
    constructor() {
        this.ajouterAmiModel = new AmiModel()
        this.userModel = new UserModel()
        this.favoriteModel = new FavoriteModel();
        this.moviesModel = new MoviesModel()
        this.serieModel = new SerieModel()
        this.dejaVuModel = new DejaVuModel()
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
                     <div class="col-2 d-flex justify-content-end align-items-center">
                        <a class="btn btn-outline-primary" onclick="amiController.afficherFavorisUser(${friend.id}, '${friend.displayname}')">
                            <img src="/images/star.svg" alt="">
                        </a>
                    </div> 
                      <div class="col-2 d-flex justify-content-end align-items-center">
                        <a class="btn btn-outline-primary" onclick="amiController.afficherAlreadySeensUser(${friend.id}, '${friend.displayname}')">
                            <img src="/images/eye.svg" alt="">
                        </a>
                    </div> 
                    <div class="col-2 d-flex justify-content-end align-items-center">
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
        document.getElementById("nomFiltre").innerText = ''
        document.getElementById("nomFiltre").innerText = 'favoris'
        document.getElementById("userDisplayName").innerText = `${displayname}`
        const listFavorite = document.getElementById("listFavorite");
        const listFavoritePhone = document.getElementById("listFavoritePhone");
        let listDejaVu = document.getElementById("listDejaVu");
        let listDejaVuPhone = document.getElementById("listDejaVuPhone");

        document.getElementById("bodyFriends").style.display = "none";
        document.getElementById("bodyFriendsFavoris").style.display = "block";

        const loadingSpinner = document.getElementById("loadingSpinner");
        loadingSpinner.style.display = "flex";

        try {
            listFavorite.innerHTML = '';
            listFavoritePhone.innerHTML = '';
            listDejaVu.innerHTML = '';
            listDejaVuPhone.innerHTML = '';
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
                        <div class="col-12">
                            <a class="navbar__link" onclick="amiController.showModal(${favorite.idapi})">
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
                 
                            <div class="col-12">
                                <a class="navbar__link" onclick="amiController.showModal(${favorite.idapi})">
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

    async showModal(idapi){
        for(let i = 0 ; i < this.listeDeFav.length ; i++){
            if (this.listeDeFav[i].idapi === idapi){
                if (this.listeDeFav[i].typecontenu === "film"){
                    this.responseInfo = await this.moviesModel.getMovieByIdMovieApi(idapi)
                    this.responsePlatform = await this.moviesModel.getPlatforms(idapi, sessionStorage.getItem("token"))
                }
                else {
                    this.responseInfo = await this.serieModel.getSerieByIdSerieApi(idapi)
                    this.responsePlatform = await this.serieModel.getPlatforms(idapi, sessionStorage.getItem("token"))
                }
            }
        }
        var text = this.responseInfo[0].name;
        var modal = new bootstrap.Modal(document.getElementById('modalMovie'));
        modal.show();
        var infoMovie = document.querySelector('.nameMovie');
        infoMovie.innerText = text;
        var descriptionMovie = document.querySelector('.descriptionMovie');
        var descriptionMovietext = this.responseInfo[0].overview;
        descriptionMovie.innerText = descriptionMovietext;

        var imageMovie = document.querySelector('.imageMovie');
        if (imageMovie) {
            var imgElement = document.createElement('img');
            imgElement.src = 'https://image.tmdb.org/t/p/w500' + this.responseInfo[0].poster_path;
            imgElement.classList.add('img-fluid');
            imageMovie.innerHTML = '';
            imageMovie.appendChild(imgElement);
        } else {
            console.error("Element .imageMovie non trouvé");
        }

        var noteMovie = document.getElementsByClassName("noteMovie")[0];
        var noteMovieMovietext = this.responseInfo[0].note;
        noteMovie.innerHTML = '<div>' + noteMovieMovietext + '/10</div>';

        var modalFooter = document.querySelector('.modal-footer');
        modalFooter.innerHTML = '';

        if (this.responsePlatform && this.responsePlatform.flatrate) {
            const platformsData = this.responsePlatform.flatrate.slice(0, 3);

            let platformsHTML = '<div class="row">';
            platformsData.forEach(platform => {
                platformsHTML += `
            <div class="col-md-4 mt-1">
                <div class="card">
                    <div class="card-body">
                        <p class="card-title">${platform.provider_name}</p>
                        <img src="https://image.tmdb.org/t/p/w500/${platform.logo_path}" alt="${platform.provider_name} Logo" class="card-img-top" style="width: 20%;">
                    </div>
                </div>
            </div>`;
            });
            platformsHTML += '</div>'; // Fermeture de la div row

            const platformsElement = document.querySelector('.platforms');
            platformsElement.innerHTML = platformsHTML;
        }
        else {
            let platformsHTML = '';

            const platformsElement = document.querySelector('.platforms');
            platformsElement.innerHTML = platformsHTML;
            console.error("La réponse de l'API n'est pas valide ou les données des plateformes sont vides.");
        }

        modalFooter.appendChild(viewedButton);
    }

    async afficherAlreadySeensUser(id, displayname){
        document.getElementById("nomFiltre").innerText = ''
        document.getElementById("nomFiltre").innerText = 'déjà vu'

        let listDejaVu = document.getElementById("listDejaVu");
        let listDejaVuPhone = document.getElementById("listDejaVuPhone");
        const listFavorite = document.getElementById("listFavorite");
        const listFavoritePhone = document.getElementById("listFavoritePhone");

        document.getElementById("userDisplayName").innerText = `${displayname}`;
        document.getElementById("bodyFriends").style.display = "none";
        document.getElementById("bodyFriendsFavoris").style.display = "block";

        const loadingSpinner = document.getElementById("loadingSpinner");
        loadingSpinner.style.display = "flex";
        try {
            listFavorite.innerHTML = '';
            listFavoritePhone.innerHTML = '';
            listDejaVu.innerHTML = '';
            listDejaVuPhone.innerHTML = '';
            const loadingSpinner = document.getElementById("loadingSpinner");
            loadingSpinner.style.display = "flex";

            this.response = await this.dejaVuModel.getAllAlreadySeenMovieId(id);
            console.log(this.response)

            let row = document.createElement("div");
            row.classList.add("row");

            for (const dejaVu of this.response) {
                if (dejaVu.typecontenu === 'film') {
                    this.responseInfo = await this.moviesModel.getMovieByIdMovieApi(dejaVu.idapi);
                } else {
                    this.responseInfo = await this.serieModel.getSerieByIdSerieApi(dejaVu.idapi);
                }
                console.log(this.responseInfo);

                let col = document.createElement("div");
                col.classList.add("col-6", "col-sm-4", "col-md-3", "col-lg-2", "mb-2");

                let card = document.createElement("div");
                card.classList.add("card", "h-100");
                card.style.borderColor = "white"
                card.style.backgroundColor = "black"
                card.innerHTML = `
                <div class="card-body text-center">
                    <div class="card-content">
                        <div class="row">
                            <div>
                                <img src="https://image.tmdb.org/t/p/w500${this.responseInfo[0].poster_path}" class="card-img rounded" alt="Image" style="width: 70%">
                            </div>
                        </div>
                    </div>
                </div>
            `;

                col.appendChild(card);
                row.appendChild(col);
            }

            listDejaVu.appendChild(row);

            // Second loop for listDejaVuPhone
            for (const dejaVu of this.response) {
                if (dejaVu.typecontenu === 'film') {
                    this.responseInfo = await this.moviesModel.getMovieByIdMovieApi(dejaVu.idapi);
                } else {
                    this.responseInfo = await this.serieModel.getSerieByIdSerieApi(dejaVu.idapi);
                }
                console.log(this.responseInfo);

                let rowPhone = document.createElement("div");
                rowPhone.classList.add("row", "mb-2");

                let cardPhone = document.createElement("div");
                cardPhone.classList.add("card");
                cardPhone.style.backgroundColor = "black";
                cardPhone.innerHTML = `
                <div class="row no-gutters">
                    <div class="col-4">
                        <img src="https://image.tmdb.org/t/p/w500${this.responseInfo[0].poster_path}" class="card-img" alt="Image" style="border-radius: 24px">
                    </div>
                </div>
            `;

                rowPhone.appendChild(cardPhone);
                listDejaVuPhone.appendChild(rowPhone);
            }

            loadingSpinner.style.display = "none";
        } catch (error) {
            console.error("An error occurred while fetching and displaying already seen movies:", error);
        }
    }
}

export default() => window.amiController = new AmiController()