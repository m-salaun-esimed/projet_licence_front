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
        this.ajouterAmiModel = new AmiModel()
        this.choix = [];
        this.verifyAdmin();
        // const rechercheInputs = document.getElementById('recherche');
        // rechercheInputs.addEventListener('input', this.autocomplete.bind(this))

        // const rechercheInputsNavBar = document.getElementById('rechercheNavBar');
        // rechercheInputsNavBar.addEventListener('input', this.autocompleteNavBar.bind(this))
        this.init();
        this.addOptionsList().then(options => {
            this.options = options;
            console.log(this.options)
            this.addMovieList();
            this.startAngle = 0;
            this.arc = Math.PI / (this.options.length / 2);
            this.spinTimeout = null;
            this.spinTime = 0;
            this.spinTimeTotal = 0;
            this.ctx = null;
            document.getElementById("spin").addEventListener("click", () => this.spin());
            // document.getElementById("spinPersonnalisee").addEventListener("click", () => this.spinPersonnalisee());

            this.drawRouletteWheel();
            this.sideBar();
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
        for (let y = 0; y < 2; y ++){
            for (let i = 0; i < this.options.length; i++) {
                let slideDiv = document.createElement("div");
                slideDiv.classList.add("slide");

                let movieImage = document.createElement("img");
                movieImage.src = 'https://image.tmdb.org/t/p/w500' + this.options[i].poster_path;
                movieImage.style.width = "40%";
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

    sideBar() {
        const sidebar = document.getElementById('sidebar');
        const toggleButton = document.getElementById('toggleButton');
        const content = document.querySelector('.content');

        toggleButton.addEventListener('click', () => {
            sidebar.classList.toggle('closed');
            content.classList.toggle('expanded');
        });
    }

    resetSettings() {
       location.reload()

        localStorage.removeItem("listGenre");
        localStorage.removeItem("type");

        navigate("formulaireRoulette");
    }



    drawRouletteWheel() {
        var canvas = document.getElementById("canvas");
        if (canvas.getContext) {
            var outsideRadius = 200;
            var textRadius = 160;
            var insideRadius = 125;

            this.ctx = canvas.getContext("2d");
            this.ctx.clearRect(0, 0, 500, 500);
            this.ctx.font = 'bold 10px Helvetica, Arial';
            this.ctx.fillStyle = "#ECECEC";
            for (var i = 0; i < this.options.length; i++) {
                var angle = this.startAngle + i * this.arc;
                this.ctx.beginPath();
                this.ctx.arc(250, 250, outsideRadius, angle, angle + this.arc, false);
                this.ctx.arc(250, 250, insideRadius, angle + this.arc, angle, true);
                this.ctx.stroke();
                this.ctx.fill();

                this.ctx.save();
                this.ctx.shadowOffsetX = -1;
                this.ctx.shadowOffsetY = -1;
                this.ctx.shadowBlur = 0;
                this.ctx.shadowColor = "rgb(220,220,220)";
                this.ctx.fillStyle = "black";
                this.ctx.translate(250 + Math.cos(angle + this.arc / 2) * textRadius,
                    250 + Math.sin(angle + this.arc / 2) * textRadius);
                this.ctx.rotate(angle + this.arc / 2 + Math.PI / 2);
                var text = this.options[i].name;
                this.ctx.fillText(text, -this.ctx.measureText(text).width / 2, 0);
                this.ctx.restore();
            }

            //Arrow
            this.ctx.fillStyle = "black";
            this.ctx.beginPath();
            this.ctx.moveTo(250 - 4, 250 - (outsideRadius + 5));
            this.ctx.lineTo(250 + 4, 250 - (outsideRadius + 5));
            this.ctx.lineTo(250 + 4, 250 - (outsideRadius - 5));
            this.ctx.lineTo(250 + 9, 250 - (outsideRadius - 5));
            this.ctx.lineTo(250 + 0, 250 - (outsideRadius - 13));
            this.ctx.lineTo(250 - 9, 250 - (outsideRadius - 5));
            this.ctx.lineTo(250 - 4, 250 - (outsideRadius - 5));
            this.ctx.lineTo(250 - 4, 250 - (outsideRadius + 5));
            this.ctx.fill();
        }
    }

    spin() {
        this.spinAngleStart = Math.random() * 10 + 10;
        this.spinTime = 0;
        this.spinTimeTotal = Math.random() * 3 + 4 * 1000;
        this.rotateWheel();
    }

    rotateWheel() {
        this.spinTime += 150;
        if (this.spinTime >= this.spinTimeTotal) {
            this.stopRotateWheel();
            return;
        }
        var spinAngle = this.spinAngleStart - this.easeOut(this.spinTime, 0, this.spinAngleStart, this.spinTimeTotal);
        this.startAngle += (spinAngle * Math.PI / 180);
        this.drawRouletteWheel();
        this.spinTimeout = setTimeout(() => this.rotateWheel(), 30);
    }

    stopRotateWheel() {
        clearTimeout(this.spinTimeout);
        var degrees = this.startAngle * 180 / Math.PI + 90;
        var arcd = this.arc * 180 / Math.PI;
        var index = Math.floor((360 - degrees % 360) / arcd);
        this.index = index;
        this.ctx.save();
        this.ctx.font = 'bold 10px Helvetica, Arial';
        if (localStorage.getItem("type") === "film"){
            this.showModalMovie(index)
        }else {
            this.showModalSerie(index)
        }

        this.ctx.restore();
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
            const platformsData = response.flatrate.slice(0, 3); // Sélectionner les 3 premières plateformes

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

        // var modalFooter = document.createElement('div');
        // modalFooter.classList.add('modal-footer');
        //
        // var footerContent = `
        // <div class="row text-center">
        //     <div class="col-4">
        //         <button type="button" class="btn rounded-circle" style="background-color: #22303C" title="Ajouter à ma liste"
        //                 onclick="rouletteAleatoire.addFavoriteRecherche(${random.idapi})">
        //             <img src="../images/plus-circle%20(1).svg" width="20" height="20" alt="Favori">
        //         </button>
        //     </div>
        //     <div class="col-4">
        //         <button type="button" class="btn rounded-circle" style="background-color: #22303C" title="Ajouter aux déjà vu"
        //                 onclick="rouletteAleatoire.addDejaVuRecherche(${random.idapi})">
        //             <img src="../images/eye-slash-fill.svg" width="20" height="20" alt="Déjà vu" id="imageModal">
        //         </button>
        //     </div>
        //     <div class="col-4">
        //         <button type="button" class="btn rounded-circle" style="background-color: #22303C" data-bs-dismiss="modal">
        //             <img src="../images/x-circle.svg" width="20" height="20" alt="Fermer">
        //         </button>
        //     </div>
        // </div>`;
        //
        // modalFooter.innerHTML = footerContent;
        //
        // var footerRecherche = document.getElementById('footerRecherche');
        // footerRecherche.innerHTML = '';
        // footerRecherche.appendChild(modalFooter);
    }

    easeOut(t, b, c, d) {
        var ts = (t /= d) * t;
        var tc = ts * t;
        return b + c * (tc + -3 * ts + 3 * t);
    }

    refreshRoulette(){
        location.reload();
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
            navigate("favori");
        } catch (error) {
            console.error("Une erreur s'est produite lors de la récupération du token :", error);
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
            navigate("dejavu");
        } catch (error) {
            console.error("Une erreur s'est produite lors de la récupération du token :", error);
        }
    }

    async addFriendsPage(){
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
            navigate("ajouter_ami");
        } catch (error) {
            console.error("Une erreur s'est produite lors de la récupération du token :", error);
        }
    }

    async addFavorite(index) {
        try {
            const responseIdUser = await this.userModel.getIdUser(sessionStorage.getItem("token"), localStorage.getItem("login"));
            const responseAllFav = await this.favoriteModel.getAllFavorite(responseIdUser[0].id);
            console.log(responseAllFav)
            for(let i = 0; i < responseAllFav.length; i++){
                console.log(responseAllFav[i].idapi)
                if (responseAllFav[i].idapi === this.options[index].idapi){
                    console.log("reponse idapi : " + responseAllFav[i].idapi)
                    console.log("idapi modal : " + this.options[index].idapi)
                    alert("Film déjà dans les favoris");
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
            alert("Le film a été ajouté avec succès à la liste.");
        } catch (error) {
            console.error("Erreur lors de l'ajout du film aux favoris :", error);
            alert("Une erreur est survenue lors de l'ajout du film aux favoris. Veuillez réessayer plus tard.");
        }
    }

    // async addFavoriteRecherche(idapi) {
    //     try {
    //         const responseIdUser = await this.userModel.getIdUser(sessionStorage.getItem("token"), localStorage.getItem("login"));
    //         const responseAllFav = await this.favoriteModel.getAllFavorite(responseIdUser[0].id);
    //         console.log(responseAllFav)
    //         for(let i = 0; i < responseAllFav.length; i++){
    //             console.log(responseAllFav[i].idapi)
    //             if (responseAllFav[i].idapi === this.options[index].idapi){
    //                 console.log("reponse idapi : " + responseAllFav[i].idapi)
    //                 console.log("idapi modal : " + this.options[index].idapi)
    //                 alert("Film déjà dans les favoris");
    //                 return;
    //             }
    //         }
    //         console.log(this.options[index].id);
    //         const data = {
    //             idapi: this.options[index].idapi,
    //             idUser: responseIdUser[0].id,
    //             typecontenu: localStorage.getItem("type")
    //         };
    //         const response = await this.favoriteModel.postFavoriteMovie(sessionStorage.getItem("token"), data);
    //         console.log(response);
    //         alert("Le film a été ajouté avec succès à la liste.");
    //     } catch (error) {
    //         console.error("Erreur lors de l'ajout du film aux favoris :", error);
    //         alert("Une erreur est survenue lors de l'ajout du film aux favoris. Veuillez réessayer plus tard.");
    //     }
    // }

    async addDejaVu(index){
        try {
            const responseAllFav = await this.dejaVuModel.getAllAlreadySeenMovie();
            for( let i = 0; i < responseAllFav.length; i++){
                console.log(responseAllFav[i].idapi)
                if (responseAllFav[i].idapi === this.options[index].idapi){
                    console.log("reponse idapi : " + responseAllFav[i].idapi)
                    console.log("idapi modal : " + this.options[index].idapi)
                    alert("Film déjà dans les déjà vu");
                    return;
                }
            }
            const data = {
                idapi: this.options[index].idapi,
                typecontenu: localStorage.getItem("type")
            };
            const response = await this.dejaVuModel.postAlreadySeenMovie(sessionStorage.getItem("token"), data);
            console.log(response);
            alert("Le film a été ajouté avec succès aux déjà vu.");
            location.reload();
        } catch (error) {
            console.error("Erreur lors de l'ajout du film aux favoris :", error);
            alert("Une erreur est survenue lors de l'ajout du film aux favoris. Veuillez réessayer plus tard.");
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


    renderAutocompleteResults(suggestions) {
        const autocompleteList = document.querySelector('.autocomplete-results');
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
                this.addFilmToChoice(suggestion);

            });
            autocompleteList.appendChild(listItem);
        });

        if (suggestions.length > maxSuggestions) {
            const seeMoreButton = document.createElement('button');
            seeMoreButton.textContent = 'Voir plus';
            seeMoreButton.classList = "btn btn-primary m-3";
            seeMoreButton.addEventListener('click', () => {
                console.log('Afficher plus de suggestions...');
                navigate("recherche")
            });
            autocompleteList.appendChild(seeMoreButton);
        }
    }

    addFilmToChoice(film) {
        this.choix.push(film);
        console.log(this.choix);

        const dynamicContenu = document.getElementById("dynamicContenu");
        dynamicContenu.innerHTML = "";

        this.choix.forEach(choix => {
            const filmContainer = document.createElement("div");
            filmContainer.classList.add("film-container");

            const img = document.createElement("img");
            img.src = 'https://image.tmdb.org/t/p/w500' + choix.poster_path;

            const paragraph = document.createElement("p");
            paragraph.textContent = choix.name;

            filmContainer.appendChild(img);
            filmContainer.appendChild(paragraph);
            dynamicContenu.appendChild(filmContainer);
        });
    }




    clearAutocompleteResults() {
        const autocompleteList = document.querySelector('.autocomplete-results');
        autocompleteList.innerHTML = '';

        const autocompleteListNavBar = document.querySelector('.autocomplete-results-navBar');
        autocompleteListNavBar.innerHTML = '';
    }

    async autocomplete(event) {
        const recherche = event.target.value.trim();

        if (recherche.length === 0) {
            this.clearAutocompleteResults();
            return;
        }

        try {
            const suggestions = await this.moviesModel.getCompletion(sessionStorage.getItem("token"), recherche);
            console.log(suggestions);
            this.renderAutocompleteResults(suggestions);
        } catch (error) {
            console.error(error);
        }
    }

    async autocompleteNavBar(event){
        const recherche = event.target.value.trim();

        if (recherche.length === 0) {
            this.clearAutocompleteResults();
            return;
        }

        try {
            const suggestions = await this.moviesModel.getCompletion(sessionStorage.getItem("token"), recherche);
            console.log(suggestions);
            this.renderAutocompleteResultsNavBar(suggestions, recherche);
        } catch (error) {
            console.error(error);
        }
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

    spinPersonnalisee(){
        if (this.choix.length === 0) {
            console.log("Aucun film disponible.");
            return;
        }

        const randomIndex = Math.floor(Math.random() * this.choix.length);
        const random = this.choix[randomIndex];

        console.log("Film choisi aléatoirement :", random);
        console.log(random.type)
        this.showModal(random)
    }

    redirectionHomePage(){
        navigate("rouletteAleatoire")
    }

    friendsPage(){
        navigate("amis")
    }

    actualitePage(){
        navigate("actualitePage")
    }
}

export default () => window.rouletteAleatoire = new RouletteAleatoire();
