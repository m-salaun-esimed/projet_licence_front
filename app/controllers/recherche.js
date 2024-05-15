import BaseController from "../controllers/basecontroller.js"
import MovieModel from "../dataModel/moviesModel.js";
import UserModel from "../dataModel/userModel.js";
import FavoriteModel from "../dataModel/favoriteModel.js";

class RechercheController extends BaseController {
    constructor() {
        super()
        this.userModel = new UserModel()
        this.favoriteModel = new FavoriteModel()
        const rechercheNavBarString = sessionStorage.getItem("rechercheNavBar");
        this.listeDeMoviesSeries = rechercheNavBarString ? JSON.parse(rechercheNavBarString) : [];

        const rechercheElement = document.getElementById("recherche");
        const texteActuel = rechercheElement.textContent;
        const termeDeRecherche = sessionStorage.getItem("recherche");
        rechercheElement.textContent = texteActuel + termeDeRecherche;

        this.init()

    }

    init(){
        console.log(this.listeDeMoviesSeries)
        const listeRecherche = document.getElementById("listeRecherche")
        let row = document.createElement("div");
        row.classList.add("row");
        let count = 0;
        for (const MovieSerie of this.listeDeMoviesSeries) {
            let card = document.createElement("div");
            card.classList.add("card");
            card.classList.add("m-3");
            card.style.width = "200px";
            card.innerHTML = `
            <div class="card-body text-center">
                <div class="card-content">
                    <div class="row">
                        <div>
                            <img src="https://image.tmdb.org/t/p/w500${MovieSerie.poster_path}" class="card-img rounded" alt="Image" style="width: 100%">
                        </div>
                    </div>    
                    <div class="row">
                        </div>
                        <div class="col-6">
                          <button type="button" class="btn rounded-circle mt-2"  style="background-color: #22303C; color: white"
                          onclick="rechercheController.showModal(${MovieSerie.idapi})">
                            Info
                          </button>
                        </div>
                    </div>             
                </div>
            </div>
        `;

            row.appendChild(card);
            count++;
            if (count === 6 || this.listeDeMoviesSeries.length - 1 === this.listeDeMoviesSeries.indexOf(MovieSerie)) {
                listeRecherche.appendChild(row);
                // Reset row and count for the next row
                row = document.createElement("div");
                row.classList.add("row");
                count = 0;
            }
        }
    }

    showModal(idapi) {
        console.log(idapi)
        const modalTitle = document.querySelector('.name');
        const modalImage = document.querySelector('.image');
        const modalDescription = document.querySelector('.description');
        const modalNote = document.querySelector('.note');
        const modalPlatforms = document.querySelector('.platforms');
        for (let i = 0; i < this.listeDeMoviesSeries.length; i++){
            if (this.listeDeMoviesSeries[i].idapi === idapi){
                modalTitle.textContent = this.listeDeMoviesSeries[i].name;
                modalImage.innerHTML = `<img src='https://image.tmdb.org/t/p/w500${rechercheController.listeDeMoviesSeries[i].poster_path}' alt="Image du film" style="width: 70%">`;
                modalDescription.textContent = this.listeDeMoviesSeries[i].overview;
                modalNote.textContent = `Note : ${this.listeDeMoviesSeries[i].note}/10`
            }
        }

        const modal = new bootstrap.Modal(document.getElementById('modal'));
        modal.show();
    }

    async favorite(idapi){
        console.log(idapi)
        const responseIdUser = await this.userModel.getIdUser(sessionStorage.getItem("token"), localStorage.getItem("login"));
        const responseAllFav = await this.favoriteModel.getAllFavorite(responseIdUser[0].id);
        console.log(responseAllFav)
        for(let i = 0; i < responseAllFav.length; i++){
            console.log(responseAllFav[i].idapi)
            if (responseAllFav[i].idapi === idapi){
                console.log("reponse idapi : " + responseAllFav[i].idapi)
                console.log("idapi modal : " + idapi)
                alert("Film déjà dans les favoris");
                return;
            }
        }
        var type;
        for (let i = 0; i < this.listeDeMoviesSeries.length; i++){
            if (this.listeDeMoviesSeries[i].idapi === idapi){
                type = this.listeDeMoviesSeries[i].type;
                if (type === "movie"){
                    type = "film"
                }
            }
        }

        const data = {
            idapi: idapi,
            idUser: responseIdUser[0].id,
                typecontenu: type
        };
        const response = await this.favoriteModel.postFavoriteMovie(sessionStorage.getItem("token"), data);
        console.log(response);
        alert("Le film a été ajouté avec succès à la liste.");
    }

    changePageToRoulette(){
        navigate("rouletteAleatoire")
    }


}

export default() => window.rechercheController = new RechercheController()
