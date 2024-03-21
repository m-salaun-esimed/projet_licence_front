class RouletteAleatoire {
    constructor() {
        this.init()
    }

    init() {
        let type = document.getElementById("type");
        let movieGenres = document.getElementById("genres");
        let storedType = localStorage.getItem("type");
        let storedGenres = localStorage.getItem("listGenre");

        type.innerText = storedType;
        movieGenres.innerText = storedGenres;


    }

    resetSettings(){
        localStorage.removeItem("listGenre")
        localStorage.removeItem("type")
        navigate("formulaireRoulette")
    }
}

export default() => window.rouletteAleatoire = new RouletteAleatoire()
