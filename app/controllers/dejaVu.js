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
    }

    async init(){
        let listDejaVu = document.getElementById("listDejaVu");
        this.response = await this.dejaVuModel.getAllAlreadySeenMovie();

        let row = document.createElement("div");
        row.classList.add("row");
        let count = 0;

        for (const dejaVu of this.response) {
            console.log(dejaVu.typecontenu)
            if (dejaVu.typecontenu === 'film'){
                this.responseInfo = await this.moviesModel.getMovieByIdMovieApi(dejaVu.idapi)
            }
            else{
                this.responseInfo = await this.serieModel.getSerieByIdSerieApi(dejaVu.idapi)
            }
            console.log(this.responseInfo)

            let card = document.createElement("div");
            card.classList.add("card");
            card.classList.add("m-3");
            card.style.width = "200px";
            card.innerHTML = `
            <div class="card-body text-center">
                <div class="card-content">
                    <div class="row">
                        <div>
                            <img src="https://image.tmdb.org/t/p/w500${this.responseInfo[0].poster_path}" class="card-img rounded" alt="Image" style="width: 100%">
                        </div>
                    </div>    
                    <div class="row">
                        <div class="col-6">
                          <button type="button" class="btn rounded-circle mt-2" style="background-color: #22303C" title="Supprimer des déjà vu"
                              onclick="dejaVu.removeDejaVu(${dejaVu.idapi}, '${dejaVu.typecontenu}')" id="fav">
                            <img src="../images/eye-slash-fill.svg" width="20" height="20" alt="Favori">
                        </button>

                        </div>
                        <div class="col-6">
                          <button type="button" class="btn rounded-circle mt-2"  style="background-color: #22303C; color: white"
                          onclick="dejaVu.showModalMovie(${dejaVu.idapi}, '${dejaVu.typecontenu}')">
                            Info
                          </button>
                        </div>
                     </div>               
                </div>
            </div>
        `;

            row.appendChild(card);
            count++;

            // Add row to listFavorite when reaching 4 cards or at the end of the loop
            if (count === 5 || this.response.length - 1 === this.response.indexOf(dejaVu)) {
                listDejaVu.appendChild(row);
                // Reset row and count for the next row
                row = document.createElement("div");
                row.classList.add("row");
                count = 0;
            }
        }
    }

    roulettePage(){
        navigate("rouletteAleatoire")
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