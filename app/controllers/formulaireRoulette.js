import BaseController from "../controllers/basecontroller.js"
import StreamingPlatformModel from "../dataModel/streamingPlatformModel.js";

class FormulaireController extends BaseController {
    constructor() {
        super()
        this.streamingPlatformModel = new StreamingPlatformModel()
        document.getElementById("platformStreaming").style.display = "none"
        document.getElementById("type").style.display = "none"
        this.getStreamingPlatform()
    }

    async getStreamingPlatform() {
        try {
            const listStreamingPlatform = await this.streamingPlatformModel.getAllStreamingPlatform();
            console.log(listStreamingPlatform);
            let platformStreamingDiv = document.getElementById("platformStreamingDiv")
            if (listStreamingPlatform.length > 0) {

                const selectElement = document.createElement('select');
                selectElement.className = 'form-control';
                selectElement.addEventListener('change', (event) => {
                    this.selectedOption = event.target.value;
                    console.log('Selected option:', this.selectedOption);
                });
                const defaultOptionElement = document.createElement('option');
                defaultOptionElement.value = undefined; // You can set this to an appropriate default value
                defaultOptionElement.textContent = 'Veuillez choisir';
                selectElement.appendChild(defaultOptionElement);

                // Create option elements for each streaming platform
                listStreamingPlatform.forEach(platform => {
                    const optionElement = document.createElement('option');
                    optionElement.value = platform.name; // Assuming the streaming platform has an 'id' property
                    optionElement.textContent = platform.name; // Assuming the streaming platform has a 'name' property
                    selectElement.appendChild(optionElement);
                });

                platformStreamingDiv.appendChild(selectElement);
            } else {
                // No streaming platforms found
                const alertDiv = document.createElement('div');
                alertDiv.className = 'alert alert-danger mt-2';
                alertDiv.textContent = 'Aucune plateforme de streaming disponible';
                platformStreamingDiv.appendChild(alertDiv);
            }

        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    traiterFormulaire(){
        this.getFormulaireStreamingPlatform()
        this.getMovieCategorie()
        this.getMovieType()
    }

    getFormulaireStreamingPlatform(){
        if(this.selectedOption === undefined){
            console.log("undefined")
            document.getElementById("platformStreaming").style.display = "block"

        }else {
            console.log(this.selectedOption)
            document.getElementById("platformStreaming").style.display = "none"

        }
    }

    getMovieCategorie(){
        let super_hero = document.getElementById("super_hero").checked
        let aventure = document.getElementById("aventure").checked
        let thrillers = document.getElementById("thrillers").checked
        let comedie = document.getElementById("comedie").checked
        let scientifique = document.getElementById("scientifique").checked


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
            document.getElementById("type").style.display = "none";
            return true
        } else if (film && !serie) {
            console.log("Film est sélectionné.");
            this.movieType = "film";
            document.getElementById("type").style.display = "none";
            return true
        } else {
            console.log("Aucun type sélectionné.");
            document.getElementById("type").style.display = "block";
        }
    }

    deconnexion(){
        console.log("deconnexion")
        sessionStorage.removeItem("token");
        navigate("index")
    }


}

export default() => window.formulaireRouletteController = new FormulaireController()
