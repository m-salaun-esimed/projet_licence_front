import BaseController from "../controllers/basecontroller.js"
import CategorieModel from "../dataModel/categorieModel.js";
import MoviesModel from "../dataModel/moviesModel.js";

class FormulaireController extends BaseController {
    constructor() {
        super()
        this.categorieModel = new CategorieModel()
        this.movieModel = new MoviesModel()

        document.getElementById("type").style.display = "none";
        document.getElementById("cardType").style.display = "block"
        document.getElementById("cardGenres").style.display = "none"
        document.getElementById("cardPlatforms").style.display = "none"
        if (localStorage.getItem("listGenre") !== null){
            navigate("rouletteAleatoire")
        }
    }

    traiterFormulaireType() {
        const selectedType = document.querySelector('input[name="type"]:checked');
        if (!selectedType) {
            document.getElementById("type").style.display = "block";
            return;
        }
        localStorage.setItem("type", selectedType.value);

        if (selectedType.value === "film") {
            document.getElementById("cardType").style.display = "none";
            document.getElementById("cardGenres").style.display = "block";
            this.getMovieGenres();
        } else {
            document.getElementById("cardType").style.display = "none";
            document.getElementById("cardGenres").style.display = "block";
            this.getSerieGenres();
        }
    }

    async getMovieGenres(){
        const response = await this.categorieModel.getAllCategorieMovie(sessionStorage.getItem("token"));
        console.log("getMovieGenres  " + response[0].id);

        const maxPerRow = 8;
        const container = document.getElementById('checkboxContainer');

        let row;
        response.forEach((genre, index) => {
            if (index % maxPerRow === 0) {
                row = document.createElement('div');
                row.classList.add('row');
                container.appendChild(row);
            }

            const col = document.createElement('div');
            col.classList.add('col');

            const box = document.createElement('div');
            box.classList.add('box');
            box.dataset.id = genre.id;
            box.dataset.name = genre.name;
            box.innerHTML = genre.name;

            box.addEventListener('click', function() {
                this.classList.toggle('selected');
            });

            col.appendChild(box);
            row.appendChild(col);
        });
    }

    async getPlatforms(){
        const response = await this.movieModel.getPlatforms(sessionStorage.getItem("token"));
        const maxPerRow = 8;
        const container = document.getElementById('platforms');

        let row;
        response.forEach((platform, index) => {
            if (index % maxPerRow === 0) {
                row = document.createElement('div');
                row.classList.add('row');
                container.appendChild(row);
            }

            const col = document.createElement('div');
            col.classList.add('col');

            const box2 = document.createElement('div');
            box2.classList.add('box2');
            box2.dataset.idapi = platform.idapi;
            box2.dataset.provider_name = platform.provider_name;
            box2.innerHTML = platform.provider_name;

            // Add click event listener to the box
            box2.addEventListener('click', function() {
                this.classList.toggle('selected');
            });

            col.appendChild(box2);
            row.appendChild(col);
        });
    }


    async getSerieGenres(){
        const response = await this.categorieModel.getAllCategorieSerie(sessionStorage.getItem("token"));
        console.log("getSerieGenres " + response[0].id);

        const maxPerRow = 8;
        const container = document.getElementById('checkboxContainer');

        let row;
        response.forEach((genre, index) => {
            if (index % maxPerRow === 0) {
                row = document.createElement('div');
                row.classList.add('row');
                container.appendChild(row);
            }

            const col = document.createElement('div');
            col.classList.add('col');

            const box = document.createElement('div');
            box.classList.add('box');
            box.dataset.id = genre.id;
            box.dataset.name = genre.name;
            box.innerHTML = genre.name;

            // Add click event listener to the box
            box.addEventListener('click', function() {
                this.classList.toggle('selected');
            });

            col.appendChild(box);
            row.appendChild(col);
        });
    }

    traiterFormulaireCategorie(){
        const selectedBoxes = document.querySelectorAll('.box.selected');
        const selectedGenres = [];

        selectedBoxes.forEach(box => {
            selectedGenres.push({
                id: box.dataset.id,
                name: box.dataset.name
            });
        });

        if (selectedGenres.length === 0) {
            alert("Veuillez choisir au moins un genre");
        } else if (selectedGenres.length > 3) {
            alert("Maximun 3 categories");
        } else {
            localStorage.setItem("listGenre", JSON.stringify(selectedGenres));
            // navigate("rouletteAleatoire");
            document.getElementById("cardGenres").style.display = "none"
            document.getElementById("cardPlatforms").style.display = "block"
            this.getPlatforms();
        }

        console.log("Genres sélectionnés :", selectedGenres);
        return selectedGenres;
    }

    traiterFormulairePlatforms(){
        const selectedBoxes = document.querySelectorAll('.box2.selected');
        const selectedPlatforms = [];

        selectedBoxes.forEach(box => {
            selectedPlatforms.push({
                idapi: box.dataset.idapi,
                provider_name: box.dataset.provider_name
            });
        });
        localStorage.setItem("platforms", JSON.stringify(selectedPlatforms));
        navigate("rouletteAleatoire");
        console.log("platforms sélectionnées :", selectedPlatforms);
    }

    deconnexion(){
        console.log("deconnexion")
        localStorage.removeItem("type");
        localStorage.removeItem("listGenre");

        sessionStorage.removeItem("token");
        navigate("index")
    }
}

export default() => window.formulaireRouletteController = new FormulaireController()
