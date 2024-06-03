import DejaVuModel from "../dataModel/dejaVuModel.js";
import UserModel from "../dataModel/userModel.js";
import MoviesModel from "../dataModel/moviesModel.js";
import SerieModel from "../dataModel/serieModel.js";

class DejaVu {
    constructor() {
        this.dejaVuModel = new DejaVuModel()
        this.userModel = new UserModel()
        this.moviesModel = new MoviesModel()
        this.serieModel = new SerieModel()
        this.init()
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
    async init() {
        const listFavorite = document.getElementById("listDejaVu");
        const listFavoritePhone = document.getElementById("listDejaVuPhone");
        document.getElementById("filtresErase").style.display = "none"
        document.getElementById("filtre").style.display = "block"
        try {

            listFavorite.innerHTML = '';
            listFavoritePhone.innerHTML = '';
            document.getElementById("filtreEnCours").innerText = '';

            let listDejaVu = document.getElementById("listDejaVu");
            let listDejaVuPhone = document.getElementById("listDejaVuPhone");
            const loadingSpinner = document.getElementById("loadingSpinner");

            // Show the spinner
            loadingSpinner.style.display = "flex";

            this.response = await this.dejaVuModel.getAllAlreadySeenMovie();

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
                                <img src="https://image.tmdb.org/t/p/w500${this.responseInfo[0].poster_path}" class="card-img rounded" alt="Image" style="width: 50%">
                            </div>
                        </div>    
                        <div class="row mt-2">
                            <div class="col-6">
                                <a class="navbar__link" onclick="dejaVu.removeDejaVu(${dejaVu.idapi}, '${dejaVu.typecontenu}')">
                                    <img src="../images/eyeWhite.svg" alt="Favori">
                                    <span style="z-index: 9999">Supprimer des déjà vu</span>
                                </a>
                            </div>
                            <div class="col-6">
                                <a class="navbar__link" onclick="dejaVu.showModalMovie(${dejaVu.idapi}, '${dejaVu.typecontenu}')">
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
                    <div class="col-8">
                        <div class="card-body d-flex align-items-center">
                            <h5 class="card-title" style="color: white; flex-grow: 1;">${this.responseInfo[0].name}</h5>
                            <div class="d-flex">
                                <a class="navbar__link" onclick="dejaVu.removeDejaVu(${dejaVu.idapi}, '${dejaVu.typecontenu}')">
                                    <img src="../images/eyeWhite.svg" alt="Favori">
                                </a>
                                <a class="navbar__link" onclick="dejaVu.showModalMovie(${dejaVu.idapi}, '${dejaVu.typecontenu}')">
                                    <img src="../images/infoWhite.svg" alt="Favori">
                                </a>
                            </div>
                        </div>
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




    async removeDejaVu(movieidapi, typecontenu) {
        console.log(typecontenu)
        try {
            console.log("removeFavorite " + movieidapi);
            const response = await this.dejaVuModel.removeDejaVuMovie(sessionStorage.getItem("token"), movieidapi, typecontenu);
            console.log(response);
            alert("Le film a été supprimé avec succès des déjà vu.");
            navigate("dejaVu");
            console.log(movieidapi);
        } catch (error) {
            console.error("Erreur lors de la suppression du film des déjà vu :", error);
            alert("Une erreur est survenue lors de la suppression du film des déjà vu. Veuillez réessayer plus tard.");
        }
    }


    async showModalMovie(idapi, typecontenu){
            console.log(typecontenu)
            if (typecontenu === 'film'){
                this.responseInfo = await this.moviesModel.getMovieByIdMovieApi(idapi)
                this.responsePlatform = await this.moviesModel.getPlatforms(idapi, sessionStorage.getItem("token"))
            }
            else {
                this.responseInfo = await this.serieModel.getSerieByIdSerieApi(idapi)
                this.responsePlatform = await this.serieModel.getPlatforms(idapi, sessionStorage.getItem("token"))

            }
            console.log(this.responseInfo)
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
            platformsHTML += '</div>';

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

    async adminPage(){
        try {
            const response = await this.userModel.refreshToken(sessionStorage.getItem("token"));
            console.log(response)
            if (!response.token) {
                throw new Error("La requête a échoué avec le statut : " + response.status);
            }

            const token = response.token;
            console.log(token);
            sessionStorage.setItem("token", "Bearer " + token);
            console.log("refresh");
            navigate("admin");
        } catch (error) {
            console.error("Une erreur s'est produite lors de la récupération du token :", error);
        }
    }

    redirectionHomePage(){
        navigate("rouletteAleatoire")
    }

    friendsPage(){
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            const modalInstance = bootstrap.Modal.getInstance(modal);
            if (modalInstance) {
                modalInstance.hide();
            }
        });
        setTimeout(() => {
            navigate("amis")
        }, 300);
    }

    actualitePage(){
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            const modalInstance = bootstrap.Modal.getInstance(modal);
            if (modalInstance) {
                modalInstance.hide();
            }
        });
        setTimeout(() => {
            navigate("actualitePage")
        }, 300);
    }

