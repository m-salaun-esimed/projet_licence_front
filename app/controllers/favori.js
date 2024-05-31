import FavoriteModel from "../dataModel/favoriteModel.js";
import UserModel from "../dataModel/userModel.js";
import MoviesModel from "../dataModel/moviesModel.js";
import SerieModel from "../dataModel/serieModel.js";
class Favori {
    constructor() {
        this.favoriteModel = new FavoriteModel()
        this.userModel = new UserModel()
        this.moviesModel = new MoviesModel()
        this.serieModel = new SerieModel()
        this.verifyAdmin();
        this.init()
        const filtresElements = document.querySelectorAll('.filtres');
        filtresElements.forEach(element => {
            element.style.display = 'none';
        });
    }

    async init() {
        const listFavorite = document.getElementById("listFavorite");
        const listFavoritePhone = document.getElementById("listFavoritePhone");
        const loadingSpinner = document.getElementById("loadingSpinner");

        // Show the spinner
        loadingSpinner.style.display = "flex";

        try {
            listFavorite.innerHTML = '';
            listFavoritePhone.innerHTML = '';
            const responseIdUser = await this.userModel.getIdUser(sessionStorage.getItem("token"), localStorage.getItem("login"));
            this.listeDeFav = await this.favoriteModel.getAllFavorite(responseIdUser[0].id);
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

    async showModal(idapi){
        for(let i = 0 ; i < this.listeDeFav.length ; i++){
            if (this.listeDeFav[i].idapi === idapi){
                if (this.listeDeFav[i].typecontenu === "film"){
                    this.responseInfo = await this.moviesModel.getMovieByIdMovieApi(idapi)
                }
                else {
                    this.responseInfo = await this.serieModel.getSerieByIdSerieApi(idapi)
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

        modalFooter.appendChild(viewedButton);
    }

    async filreFilm(){
        const listFavorite = document.getElementById("listFavorite");
        const listFavoritePhone = document.getElementById("listFavoritePhone");
        const loadingSpinner = document.getElementById("loadingSpinner");

        // Show the spinner
        loadingSpinner.style.display = "flex";

        try {
            listFavorite.innerHTML = '';
            listFavoritePhone.innerHTML = '';
            const responseIdUser = await this.userModel.getIdUser(sessionStorage.getItem("token"), localStorage.getItem("login"));
            this.listeDeFav = await this.favoriteModel.getAllFavorite(responseIdUser[0].id);
            console.log(this.listeDeFav);

            let row = document.createElement("div");
            row.classList.add("row");

            for (const favorite of this.listeDeFav) {
                if (favorite.typecontenu === 'film') {
                    this.responseInfo = await this.moviesModel.getMovieByIdMovieApi(favorite.idapi);

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
            }}

            listFavorite.appendChild(row);

            // Second loop for listFavoritePhone
            for (const favorite of this.listeDeFav) {
                if (favorite.typecontenu === 'film') {
                    this.responseInfo = await this.moviesModel.getMovieByIdMovieApi(favorite.idapi);
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
            }}

        } catch (error) {
            console.error("An error occurred while fetching favorites:", error);
        } finally {
            console.log("test");
            loadingSpinner.style.display = "none";
        }
    }

    async filreSerie(){
        const listFavorite = document.getElementById("listFavorite");
        const listFavoritePhone = document.getElementById("listFavoritePhone");
        const loadingSpinner = document.getElementById("loadingSpinner");

        // Show the spinner
        loadingSpinner.style.display = "flex";

        try {
            listFavorite.innerHTML = '';
            listFavoritePhone.innerHTML = '';
            const responseIdUser = await this.userModel.getIdUser(sessionStorage.getItem("token"), localStorage.getItem("login"));
            this.listeDeFav = await this.favoriteModel.getAllFavorite(responseIdUser[0].id);
            console.log(this.listeDeFav);

            let row = document.createElement("div");
            row.classList.add("row");

            for (const favorite of this.listeDeFav) {
                if (favorite.typecontenu === 'serie') {
                    this.responseInfo = await this.serieModel.getSerieByIdSerieApi(favorite.idapi);

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
                }}

            listFavorite.appendChild(row);

            // Second loop for listFavoritePhone
            for (const favorite of this.listeDeFav) {
                if (favorite.typecontenu === 'serie') {
                    this.responseInfo = await this.serieModel.getSerieByIdSerieApi(favorite.idapi);
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
export default() => window.favori = new Favori()