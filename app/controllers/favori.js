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
        this.verifyAdmin();
        this.init()
        this.recherche = ""
        const rechercheInput = document.getElementById('recherche');
        rechercheInput.addEventListener('input', this.autocomplete.bind(this));
        const filtresElements = document.querySelectorAll('.filtres');
        filtresElements.forEach(element => {
            element.style.display = 'none';
        });
        this.searchVisible = false;
    }

    async init() {
        const listFavorite = document.getElementById("listFavorite");
        const listFavoritePhone = document.getElementById("listFavoritePhone");
        const loadingSpinner = document.getElementById("loadingSpinner");
        document.getElementById("filtresErase").style.display = "none"
        document.getElementById("filtre").style.display = "block"
        loadingSpinner.style.display = "flex";

        try {
            listFavorite.innerHTML = '';
            listFavoritePhone.innerHTML = '';
            document.getElementById("filtreEnCours").innerText = '';

            const responseIdUser = await this.userModel.getIdUser(sessionStorage.getItem("token"), localStorage.getItem("login"));
            this.listeDeFav = await this.favoriteModel.getAllFavorite(responseIdUser[0].id);
            console.log(this.listeDeFav);

            let row = document.createElement("div");
            row.classList.add("row");

            for (const favorite of this.listeDeFav) {
                if (favorite.typecontenu === 'film') {
                    this.responseInfo = await this.moviesModel.getMovieByIdMovieApi(favorite.idapi);
                } else {
                    this.responseInfo = await this.serieModel.getSerieByIdSerieApi(favorite.idapi);
                }
                console.log(this.responseInfo);

                let col = document.createElement("div");
                col.classList.add("col-6", "col-sm-4", "col-md-3", "col-lg-2", "mb-2"); // Adjusted to make the cards smaller

                let card = document.createElement("div");
                card.classList.add("card", "h-100");
                card.style.backgroundColor = "black"
                card.style.borderColor = "white"
                card.innerHTML = `
            <div class="card-body text-center">
                <div class="card-content">
                    <div class="row">
                        <div>
                            <img src="https://image.tmdb.org/t/p/w500${this.responseInfo[0].poster_path}" class="card-img rounded" alt="Image" style="width: 70%"><!-- Adjusted the width to make the image smaller -->
                        </div>
                    </div>    
                    <div class="row mt-2">
                    <div class="col-6">
                        <a class="navbar__link" onclick="favori.confirmRemoval(${favorite.idapi}, '${favorite.typecontenu}')">
                            <img src="../images/trash-2-white.svg" alt="Favori">
                            <span style="z-index: 9999">Supprimer de la liste</span>
                        </a>
                    </div>
                        <div class="col-6">
                            <a class="navbar__link" onclick="favori.showModal(${favorite.idapi})">
                                <img src="../images/infoWhite.svg" alt="Favori">
                                <span style="z-index: 9999">Information</span>
                            </a>
                        </div>
                    </div>            
                </div>
            </div>
            `;

                col.appendChild(card);
                row.appendChild(col);
            }

            listFavorite.appendChild(row);

            // Second loop for listFavoritePhone
            for (const favorite of this.listeDeFav) {
                if (favorite.typecontenu === 'film') {
                    this.responseInfo = await this.moviesModel.getMovieByIdMovieApi(favorite.idapi);
                } else {
                    this.responseInfo = await this.serieModel.getSerieByIdSerieApi(favorite.idapi);
                }
                console.log(this.responseInfo);

                let rowPhone = document.createElement("div");
                rowPhone.classList.add("row", "mb-2");

                let cardPhone = document.createElement("div");
                cardPhone.classList.add("card");
                cardPhone.style.backgroundColor = "black"
                cardPhone.innerHTML = `
            <div class="row no-gutters">
                <div class="col-4">
                    <img src="https://image.tmdb.org/t/p/w500${this.responseInfo[0].poster_path}" class="card-img" alt="Image" style="border-radius: 24px">
                </div>
                <div class="col-8">
                    <div class="card-body">
                        <h5 class="card-title" style="color: white">${this.responseInfo[0].name}</h5>
                        <div class="row mt-2">
                            <div class="col-6">
                                <a class="navbar__link" onclick="favori.confirmRemoval(${favorite.idapi}, '${favorite.typecontenu}')">
                                    <img src="../images/trash-2-white.svg" alt="Favori">
                                    <span style="z-index: 9999">Supprimer de la liste</span>
                                </a>
                            </div>
                            <div class="col-6">
                                <a class="navbar__link" onclick="favori.showModal(${favorite.idapi})">
                                    <img src="../images/infoWhite.svg" alt="Favori">
                                    <span style="z-index: 9999">Information</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;

                rowPhone.appendChild(cardPhone);
                listFavoritePhone.appendChild(rowPhone);
            }

        } catch (error) {
            console.error("An error occurred while fetching favorites:", error);
        } finally {
            console.log("test");
            loadingSpinner.style.display = "none";
        }
    }

    toggleSearch() {
        const searchDiv = document.getElementById("recherche-container");
        if (this.searchVisible) {
            searchDiv.style.display = "none";
        } else {
            searchDiv.style.display = "block";
        }
        this.searchVisible = !this.searchVisible;
    }

    async autocomplete(event) {
        this.recherche = event.target.value.trim();

        if (this.recherche.length === 0) {
            this.clearAutocompleteResults();
            return;
        }

        try {
            this.suggestions = await this.moviesModel.getCompletion(sessionStorage.getItem("token"), this.recherche);
            console.log(this.suggestions);
            this.renderAutocompleteResults(this.suggestions);

        } catch (error) {
            console.error(error);
        }
    }

    clearAutocompleteResults() {
        const autocompleteList = document.querySelector('.autocomplete-results');
        autocompleteList.innerHTML = '';
    }

    renderAutocompleteResults(suggestions) {
        const autocompleteList = document.querySelector('.autocomplete-results');
        autocompleteList.innerHTML = '';
        const displayedSuggestions = suggestions.slice(0);
        displayedSuggestions.forEach(suggestion => {
            const listItem = document.createElement('li');
            listItem.classList = "m-2 d-flex align-items-center";
            const img = document.createElement('img');
            img.src = 'https://image.tmdb.org/t/p/w500' + suggestion.poster_path;
            img.alt = suggestion.name;
            img.classList = "img-thumbnail me-2";
            img.style.width = '50px';
            const text = document.createElement('span');
            text.textContent = suggestion.name;
            listItem.addEventListener('click', () => {
                this.clearAutocompleteResults();
                // console.log(suggestion.type)
                // document.getElementById('recherche').value = suggestion.name;
                this.showModal(suggestion.idapi, suggestion);
            });
            listItem.appendChild(img);
            listItem.appendChild(text);
            autocompleteList.appendChild(listItem);
        });
    }

    async confirmRemoval(idapi, type) {
        if (confirm("Êtes-vous sûr de vouloir supprimer ce favori ?")) {
            await rouletteAleatoire.removeFavorite(idapi, type);
        }
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

    async showModal(idapi, suggestion){
        if (suggestion){
            if (suggestion.type === "movie"){
                this.responsePlatform = await this.moviesModel.getPlatforms(idapi, sessionStorage.getItem("token"))
            }
            else{
                this.responsePlatform = await this.serieModel.getPlatforms(idapi, sessionStorage.getItem("token"))
            }
            var text = suggestion.name;
            var modal = new bootstrap.Modal(document.getElementById('modalMovie'));
            modal.show();
            var infoMovie = document.querySelector('.nameMovie');
            infoMovie.innerText = text;
            var descriptionMovie = document.querySelector('.descriptionMovie');
            var descriptionMovietext = suggestion.overview;
            descriptionMovie.innerText = descriptionMovietext;

            var imageMovie = document.querySelector('.imageMovie');
            if (imageMovie) {
                var imgElement = document.createElement('img');
                imgElement.src = 'https://image.tmdb.org/t/p/w500' + suggestion.poster_path;
                imgElement.classList.add('img-fluid');
                imageMovie.innerHTML = '';
                imageMovie.appendChild(imgElement);
            } else {
                console.error("Element .imageMovie non trouvé");
            }

            var noteMovie = document.getElementsByClassName("noteMovie")[0];
            var noteMovieMovietext = suggestion.note;
            noteMovie.innerHTML = '<div>' + noteMovieMovietext + '/10</div>';

            var modalFooter = document.querySelector('.modal-footer');
            modalFooter.innerHTML = '';

            if (this.responsePlatform && this.responsePlatform.flatrate) {
                const platformsData = this.responsePlatform.flatrate.slice(0, 3);

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


            var imgElement = document.getElementById("imgFav");
            imgElement.src = "../images/starWhite.svg";
            for(let i = 0; i < this.listeDeFav.length; i++){
                console.log("test " + this.listeDeFav[i].idapi)
                if ((this.listeDeFav[i].idapi === idapi)){
                    imgElement.src = "../images/starRed.svg";
                }
            }
            console.log("suggestion.type : " + suggestion.type)
            document.getElementById("addfavorite").onclick = () => {
                this.addFavorite(suggestion.idapi, suggestion.type);
            };

            modalFooter.appendChild(viewedButton);
        }else{
            for(let i = 0 ; i < this.listeDeFav.length ; i++){
                if (this.listeDeFav[i].idapi === idapi){
                    if (this.listeDeFav[i].typecontenu === "film"){
                        this.responseInfo = await this.moviesModel.getMovieByIdMovieApi(idapi)
                        this.responsePlatform = await this.moviesModel.getPlatforms(idapi, sessionStorage.getItem("token"))
                    }
                    else {
                        this.responseInfo = await this.serieModel.getSerieByIdSerieApi(idapi)
                        this.responsePlatform = await this.serieModel.getPlatforms(idapi, sessionStorage.getItem("token"))
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

                    if (this.responsePlatform && this.responsePlatform.flatrate) {
                        const platformsData = this.responsePlatform.flatrate.slice(0, 3);

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

                        const platformsElement = document.querySelector('.platforms');
                        platformsElement.innerHTML = platformsHTML;
                    }
                    else {
                        let platformsHTML = '';

                        const platformsElement = document.querySelector('.platforms');
                        platformsElement.innerHTML = platformsHTML;
                        console.error("La réponse de l'API n'est pas valide ou les données des plateformes sont vides.");
                    }

                    var imgElement = document.getElementById("imgFav");
                    imgElement.src = "../images/starWhite.svg";
                    for(let i = 0; i < this.listeDeFav.length; i++){
                        console.log(this.listeDeFav[i].idapi)
                        if ((this.listeDeFav[i].idapi === idapi)){
                            imgElement.src = "../images/starRed.svg";
                        }
                    }

                    document.getElementById("addfavorite").onclick = () => {
                        this.addFavorite(idapi, this.listeDeFav[i].idapi);
                    };
                    modalFooter.appendChild(viewedButton);
                }
            }
        }
    }

    async addFavorite(idapi, type) {
        var imgElement = document.getElementById(`imgFav`);

        try {
            const responseIdUser = await this.userModel.getIdUser(sessionStorage.getItem("token"), localStorage.getItem("login"));
            for(let i = 0; i < this.listeDeFav.length; i++){
                if ((this.listeDeFav[i].idapi === idapi) && (type === this.listeDeFav[i].typecontenu)){
                    await this.removeFavoriteModal(this.listeDeFav[i].idapi, type)
                    imgElement.src = "../images/starWhite.svg";

                    setTimeout(() => {
                        this.init()
                    }, 300);
                    return;
                }
            }

            if (type === "movie"){
                type = "film";
            }
            const data = {
                idapi: idapi,
                idUser: responseIdUser[0].id,
                typecontenu: type
            };
            const response = await this.favoriteModel.postFavoriteMovie(sessionStorage.getItem("token"), data);
            console.log(response);

            if (imgElement) {
                imgElement.src = "../images/starRed.svg";
            } else {
                console.log("Element avec l'ID 'imgMovie' non trouvé.");
            }
            const responseinit =await this.init()
            console.log(responseinit);

        } catch (error) {
            console.error("Erreur lors de l'ajout du film aux favoris :", error);
            alert("Une erreur est survenue lors de l'ajout du film aux favoris. Veuillez réessayer plus tard.");
        }
    }

    async removeFavoriteModal(idapi, type){
        await this.favoriteModel.removeFavoriteMovie(sessionStorage.getItem("token"), idapi, type);
    }

    async filreFilm(){
        const filtresElements = document.querySelectorAll('.filtres');
        filtresElements.forEach(element => {
            element.style.display = 'none';
        });
        document.getElementById("filtreEnCours").innerText = "films";
        document.getElementById("filtresErase").style.display = "block"
        document.getElementById("filtre").style.display = "none"

        const listFavorite = document.getElementById("listFavorite");
        const listFavoritePhone = document.getElementById("listFavoritePhone");
        const loadingSpinner = document.getElementById("loadingSpinner");

        // Show the spinner
        loadingSpinner.style.display = "flex";

        try {
            listFavorite.innerHTML = '';
            listFavoritePhone.innerHTML = '';
            const responseIdUser = await this.userModel.getIdUser(sessionStorage.getItem("token"), localStorage.getItem("login"));
            this.listeDeFav = await this.favoriteModel.getAllFavorite(responseIdUser[0].id);
            console.log(this.listeDeFav);

            let row = document.createElement("div");
            row.classList.add("row");

            for (const favorite of this.listeDeFav) {
                if (favorite.typecontenu === 'film') {
                    this.responseInfo = await this.moviesModel.getMovieByIdMovieApi(favorite.idapi);

                console.log(this.responseInfo);

                let col = document.createElement("div");
                col.classList.add("col-6", "col-sm-4", "col-md-3", "col-lg-2", "mb-2"); // Adjusted to make the cards smaller

                let card = document.createElement("div");
                card.classList.add("card", "h-100");
                card.style.backgroundColor = "black"
                card.style.borderColor = "white"
                card.innerHTML = `
            <div class="card-body text-center">
                <div class="card-content">
                    <div class="row">
                        <div>
                            <img src="https://image.tmdb.org/t/p/w500${this.responseInfo[0].poster_path}" class="card-img rounded" alt="Image" style="width: 70%"><!-- Adjusted the width to make the image smaller -->
                        </div>
                    </div>    
                    <div class="row mt-2">
                        <div class="col-6">
                            <a class="navbar__link" onclick="rouletteAleatoire.removeFavorite(${favorite.idapi})">
                                <img src="../images/trash-2-white.svg" alt="Favori">
                                <span style="z-index: 9999">Supprimer de la liste</span>
                            </a>
                        </div>
                        <div class="col-6">
                            <a class="navbar__link" onclick="favori.showModal(${favorite.idapi})">
                                <img src="../images/infoWhite.svg" alt="Favori">
                                <span style="z-index: 9999">Information</span>
                            </a>
                        </div>
                    </div>            
                </div>
            </div>
            `;

                col.appendChild(card);
                row.appendChild(col);
            }}

            listFavorite.appendChild(row);

            // Second loop for listFavoritePhone
            for (const favorite of this.listeDeFav) {
                if (favorite.typecontenu === 'film') {
                    this.responseInfo = await this.moviesModel.getMovieByIdMovieApi(favorite.idapi);
                console.log(this.responseInfo);

                let rowPhone = document.createElement("div");
                rowPhone.classList.add("row", "mb-2");

                let cardPhone = document.createElement("div");
                cardPhone.classList.add("card");
                cardPhone.style.backgroundColor = "black"
                cardPhone.innerHTML = `
            <div class="row no-gutters">
                <div class="col-4">
                    <img src="https://image.tmdb.org/t/p/w500${this.responseInfo[0].poster_path}" class="card-img" alt="Image" style="border-radius: 24px">
                </div>
                <div class="col-8">
                    <div class="card-body">
                        <h5 class="card-title" style="color: white">${this.responseInfo[0].name}</h5>
                        <div class="row mt-2">
                            <div class="col-6">
                                <a class="navbar__link" onclick="rouletteAleatoire.removeFavorite(${favorite.idapi})">
                                    <img src="../images/trash-2-white.svg" alt="Favori">
                                    <span style="z-index: 9999">Supprimer de la liste</span>
                                </a>
                            </div>
                            <div class="col-6">
                                <a class="navbar__link" onclick="favori.showModal(${favorite.idapi})">
                                    <img src="../images/infoWhite.svg" alt="Favori">
                                    <span style="z-index: 9999">Information</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;

                rowPhone.appendChild(cardPhone);
                listFavoritePhone.appendChild(rowPhone);
            }}

        } catch (error) {
            console.error("An error occurred while fetching favorites:", error);
        } finally {
            console.log("test");
            loadingSpinner.style.display = "none";
        }
    }

    async filreSerie(){
        const filtresElements = document.querySelectorAll('.filtres');
        document.getElementById("filtresErase").style.display = "block"
        document.getElementById("filtre").style.display = "none"

        filtresElements.forEach(element => {
            element.style.display = 'none';
        });
        document.getElementById("filtreEnCours").innerText = "Séries";

        const listFavorite = document.getElementById("listFavorite");
        const listFavoritePhone = document.getElementById("listFavoritePhone");
        const loadingSpinner = document.getElementById("loadingSpinner");

        // Show the spinner
        loadingSpinner.style.display = "flex";

        try {
            listFavorite.innerHTML = '';
            listFavoritePhone.innerHTML = '';
            const responseIdUser = await this.userModel.getIdUser(sessionStorage.getItem("token"), localStorage.getItem("login"));
            this.listeDeFav = await this.favoriteModel.getAllFavorite(responseIdUser[0].id);
            console.log(this.listeDeFav);

            let row = document.createElement("div");
            row.classList.add("row");

            for (const favorite of this.listeDeFav) {
                if (favorite.typecontenu === 'serie') {
                    this.responseInfo = await this.serieModel.getSerieByIdSerieApi(favorite.idapi);

                    console.log(this.responseInfo);

                    let col = document.createElement("div");
                    col.classList.add("col-6", "col-sm-4", "col-md-3", "col-lg-2", "mb-2"); // Adjusted to make the cards smaller

                    let card = document.createElement("div");
                    card.classList.add("card", "h-100");
                    card.style.backgroundColor = "black"
                    card.style.borderColor = "white"
                    card.innerHTML = `
            <div class="card-body text-center">
                <div class="card-content">
                    <div class="row">
                        <div>
                            <img src="https://image.tmdb.org/t/p/w500${this.responseInfo[0].poster_path}" class="card-img rounded" alt="Image" style="width: 70%"><!-- Adjusted the width to make the image smaller -->
                        </div>
                    </div>    
                    <div class="row mt-2">
                        <div class="col-6">
                            <a class="navbar__link" onclick="rouletteAleatoire.removeFavorite(${favorite.idapi})">
                                <img src="../images/trash-2-white.svg" alt="Favori">
                                <span style="z-index: 9999">Supprimer de la liste</span>
                            </a>
                        </div>
                        <div class="col-6">
                            <a class="navbar__link" onclick="favori.showModal(${favorite.idapi})">
                                <img src="../images/infoWhite.svg" alt="Favori">
                                <span style="z-index: 9999">Information</span>
                            </a>
                        </div>
                    </div>            
                </div>
            </div>
            `;

                    col.appendChild(card);
                    row.appendChild(col);
                }}

            listFavorite.appendChild(row);

            // Second loop for listFavoritePhone
            for (const favorite of this.listeDeFav) {
                if (favorite.typecontenu === 'serie') {
                    this.responseInfo = await this.serieModel.getSerieByIdSerieApi(favorite.idapi);
                    console.log(this.responseInfo);

                    let rowPhone = document.createElement("div");
                    rowPhone.classList.add("row", "mb-2");

                    let cardPhone = document.createElement("div");
                    cardPhone.classList.add("card");
                    cardPhone.style.backgroundColor = "black"
                    cardPhone.innerHTML = `
            <div class="row no-gutters">
                <div class="col-4">
                    <img src="https://image.tmdb.org/t/p/w500${this.responseInfo[0].poster_path}" class="card-img" alt="Image" style="border-radius: 24px">
                </div>
                <div class="col-8">
                    <div class="card-body">
                        <h5 class="card-title" style="color: white">${this.responseInfo[0].name}</h5>
                        <div class="row mt-2">
                            <div class="col-6">
                                <a class="navbar__link" onclick="rouletteAleatoire.removeFavorite(${favorite.idapi})">
                                    <img src="../images/trash-2-white.svg" alt="Favori">
                                    <span style="z-index: 9999">Supprimer de la liste</span>
                                </a>
                            </div>
                            <div class="col-6">
                                <a class="navbar__link" onclick="favori.showModal(${favorite.idapi})">
                                    <img src="../images/infoWhite.svg" alt="Favori">
                                    <span style="z-index: 9999">Information</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;

                    rowPhone.appendChild(cardPhone);
                    listFavoritePhone.appendChild(rowPhone);
                }}

        } catch (error) {
            console.error("An error occurred while fetching favorites:", error);
        } finally {
            console.log("test");
            loadingSpinner.style.display = "none";
        }
    }

    showFiltres() {
        const filtresElements = document.querySelectorAll('.filtres');
        filtresElements.forEach(element => {
            if (element.classList.contains('show')) {
                element.classList.remove('show');
                setTimeout(() => {
                    element.style.display = 'none';
                }, 500); // Delay matches the CSS transition duration
            } else {
                element.style.display = 'block';
                setTimeout(() => {
                    element.classList.add('show');
                }, 10); // Small delay to allow the display change to take effect
            }
        });
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
export default() => window.favori = new Favori()