    addFriendsNotificationsPage(){
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            const modalInstance = bootstrap.Modal.getInstance(modal);
            if (modalInstance) {
                modalInstance.hide();
            }
        });
        setTimeout(() => {
            navigate("addFriendsNotifications");
        }, 300);
    }
    ajouter_ami(){
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            const modalInstance = bootstrap.Modal.getInstance(modal);
            if (modalInstance) {
                modalInstance.hide();
            }
        });
        setTimeout(() => {
            navigate("ajouter_ami");
        }, 300);
    }

    async alreadyseenPage(){
        try {
            const response = await this.userModel.refreshToken(sessionStorage.getItem("token"));
            console.log(response)
            if (!response.token) {
                throw new Error("La requête a échoué avec le statut : " + response.status);
            }

            const token = response.token;
            console.log(token);
            sessionStorage.setItem("token", "Bearer " + token);
            console.log("refresh");
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                const modalInstance = bootstrap.Modal.getInstance(modal);
                if (modalInstance) {
                    modalInstance.hide();
                }
            });
            setTimeout(() => {
                navigate("dejavu");
            }, 300);
        } catch (error) {
            console.error("Une erreur s'est produite lors de la récupération du token :", error);
        }
    }

    async favoriPage() {
        try {
            const response = await this.userModel.refreshToken(sessionStorage.getItem("token"));
            console.log(response)
            if (!response.token) {
                throw new Error("La requête a échoué avec le statut : " + response.status);
            }

            const token = response.token;
            console.log(token);
            sessionStorage.setItem("token", "Bearer " + token);
            console.log("refresh");
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                const modalInstance = bootstrap.Modal.getInstance(modal);
                if (modalInstance) {
                    modalInstance.hide();
                }
            });
            setTimeout(() => {
                navigate("favori");
            }, 300);
        } catch (error) {
            console.error("Une erreur s'est produite lors de la récupération du token :", error);
        }
    }

    async filreFilm(){
        const filtresElements = document.querySelectorAll('.filtres');
        filtresElements.forEach(element => {
            element.style.display = 'none';
        });
        document.getElementById("filtreEnCours").innerText = "films";
        document.getElementById("filtresErase").style.display = "block"
        document.getElementById("filtre").style.display = "none"

        const listFavorite = document.getElementById("listDejaVu");
        const listFavoritePhone = document.getElementById("listDejaVuPhone");
        const loadingSpinner = document.getElementById("loadingSpinner");

        // Show the spinner
        loadingSpinner.style.display = "flex";

        try {
            listFavorite.innerHTML = '';
            listFavoritePhone.innerHTML = '';
            this.liste = await this.dejaVuModel.getAllAlreadySeenMovie();
            console.log(this.listeDeFav);

            let row = document.createElement("div");
            row.classList.add("row");

            for (const dejaVu of this.liste) {
                if (dejaVu.typecontenu === 'film') {
                    this.responseInfo = await this.moviesModel.getMovieByIdMovieApi(dejaVu.idapi);

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
                            <a class="navbar__link" onclick="dejaVu.removeDejaVu(${dejaVu.idapi}, 'film')">
                                <img src="../images/trash-2-white.svg" alt="Favori">
                                <span style="z-index: 9999">Supprimer de la liste</span>
                            </a>
                        </div>
                        <div class="col-6">
                            <a class="navbar__link" onclick="dejaVu.showModalMovie(${dejaVu.idapi}, 'film')">
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
                }}

            listFavorite.appendChild(row);

            // Second loop for listFavoritePhone
            for (const dejaVu of this.listeDeFav) {
                if (dejaVu.typecontenu === 'film') {
                    this.responseInfo = await this.moviesModel.getMovieByIdMovieApi(dejaVu.idapi);
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
                                <a class="navbar__link" onclick="dejaVu.removeDejaVu(${dejaVu.idapi}, 'film')">
                                    <img src="../images/trash-2-white.svg" alt="Favori">
                                    <span style="z-index: 9999">Supprimer de la liste</span>
                                </a>
                            </div>
                            <div class="col-6">
                                <a class="navbar__link" onclick="dejaVu.showModalMovie(${dejaVu.idapi}, 'film')">
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
                }}

        } catch (error) {
            console.error("An error occurred while fetching favorites:", error);
        } finally {
            console.log("test");
            loadingSpinner.style.display = "none";
        }
    }

    async filreSerie(){
        const filtresElements = document.querySelectorAll('.filtres');
        document.getElementById("filtresErase").style.display = "block"
        document.getElementById("filtre").style.display = "none"

        filtresElements.forEach(element => {
            element.style.display = 'none';
        });
        document.getElementById("filtreEnCours").innerText = "Séries";

        const listFavorite = document.getElementById("listDejaVu");
        const listFavoritePhone = document.getElementById("listDejaVuPhone");
        const loadingSpinner = document.getElementById("loadingSpinner");

        // Show the spinner
        loadingSpinner.style.display = "flex";

        try {
            listFavorite.innerHTML = '';
            listFavoritePhone.innerHTML = '';
            const responseIdUser = await this.userModel.getIdUser(sessionStorage.getItem("token"), localStorage.getItem("login"));
            this.listeDeFav = await this.dejaVuModel.getAllAlreadySeenMovie();
            console.log(this.listeDeFav);

            let row = document.createElement("div");
            row.classList.add("row");

            for (const dejaVu of this.listeDeFav) {
                if (dejaVu.typecontenu === 'serie') {
                    this.responseInfo = await this.serieModel.getSerieByIdSerieApi(dejaVu.idapi);

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
                            <a class="navbar__link" onclick="dejaVu.removeDejaVu(${dejaVu.idapi},'serie')">
                                <img src="../images/trash-2-white.svg" alt="Favori">
                                <span style="z-index: 9999">Supprimer de la liste</span>
                            </a>
                        </div>
                        <div class="col-6">
                            <a class="navbar__link" onclick="dejaVu.showModalMovie(${dejaVu.idapi}, 'serie')">
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
                }}

            listFavorite.appendChild(row);

            // Second loop for listFavoritePhone
            for (const dejaVu of this.listeDeFav) {
                if (dejaVu.typecontenu === 'serie') {
                    this.responseInfo = await this.serieModel.getSerieByIdSerieApi(dejaVu.idapi);
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
                                <a class="navbar__link" onclick="dejaVu.removeDejaVu(${dejaVu.idapi}, 'serie')">
                                    <img src="../images/trash-2-white.svg" alt="Favori">
                                    <span style="z-index: 9999">Supprimer de la liste</span>
                                </a>
                            </div>
                            <div class="col-6">
                                <a class="navbar__link" onclick="dejaVu.showModalMovie(${dejaVu.idapi}, 'serie')">
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
                }}

        } catch (error) {
            console.error("An error occurred while fetching favorites:", error);
        } finally {
            console.log("test");
            loadingSpinner.style.display = "none";
        }
    }

    showFiltres() {
        const filtresElements = document.querySelectorAll('.filtres');
        filtresElements.forEach(element => {
            if (element.classList.contains('show')) {
                element.classList.remove('show');
                setTimeout(() => {
                    element.style.display = 'none';
                }, 500); // Delay matches the CSS transition duration
            } else {
                element.style.display = 'block';
                setTimeout(() => {
                    element.classList.add('show');
                }, 10); // Small delay to allow the display change to take effect
            }
        });
    }
}

export default() => window.dejaVu = new DejaVu()