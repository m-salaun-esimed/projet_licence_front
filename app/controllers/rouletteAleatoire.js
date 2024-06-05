import MoviesModel from "../dataModel/moviesModel.js";
import FavoriteModel from "../dataModel/favoriteModel.js";
import UserModel from "../dataModel/userModel.js";
import DejaVuModel from "../dataModel/dejaVuModel.js";
import SerieModel from "../dataModel/serieModel.js";
import AmiModel from "../dataModel/amiModel.js";
import userModel from "../dataModel/userModel.js";


class RouletteAleatoire {
    constructor() {
        this.moviesModel = new MoviesModel()
        this.favoriteModel = new FavoriteModel()
        this.userModel = new UserModel()
        this.dejaVuModel = new DejaVuModel()
        this.serieModel = new SerieModel()
        this.choix = [];
        this.verifyAdmin();
        this.init();
        this.addOptionsList().then(options => {
            this.options = options;
            console.log(this.options)
            this.addMovieList();
            document.getElementById("spin").addEventListener("click", () => this.spin());
        }).catch(error => {
            console.error(error);
        });
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

    addMovieList() {
        let filmList = document.getElementsByClassName("slide-track")[0];
        filmList.textContent = ""
        for (let y = 0; y < 2; y ++){
            for (let i = 0; i < this.options.length; i++) {
                let slideDiv = document.createElement("div");
                slideDiv.classList.add("slide");

                let movieImage = document.createElement("img");
                movieImage.src = 'https://image.tmdb.org/t/p/w500' + this.options[i].poster_path;
                movieImage.style.width = "70%";
                movieImage.style.borderRadius = "20px";
                movieImage.alt = this.options[i].name;

                slideDiv.appendChild(movieImage);

                slideDiv.onclick = () => {
                    console.log("Element de liste cliqué pour :", this.options[i].name);
                    if (localStorage.getItem("type") === "film") {
                        rouletteAleatoire.showModalMovie(i);
                    } else {
                        rouletteAleatoire.showModalSerie(i);
                    }
                };

                filmList.appendChild(slideDiv);
            }
        }
    }

    async addOptionsList() {
        try {
            const token = sessionStorage.getItem("token")
            const listGenre = JSON.parse(localStorage.getItem("listGenre"));
            const categoryids = listGenre.map(genre => genre.id);
            let response;
            if (localStorage.getItem("type")=== "film"){
                response = await this.moviesModel.get5RandomMovies(categoryids, token);
            }
            else {
                response = await this.serieModel.get5RandomSeries(categoryids, token);
            }
            return response;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async init() {
        let movieGenres = document.getElementById("genres");
        let storedGenres = localStorage.getItem("listGenre");
        let selectedGenres = JSON.parse(storedGenres);
        let genreNames = selectedGenres.map(genre => genre.name).join(', ');
        movieGenres.textContent = genreNames;
    }

    resetSettings() {
        // location.reload()
        localStorage.removeItem("listGenre");
        localStorage.removeItem("type");
        navigate("formulaireRoulette");
    }

    spin() {
        document.getElementById("spin").disabled = true;

        // Generate a random number between 0 and 4
        const index = Math.floor(Math.random() * 5);
        console.log("spin index " + index)
        if (localStorage.getItem("type") === "film") {
            this.showModalMovie(index);
        } else {
            this.showModalSerie(index);
        }
        document.getElementById("spin").disabled = false;
    }



    async showModalMovie(index){
        this.index = index;
        var text = this.options[index].name;
        var modal = new bootstrap.Modal(document.getElementById('modalMovie'));
        modal.show();
        var infoMovie = document.querySelector('.nameMovie');
        infoMovie.innerText = text;

        var descriptionMovie = document.querySelector('.descriptionMovie');
        var descriptionMovietext = this.options[index].overview;
        descriptionMovie.innerText = descriptionMovietext;

        var imageMovie = document.querySelector('.imageMovie');
        if (imageMovie) {
            console.log("this.options[index].urltrailer  : " + this.options[index].urltrailer);
            if (this.options[index].urltrailer) {
                var urlBandeAnnonce = document.getElementById("urlBandeAnnonce");
                urlBandeAnnonce.setAttribute("href", this.options[index].urltrailer);
            }
            var imgElement = document.createElement('img');
            imgElement.src = 'https://image.tmdb.org/t/p/w500' + this.options[index].poster_path;
            imgElement.classList.add('img-fluid');
            imageMovie.innerHTML = '';
            imageMovie.appendChild(imgElement);
        } else {
            console.error("Element .imageMovie non trouvé");
        }

        const response = await this.moviesModel.getPlatforms(this.options[index].idapi, sessionStorage.getItem("token"));
        console.log(response);

        if (response && response.flatrate) {
            const platformsData = response.flatrate.slice(0, 3);

            let platformsHTML = '<div class="row">';
            platformsData.forEach(platform => {
                let link = '';

                switch (platform.provider_name) {
                    case 'Netflix':
                        link = `https://www.netflix.com`;
                        break;
                    case 'Amazon Prime Video':
                        link = `https://www.primevideo.com/`;
                        break;
                    case 'Canal+':
                        link = `https://www.canalplus.com/`;
                        break;
                        case 'Disney Plus':
                            link = `https://www.disneyplus.com/`;
                        break;
                    case 'TF1':
                        link = 'https://www.tf1.fr'
                        break
                        default:
                        link = ``;
                }
                platformsHTML += `
            <div class="col-md-4 mt-1">
            <a href="${link}">
                <div class="card">
                    <div class="card-body">
                        <p class="card-title">${platform.provider_name}</p>
                        <img src="https://image.tmdb.org/t/p/w500/${platform.logo_path}" alt="${platform.provider_name} Logo" class="card-img-top" style="width: 20%;">
                    </div>
                </div>
            </a>
            </div>`;
            });
            platformsHTML += '</div>'; // Fermeture de la div row

            const platformsElement = document.querySelector('.platforms');
            platformsElement.innerHTML = platformsHTML;
        }
        else {
            let platformsHTML = '';

            const platformsElement = document.querySelector('.platforms');
            platformsElement.innerHTML = platformsHTML;
            console.error("La réponse de l'API n'est pas valide ou les données des plateformes sont vides.");
        }

        var noteMovie = document.querySelector(".noteMovie");
        var noteMovieMovietext = this.options[index].note;
        noteMovie.innerHTML = '<div>' + noteMovieMovietext + '/10</div>';

        var imgElement = document.getElementById("imgMovie");
        imgElement.src = "../images/star.svg";
        const responseIdUser = await this.userModel.getIdUser(sessionStorage.getItem("token"), localStorage.getItem("login"));
        const responseAllFav = await this.favoriteModel.getAllFavorite(responseIdUser[0].id);
        for(let i = 0; i < responseAllFav.length; i++){
            if ((responseAllFav[i].idapi === this.options[index].idapi) && ("film" === responseAllFav[i].typecontenu)){
                imgElement.src = "../images/starRed.svg";
            }
        }

        var alreadySeen = document.getElementById(`imgAlreadySeenMovie`);
        alreadySeen.src = "../images/eye-off.svg";

        const responseAllAlreadySeen = await this.dejaVuModel.getAllAlreadySeenMovie();

        for( let i = 0; i < responseAllAlreadySeen.length; i++){
            console.log(responseAllAlreadySeen[i].idapi)
            if ((responseAllAlreadySeen[i].idapi === this.options[index].idapi) && ("serie" === responseAllAlreadySeen[i].typecontenu)){
                alreadySeen = document.getElementById("imgSerie");
                alreadySeen.src = "../images/eye.svg";
            }
        }
    }


    async showModalSerie(index){
        this.index = index
        var text = this.options[index].name;
        var modal = new bootstrap.Modal(document.getElementById('modalSerie'));
        modal.show();
        var infoMovie = document.querySelector('.nameSerie');
        infoMovie.innerText = text;
        var descriptionMovie = document.querySelector('.descriptionSerie');
        var descriptionMovietext = this.options[index].overview;
        descriptionMovie.innerText = descriptionMovietext;

        var imageMovie = document.querySelector('.imageSerie');
        if (imageMovie) {
            var urlBandeAnnonce = document.getElementById("urlBandeAnnonceSerie");
            if (this.options[index].urltrailer) {
                urlBandeAnnonce.setAttribute("href", this.options[index].urltrailer);
                urlBandeAnnonce.style.display = "block"
            }
            else {
                urlBandeAnnonce.style.display = "none"
            }
            var imgElement = document.createElement('img');
            imgElement.src = 'https://image.tmdb.org/t/p/w500' + this.options[index].poster_path;
            imgElement.classList.add('img-fluid');
            imageMovie.innerHTML = '';
            imageMovie.appendChild(imgElement);
        } else {
            console.error("Element .imageMovie non trouvé");
        }
        console.log("this.options[index].idapi : " + this.options[index].idapi)
        const response = await this.serieModel.getPlatforms(this.options[index].idapi, sessionStorage.getItem("token"));
        console.log(response);

        if (response && response.flatrate) {
            const platformsData = response.flatrate.slice(0, 3);

            let platformsHTML = '<div class="row">';
            platformsData.forEach(platform => {
                platformsHTML += `
            <div class="col-md-4 mt-1">
                <div class="card">
                    <div class="card-body">
                        <p class="card-title">${platform.provider_name}</p>
                        <img src="https://image.tmdb.org/t/p/w500/${platform.logo_path}" alt="${platform.provider_name} Logo" class="card-img-top" style="width: 20%;">
                    </div>
                </div>
            </div>`;
            });
            platformsHTML += '</div>'; // Fermeture de la div row

            const platformsElement = document.querySelector('.platformsSerie');
            platformsElement.innerHTML = platformsHTML;
        }
        else {
            let platformsHTML = '';

            const platformsElement = document.querySelector('.platformsSerie');
            platformsElement.innerHTML = platformsHTML;
            console.error("La réponse de l'API n'est pas valide ou les données des plateformes sont vides.");
        }

        var noteMovie = document.getElementsByClassName("noteSerie")[0];
        var noteMovieMovietext = this.options[index].note;
        noteMovie.innerHTML = '<div>' + noteMovieMovietext + '/10</div>';
        const responseIdUser = await this.userModel.getIdUser(sessionStorage.getItem("token"), localStorage.getItem("login"));
        const responseAllFav = await this.favoriteModel.getAllFavorite(responseIdUser[0].id);
        console.log(responseAllFav)
        var imgElement = document.getElementById("imgSerie");
        imgElement.src = "../images/star.svg";
        for(let i = 0; i < responseAllFav.length; i++){
            console.log(responseAllFav[i].idapi)
            if ((responseAllFav[i].idapi === this.options[index].idapi) && ("serie" === responseAllFav[i].typecontenu)){
                imgElement = document.getElementById("imgSerie");
                imgElement.src = "../images/starRed.svg";
            }
        }
        var alreadySeen = document.getElementById(`imgAlreadySeenSerie`);
        alreadySeen.src = "../images/eye-off.svg";

        const responseAllAlreadySeen = await this.dejaVuModel.getAllAlreadySeenMovie();
        for( let i = 0; i < responseAllAlreadySeen.length; i++){
            console.log(responseAllAlreadySeen[i].idapi)
            if ((responseAllAlreadySeen[i].idapi === this.options[index].idapi) && ("serie" === responseAllAlreadySeen[i].typecontenu)){
                alreadySeen = document.getElementById("imgSerie");
                alreadySeen.src = "../images/eye.svg";
            }
        }
    }

    async showModal(random){
        var text = random.name;
        var modal = new bootstrap.Modal(document.getElementById('modalperso'));
        modal.show();
        var infoMovie = document.querySelector('.name');
        infoMovie.innerText = text;

        var descriptionMovie = document.querySelector('.description');
        var descriptionMovietext = random.overview;
        descriptionMovie.innerText = descriptionMovietext;

        var imageMovie = document.querySelector('.image');
        if (imageMovie) {
            var imgElement = document.createElement('img');
            imgElement.src = 'https://image.tmdb.org/t/p/w500' + random.poster_path;
            imgElement.classList.add('img-fluid');
            imageMovie.innerHTML = '';
            imageMovie.appendChild(imgElement);
        } else {
            console.error("Element .imageMovie non trouvé");
        }

        const response = await this.moviesModel.getPlatforms(random.idapi, sessionStorage.getItem("token"));
        console.log(response);

        if (response && response.flatrate) {
            const platformsData = response.flatrate.slice(0, 3);

            let platformsHTML = '<div class="row">';
            platformsData.forEach(platform => {
                platformsHTML += `
            <div class="col-md-4 mt-1">
                <div class="card">
                    <div class="card-body">
                        <p class="card-title">${platform.provider_name}</p>
                        <img src="https://image.tmdb.org/t/p/w500/${platform.logo_path}" alt="${platform.provider_name} Logo" class="card-img-top" style="width: 20%;">
                    </div>
                </div>
            </div>`;
            });
            platformsHTML += '</div>';

            const platformsElement = document.querySelector('.platforms');
            platformsElement.innerHTML = platformsHTML;
        }
        else {
            let platformsHTML = '';

            const platformsElement = document.querySelector('.platforms');
            platformsElement.innerHTML = platformsHTML;
            console.error("La réponse de l'API n'est pas valide ou les données des plateformes sont vides.");
        }

        var noteMovie = document.querySelector(".note");
        var noteMovieMovietext = random.note;
        noteMovie.innerHTML = '<div>' + noteMovieMovietext + '/10</div>';

    }

    refreshRoulette(){
        // location.reload();
        this.addOptionsList().then(options => {
            this.options = options;
            console.log(this.options)
            this.addMovieList();
        }).catch(error => {
            console.error(error);
        });
    }

    async addFavorite(index, type) {
        if (type === "serie"){
            var imgElement = document.getElementById(`imgSerie`);

        }else {
            var imgElement = document.getElementById(`imgMovie`);
        }
        try {
            const responseIdUser = await this.userModel.getIdUser(sessionStorage.getItem("token"), localStorage.getItem("login"));
            const responseAllFav = await this.favoriteModel.getAllFavorite(responseIdUser[0].id);
            console.log(responseAllFav)
            for(let i = 0; i < responseAllFav.length; i++){
                console.log(responseAllFav[i].idapi)
                console.log("aaaaaaaaa" + responseAllFav[i].typecontenu)
                if ((responseAllFav[i].idapi === this.options[index].idapi) && (type === responseAllFav[i].typecontenu)){
                    console.log("reponse idapi : " + responseAllFav[i].idapi)
                    console.log("idapi modal : " + this.options[index].idapi)
                    await this.removeFavoriteModal(this.options[index].idapi)
                    imgElement.src = "../images/star.svg";
                    return;
                }
            }
            console.log(this.options[index].id);
            const data = {
                idapi: this.options[index].idapi,
                idUser: responseIdUser[0].id,
                typecontenu: localStorage.getItem("type")
            };
            const response = await this.favoriteModel.postFavoriteMovie(sessionStorage.getItem("token"), data);
            console.log(response);

            if (imgElement) {
                imgElement.src = "../images/starRed.svg";
            } else {
                console.log("Element avec l'ID 'imgMovie' non trouvé.");
            }
        } catch (error) {
            console.error("Erreur lors de l'ajout du film aux favoris :", error);
            alert("Une erreur est survenue lors de l'ajout du film aux favoris. Veuillez réessayer plus tard.");
        }
    }

    async addDejaVu(index, type){
        if (type === "serie"){
            var alreadySeen = document.getElementById(`imgAlreadySeenSerie`);

        }else {
            var alreadySeen = document.getElementById(`imgAlreadySeenMovie`);
        }
        try {
            const responseAllFav = await this.dejaVuModel.getAllAlreadySeenMovie();
            for( let i = 0; i < responseAllFav.length; i++){
                console.log(responseAllFav[i].idapi)
                if ((responseAllFav[i].idapi === this.options[index].idapi) && (type === responseAllFav[i].typecontenu)){
                    console.log("tessttsfc")
                    await this.dejaVuModel.removeDejaVuMovie(sessionStorage.getItem("token"),this.options[index].idapi, type)
                    alreadySeen.src = "../images/eye-off.svg";
                    return;
                }
            }
            const data = {
                idapi: this.options[index].idapi,
                typecontenu: localStorage.getItem("type")
            };
            const response = await this.dejaVuModel.postAlreadySeenMovie(sessionStorage.getItem("token"), data);
            console.log(response);
            alreadySeen.src = "../images/eye.svg";

            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                const modalInstance = bootstrap.Modal.getInstance(modal);
                if (modalInstance) {
                    modalInstance.hide();
                }
            });
            setTimeout(() => {
                this.refreshRoulette();
            }, 300);
        } catch (error) {
            console.error("Erreur lors de l'ajout du film aux deja vu :", error);
            alert("Une erreur est survenue lors de l'ajout du film aux deja vu. Veuillez réessayer plus tard.");
        }
    }

    async removeFavorite(idapi){
        console.log("removeFavorite " + idapi)
        const response = await this.favoriteModel.removeFavoriteMovie(sessionStorage.getItem("token"), idapi);
        console.log(response);
        alert("Le film a été supprimée avec succès de la liste.");
        navigate("favori")
        console.log(idapi)
    }

    async removeFavoriteModal(idapi){
        await this.favoriteModel.removeFavoriteMovie(sessionStorage.getItem("token"), idapi);
    }

    clearAutocompleteResults() {
        const autocompleteList = document.querySelector('.autocomplete-results');
        autocompleteList.innerHTML = '';

        const autocompleteListNavBar = document.querySelector('.autocomplete-results-navBar');
        autocompleteListNavBar.innerHTML = '';
    }

    renderAutocompleteResultsNavBar(suggestions, recherche) {
        const autocompleteList = document.querySelector('.autocomplete-results-navBar');
        autocompleteList.innerHTML = '';

        const maxSuggestions = 5;
        const displayedSuggestions = suggestions.slice(0, maxSuggestions);

        displayedSuggestions.forEach(suggestion => {
            const listItem = document.createElement('li');
            listItem.classList = "m-2";
            listItem.textContent = suggestion.name;
            listItem.addEventListener('click', () => {
                document.getElementById('recherche').value = "";
                this.clearAutocompleteResults();
                this.showModal(suggestion)
            });
            autocompleteList.appendChild(listItem);
        });

        if (suggestions.length > maxSuggestions) {
            const seeMoreButton = document.createElement('button');
            seeMoreButton.textContent = 'Voir plus';
            seeMoreButton.classList = "btn btn-primary m-3";
            seeMoreButton.addEventListener('click', () => {
                console.log('Afficher plus de suggestions...');
                sessionStorage.setItem("rechercheNavBar", JSON.stringify(suggestions)); // Utilisation de JSON.stringify pour stocker un tableau dans sessionStorage
                sessionStorage.setItem("recherche", recherche)
                navigate("recherche");
            });
            autocompleteList.appendChild(seeMoreButton);
        }

    }

    async adminPage(){
        try {
            const response = await this.userModel.refreshToken(sessionStorage.getItem("token"));
            console.log(response)
            if (!response.token) {
                throw new Error("La requête a échoué avec le statut : " + response.status);
            }

            const token = response.token;
            console.log(token);
            sessionStorage.setItem("token", "Bearer " + token);
            console.log("refresh");
            navigate("admin");
        } catch (error) {
            console.error("Une erreur s'est produite lors de la récupération du token :", error);
        }
    }

    redirectionHomePage(){
        navigate("rouletteAleatoire")
    }

    friendsPage(){
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            const modalInstance = bootstrap.Modal.getInstance(modal);
            if (modalInstance) {
                modalInstance.hide();
            }
        });
        setTimeout(() => {
            navigate("amis")
        }, 300);
    }

    actualitePage(){
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            const modalInstance = bootstrap.Modal.getInstance(modal);
            if (modalInstance) {
                modalInstance.hide();
            }
        });
        setTimeout(() => {
            navigate("actualitePage")
        }, 300);
    }

    addFriendsNotificationsPage(){
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            const modalInstance = bootstrap.Modal.getInstance(modal);
            if (modalInstance) {
                modalInstance.hide();
            }
        });
        setTimeout(() => {
            navigate("addFriendsNotifications");
        }, 300);
    }
    ajouter_ami(){
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            const modalInstance = bootstrap.Modal.getInstance(modal);
            if (modalInstance) {
                modalInstance.hide();
            }
        });
        setTimeout(() => {
            navigate("ajouter_ami");
        }, 300);
    }

    async alreadyseenPage(){
        try {
            const response = await this.userModel.refreshToken(sessionStorage.getItem("token"));
            console.log(response)
            if (!response.token) {
                throw new Error("La requête a échoué avec le statut : " + response.status);
            }

            const token = response.token;
            console.log(token);
            sessionStorage.setItem("token", "Bearer " + token);
            console.log("refresh");
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                const modalInstance = bootstrap.Modal.getInstance(modal);
                if (modalInstance) {
                    modalInstance.hide();
                }
            });
            setTimeout(() => {
                navigate("dejavu");
            }, 300);
        } catch (error) {
            console.error("Une erreur s'est produite lors de la récupération du token :", error);
        }
    }

    async favoriPage() {
        try {
            const response = await this.userModel.refreshToken(sessionStorage.getItem("token"));
            console.log(response)
            if (!response.token) {
                throw new Error("La requête a échoué avec le statut : " + response.status);
            }

            const token = response.token;
            console.log(token);
            sessionStorage.setItem("token", "Bearer " + token);
            console.log("refresh");
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                const modalInstance = bootstrap.Modal.getInstance(modal);
                if (modalInstance) {
                    modalInstance.hide();
                }
            });
            setTimeout(() => {
                navigate("favori");
            }, 300);
        } catch (error) {
            console.error("Une erreur s'est produite lors de la récupération du token :", error);
        }
    }
}

export default () => window.rouletteAleatoire = new RouletteAleatoire();
