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
        this.init()
    }

    async init() {
        let listFavorite = document.getElementById("listFavorite");
        const responseIdUser = await this.userModel.getIdUser(sessionStorage.getItem("token"), localStorage.getItem("login"));
        this.listeDeFav = await this.favoriteModel.getAllFavorite(responseIdUser[0].id);
        console.log(this.listeDeFav)
        let row = document.createElement("div");
        row.classList.add("row");
        let count = 0;

        for (const favorite of this.listeDeFav) {
            if (favorite.typecontenu === 'film'){
                this.responseInfo = await this.moviesModel.getMovieByIdMovieApi(favorite.idapi)
            }
            else{
                this.responseInfo = await this.serieModel.getSerieByIdSerieApi(favorite.idapi)
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
                          <button type="button" class="btn rounded-circle mt-2" style="background-color: #22303C" title="Supprimer aux favoris"
                            onclick="rouletteAleatoire.removeFavorite(${favorite.idapi})" id="fav">
                            <img src="../images/check-lg.svg" width="20" height="20" alt="Favori">
                        </button>

                        </div>
                        <div class="col-6">
                          <button type="button" class="btn rounded-circle mt-2"  style="background-color: #22303C; color: white"
                          onclick="favori.showModal(${favorite.idapi})">
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
            if (count === 5 || this.listeDeFav.length - 1 === this.listeDeFav.indexOf(favorite)) {
                listFavorite.appendChild(row);
                // Reset row and count for the next row
                row = document.createElement("div");
                row.classList.add("row");
                count = 0;
            }
        }
    }


    // async searchMovies(query) {
    //     console.log("query " + query)
    //     const response = await this.moviesModel.searchMovies(query);
    //     document.getElementById("listFavorite").innerHTML = "";
    //     this.displayMovies(response);
    // }

    // displayMovies(response) {
    //     let row = document.createElement("div");
    //     row.classList.add("row");
    //     let count = 0;
    //
    //     for (const movie of response) {
    //         let card = document.createElement("div");
    //         card.classList.add("card");
    //         card.classList.add("m-3");
    //         card.style.width = "200px";
    //         card.innerHTML = `
    //         <div class="card-body text-center">
    //             <div class="card-content">
    //                  <div class="row">
    //                     <div>
    //                         <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="card-img rounded" alt="Image" style="width: 100%">
    //                     </div>
    //                 </div>
    //                 <div class="row">
    //                     <div class="col-6">
    //                       <button type="button" class="btn rounded-circle mt-2" style="background-color: #22303C" title="Supprimer aux favoris"
    //                         onclick="rouletteAleatoire.removeFavorite(${movie.idapi})" id="fav">
    //                         <img src="../images/check-lg.svg" width="20" height="20" alt="Favori">
    //                     </button>
    //
    //                     </div>
    //                     <div class="col-6">
    //                       <button type="button" class="btn rounded-circle mt-2"  style="background-color: #22303C; color: white"
    //                       onclick="favori.showModal(${movie.idapi})">
    //                         Info
    //                       </button>
    //                     </div>
    //                  </div>
    //             </div>
    //         </div>
    //     `;
    //
    //         row.appendChild(card);
    //         count++;
    //
    //         if (count === 5 || response.length - 1 === response.indexOf(movie)) {
    //             document.getElementById("listFavorite").appendChild(row);
    //             // Reset row and count for the next row
    //             row = document.createElement("div");
    //             row.classList.add("row");
    //             count = 0;
    //         }
    //     }
    // }

    changePageToRoulette(){
        navigate("rouletteAleatoire")
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
}
export default() => window.favori = new Favori()

// document.getElementById("recherche").addEventListener("input", function() {
//     let listFavorite = document.getElementById("listFavorite");
//     const query = this.value.trim();
//     if (query !== "") {
//         listFavorite.innerText = ""
//         favori.searchMovies(query);
//     } else {
//         listFavorite.innerText = ""
//         favori.init();
//     }
// });