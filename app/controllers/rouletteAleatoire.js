import MoviesModel from "../dataModel/moviesModel.js";

class RouletteAleatoire {
    constructor() {
        this.moviesModel = new MoviesModel()

        this.init();
        this.addOptionsList().then(options => {
            this.options = options;
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


    async addOptionsList() {
        try {
            const listGenre = JSON.parse(localStorage.getItem("listGenre")); // Convertir la chaîne JSON en tableau
            const categoryids = listGenre.map(genre => genre.id);
            console.log(categoryids);
            const response = await this.moviesModel.get5RandomMovies(categoryids);
            console.log(response);
            return response;
        } catch (error) {
            console.error(error);
            return [];
        }
    }



    init() {
        let type = document.getElementById("type");
        let movieGenres = document.getElementById("genres");
        let storedType = localStorage.getItem("type");
        let storedGenres = localStorage.getItem("listGenre");

        type.innerText = storedType;

        let selectedGenres = JSON.parse(storedGenres);
        let genreNames = selectedGenres.map(genre => genre.name).join(', ');
        movieGenres.innerText = genreNames;
    }

    sideBar() {
        const sidebar = document.getElementById('sidebar');
        const toggleButton = document.getElementById('toggleButton');
        const content = document.querySelector('.content');

        toggleButton.addEventListener('click', function () {
            sidebar.classList.toggle('closed');
            content.classList.toggle('expanded');
        });
    }
    resetSettings() {
        localStorage.removeItem("listGenre");
        localStorage.removeItem("type");
        navigate("formulaireRoulette");
    }

    byte2Hex(n) {
        var nybHexString = "0123456789ABCDEF";
        return String(nybHexString.substr((n >> 4) & 0x0F, 1)) + nybHexString.substr(n & 0x0F, 1);
    }

    RGB2Color(r, g, b) {
        return '#' + this.byte2Hex(r) + this.byte2Hex(g) + this.byte2Hex(b);
    }

    getColor(item, maxitem) {
        var phase = 0;
        var center = 128;
        var width = 127;
        var frequency = Math.PI * 2 / maxitem;

        var red = Math.sin(frequency * item + 2 + phase) * width + center;
        var green = Math.sin(frequency * item + 0 + phase) * width + center;
        var blue = Math.sin(frequency * item + 4 + phase) * width + center;

        return this.RGB2Color(red, green, blue);
    }

    drawRouletteWheel() {
        var canvas = document.getElementById("canvas");
        if (canvas.getContext) {
            var outsideRadius = 200;
            var textRadius = 160;
            var insideRadius = 125;

            this.ctx = canvas.getContext("2d");
            this.ctx.clearRect(0, 0, 500, 500);

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
        this.ctx.save();
        this.ctx.font = 'bold 30px Helvetica, Arial';
        var text = this.options[index].name;
        this.ctx.fillText(text, 250 - this.ctx.measureText(text).width / 2, 250 + 10);
        var modal = new bootstrap.Modal(document.getElementById('modalMovie'));
        modal.show();
        var infoMovie = document.querySelector('.nameMovie');
        infoMovie.innerText = text;
        var descriptionMovie = document.querySelector('.descriptionMovie');
        var descriptionMovietext = this.options[index].overview;
        descriptionMovie.innerText = descriptionMovietext;
        this.ctx.restore();
    }

    easeOut(t, b, c, d) {
        var ts = (t /= d) * t;
        var tc = ts * t;
        return b + c * (tc + -3 * ts + 3 * t);
    }
}

export default () => window.rouletteAleatoire = new RouletteAleatoire();
