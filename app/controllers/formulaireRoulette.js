import BaseController from "../controllers/basecontroller.js"
import CategorieModel from "../dataModel/categorieModel.js";

class FormulaireController extends BaseController {
    constructor() {
        super()
        this.categorieModel = new CategorieModel()

        document.getElementById("type").style.display = "none";
        document.getElementById("cardType").style.display = "block"
        document.getElementById("cardGenres").style.display = "none"
        if (localStorage.getItem("type") !== null){
            document.getElementById("cardType").style.display = "none";
            if (localStorage.getItem("listGenre").length !== 0){
                navigate("rouletteAleatoire")
            }
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
            //TODO AFFICHER LES GENRES SERIE
        }
    }
    getMovieType(){
        let film = document.getElementById("film").checked
        let serie = document.getElementById("serie").checked

        console.log(`film : ${film}, serie : ${serie}`)
        if (film && serie) {
            console.log("Erreur : sélectionnez un seul type.");
            document.getElementById("type").style.display = "block";
        } else if (!film && serie) {
            console.log("Série est sélectionnée.");
            this.movieType = "serie";
            localStorage.setItem("type", "serie")
            document.getElementById("type").style.display = "none";
        } else if (film && !serie) {
            console.log("Film est sélectionné.");
            this.movieType = "film";
            localStorage.setItem("type", "film")
            document.getElementById("type").style.display = "none";
        } else {
            console.log("Aucun type sélectionné.");
            document.getElementById("type").style.display = "block";
        }
    }
    async getMovieGenres(){
        const response = await this.categorieModel.getAllCategorieMovie();
        console.log("getMovieGenres  " + response)

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
            <input type="checkbox" name="genre" value="${genre.name}">
        `;
            col.appendChild(label);
            row.appendChild(col);
        });
    }

    traiterFormulaireCategorie(){
        const checkboxes = document.querySelectorAll('input[type="checkbox"][name="genre"]');

        const tab = [];

        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                tab.push(checkbox.value);
            }
        });
        if (tab.length === 0){
            alert("Veuillez choisir au minimun un genre de film")
        }
        else {
            localStorage.setItem("listGenre", tab)
            navigate("rouletteAleatoire")
        }
        console.log("Genres sélectionnés :", tab);
        return tab;
    }

    deconnexion(){
        console.log("deconnexion")
        sessionStorage.removeItem("token");
        navigate("index")
    }
}

export default() => window.formulaireRouletteController = new FormulaireController()
