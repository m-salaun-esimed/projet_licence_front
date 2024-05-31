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
        try {
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
                                    <img src="../images/eye-off.svg" alt="Favori">
                                    <span style="z-index: 9999">Supprimer des déjà vu</span>
                                </a>
                            </div>
                            <div class="col-6">
                                <a class="navbar__link" onclick="dejaVu.showModalMovie(${dejaVu.idapi}, '${dejaVu.typecontenu}')">
                                    <img src="../images/info.svg" alt="Favori">
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
            }
            else {
                this.responseInfo = await this.serieModel.getSerieByIdSerieApi(idapi)
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

        modalFooter.appendChild(viewedButton);
    }
}

export default() => window.dejaVu = new DejaVu()