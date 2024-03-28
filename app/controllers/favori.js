import FavoriteModel from "../dataModel/favoriteModel.js";
import UserModel from "../dataModel/userModel.js";
import MoviesModel from "../dataModel/moviesModel.js";

class Favori {
    constructor() {
        this.favoriteModel = new FavoriteModel()
        this.userModel = new UserModel()
        this.moviesModel = new MoviesModel()

        this.init()
    }

    async init() {
        let listFavorite = document.getElementById("listFavorite");
        const responseIdUser = await this.userModel.getIdUser(sessionStorage.getItem("token"), localStorage.getItem("login"));
        const response = await this.favoriteModel.getAllFavorite(responseIdUser[0].id);

        let row = document.createElement("div");
        row.classList.add("row");
        let count = 0;

        for (const favorite of response) {
            const responseMovieInfo = await this.moviesModel.getMovieByIdMovieApi(favorite.idmovieapi)
            console.log(responseMovieInfo)

            let card = document.createElement("div");
            card.classList.add("card");
            card.classList.add("m-3");
            card.style.width = "250px"; // Adjust the width of the card
            card.innerHTML = `
            <div class="card-body text-center">
                <div class="card-content">
                    <div class="row">
                        <div class="col-6">  
                            <h5 class="card-title">${responseMovieInfo[0].name}</h5>
                        </div>
                        <div>  
                            <img src="https://image.tmdb.org/t/p/w500${responseMovieInfo[0].poster_path}" class="card-img" alt="Image" style="width: 100%">
                        </div>
                    </div>                   
                </div>
            </div>
        `;

            row.appendChild(card);
            count++;

            // Add row to listFavorite when reaching 4 cards or at the end of the loop
            if (count === 4 || response.length - 1 === response.indexOf(favorite)) {
                listFavorite.appendChild(row);
                // Reset row and count for the next row
                row = document.createElement("div");
                row.classList.add("row");
                count = 0;
            }
        }
    }
}

export default () => window.favori = new Favori();
