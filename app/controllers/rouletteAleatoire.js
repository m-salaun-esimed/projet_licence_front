import MoviesModel from "../dataModel/moviesModel.js";
import FavoriteModel from "../dataModel/favoriteModel.js";
import UserModel from "../dataModel/userModel.js";
import DejaVuModel from "../dataModel/dejaVuModel.js";
import SerieModel from "../dataModel/serieModel.js";
import AjouterAmiModel from "../dataModel/ajouterAmiModel.js";


class RouletteAleatoire {
    constructor() {
        this.moviesModel = new MoviesModel()
        this.favoriteModel = new FavoriteModel()
        this.userModel = new UserModel()
        this.dejaVuModel = new DejaVuModel()
        this.serieModel = new SerieModel()
        this.ajouterAmiModel = new AjouterAmiModel()
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
            this.drawRouletteWheel();
            this.sideBar();
        }).catch(error => {
            console.error(error);
        });

    }

    addMovieList() {
        let filmList = document.getElementsByClassName("slide-track")[0];
        for (let y = 0; y < 2; y ++){
            for (let i = 0; i < this.options.length; i++) {
                let slideDiv = document.createElement("div");
                slideDiv.classList.add("slide");

                let movieImage = document.createElement("img");
                movieImage.src = 'https://image.tmdb.org/t/p/w500' + this.options[i].poster_path;
                movieImage.style.width = "50%";
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
        const responses = await this.ajouterAmiModel.afficherLesDemandes(sessionStorage.getItem("token"));
        var badge = document.getElementById("notification");
        badge.innerText = `${responses.length}`
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
        this.spinTime += 30;
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
        this.index = index
        var text = this.options[index].name;
        var modal = new bootstrap.Modal(document.getElementById('modalMovie'));
        modal.show();
        var infoMovie = document.querySelector('.nameMovie');
        infoMovie.innerText = text;

        var descriptionMovie = document.querySelector('.descriptionMovie');
        var descriptionMovietext = this.options[index].overview;
        descriptionMovie.innerText = descriptionMovietext;

        const response = await this.moviesModel.getPlatforms(this.options[index].idapi, sessionStorage.getItem("token"));
        console.log(response);

        if (response && response.flatrate) {
            const platformsData = response.flatrate;

            let platformsHTML = '';
            platformsData.forEach(platform => {
                platformsHTML += `<div class="platform-info" style="display: flex; align-items: center;">
            <p>${platform.provider_name}</p>
            <img src="https://image.tmdb.org/t/p/w500/${platform.logo_path}" alt="${platform.provider_name} Logo" style="width: 30%;">
        </div>`;
            });

            const platformsElement = document.querySelector('.platforms');
            platformsElement.innerHTML = platformsHTML;
        } else {
            console.error("La réponse de l'API n'est pas valide ou les données des plateformes sont vides.");
        }

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

        var noteMovie = document.getElementsByClassName("noteMovie")[0];
        var noteMovieMovietext = this.options[index].note;
        noteMovie.innerHTML = '<div>' + noteMovieMovietext + '/10</div>';

        var modalFooter = document.querySelector('.modal-footer');
        modalFooter.innerHTML = '';

        modalFooter.appendChild(viewedButton);
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
            const platformsData = response.flatrate;

            let platformsHTML = '';
            platformsData.forEach(platform => {
                platformsHTML += `<div class="platform-info" style="display: flex; align-items: center;">
            <p>${platform.provider_name}</p>
            <img src="https://image.tmdb.org/t/p/w500/${platform.logo_path}" alt="${platform.provider_name} Logo" style="width: 30%;">
        </div>`;
            });

            const platformsElement = document.querySelector('.platformsSerie');
            platformsElement.innerHTML = platformsHTML;
        } else {
            let platformsHTML = '';

            const platformsElement = document.querySelector('.platformsSerie');
            platformsElement.innerHTML = platformsHTML;
            console.error("La réponse de l'API n'est pas valide ou les données des plateformes sont vides.");
        }

        var noteMovie = document.getElementsByClassName("noteSerie")[0];
        var noteMovieMovietext = this.options[index].note;
        noteMovie.innerHTML = '<div>' + noteMovieMovietext + '/10</div>';

        var modalFooter = document.querySelector('.modal-footer');
        modalFooter.innerHTML = '';

        modalFooter.appendChild(viewedButton);""
    }

    easeOut(t, b, c, d) {
        var ts = (t /= d) * t;
        var tc = ts * t;
        return b + c * (tc + -3 * ts + 3 * t);
    }

    refreshRoulette(){
        location.reload();
    }

    favoriPage(){
        navigate("favori")
    }

    alreadyseenPage(){
        navigate("dejavu")
    }

    addFriendsPage(){
        navigate("ajouter_ami")
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

}

export default () => window.rouletteAleatoire = new RouletteAleatoire();
