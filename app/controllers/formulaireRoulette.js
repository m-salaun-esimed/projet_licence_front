import BaseController from "../controllers/basecontroller.js"
import CategorieModel from "../dataModel/categorieModel.js";

class FormulaireController extends BaseController {
    constructor() {
        super()
        this.categorieModel = new CategorieModel()

        document.getElementById("type").style.display = "none";
        document.getElementById("cardType").style.display = "block"
        document.getElementById("cardGenres").style.display = "none"
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
            //TODO AFFICHER LES GENRES FILM
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
        console.log("getMovieGenres  " + response[0].id)

        const maxPerRow = 6;

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
            const label = document.createElement('label');
            label.classList.add('type');
            label.innerHTML = `
            ${genre.name}
            <br>
            <input type="checkbox" name="genre" value="${genre.id},${genre.name}">
        `;
            col.appendChild(label);
            row.appendChild(col);
        });
    }

    async getSerieGenres(){
        const response = await this.categorieModel.getAllCategorieSerie(sessionStorage.getItem("token"));
        console.log("getSerieGenres  " + response[0].id)

        const maxPerRow = 6;

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
            const label = document.createElement('label');
            label.classList.add('type');
            label.innerHTML = `
            ${genre.name}
            <br>
            <input type="checkbox" name="genre" value="${genre.id},${genre.name}">
        `;
            col.appendChild(label);
            row.appendChild(col);
        });
    }

    traiterFormulaireCategorie(){
        const checkboxes = document.querySelectorAll('input[type="checkbox"][name="genre"]');
        const selectedGenres = [];

        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                const genreValues = checkbox.value.split(',');
                selectedGenres.push({
                    id: genreValues[0],
                    name: genreValues[1]
                });
            }
        });

        if (selectedGenres.length === 0){
            alert("Veuillez choisir au moins un genre");
        }
        else if(selectedGenres.length > 3){
            alert("Maximun 3 categories")
        }
        else {
            localStorage.setItem("listGenre", JSON.stringify(selectedGenres));
            navigate("rouletteAleatoire");
        }

        console.log("Genres sélectionnés :", selectedGenres);
        return selectedGenres;
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
