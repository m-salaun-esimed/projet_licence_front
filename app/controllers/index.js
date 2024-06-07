import BaseController from "../controllers/basecontroller.js"
import UserModel from "../dataModel/userModel.js";

class IndexController extends BaseController {
    constructor() {
        super()
        this.userModel = new UserModel()
        document.getElementById("danger").style.display = "none"
        document.getElementById("erreur").style.display = "none"
        const storedToken = sessionStorage.getItem("token");
        console.log(`constructor : storedToken : ${storedToken}`)
        if (storedToken) {
            this.verifyToken(storedToken);
        }
    }

    async verifyToken(token) {
        try {
            const response = await this.userModel.verifyToken(token);

            if (response.status === 200) {
                console.log("Token valide. Redirection vers la page appropriée...");
                navigate("formulaireRoulette");
            } else {
                console.log("Token invalide. Connectez-vous à nouveau.");
                localStorage.removeItem("token");
            }
        } catch (error) {
            console.error("Erreur lors de la vérification du token", error);
            localStorage.removeItem("token");
        }
    }

    async authenticate() {
        let login = document.getElementById("login").value.trim();
        let password = document.getElementById("password").value;
        console.log(`login : ${login}`)
        if (login !== "" && password !== "") {
            console.log(`login, password : ${login}, ${password}`);

            try {
                const response = await this.userModel.authenticate(login.toLowerCase(), password);

                if (response.status === 200) {
                    console.log("Authentification réussie");
                    document.getElementById("danger").style.display = "none";
                    document.getElementById("erreur").style.display = "none"
                    const responseData = await response.json(); // Parse the JSON content
                    const token = responseData.token;
                    console.log(token);
                    const user = responseData.user;
                    console.log("user " + user)
                    sessionStorage.setItem("token", "Bearer " + token);
                    localStorage.setItem("login", user);

                    navigate("formulaireRoulette")
                } else {
                    console.log("Échec de l'authentification");
                    document.getElementById("erreur").style.display = "block"
                    document.getElementById("danger").style.display = "none";
                }
            } catch (error) {
                console.error("Erreur lors de l'authentification", error);
                document.getElementById("erreur").style.display = "block"
                document.getElementById("danger").style.display = "none";
            }
        } else {
            console.log("vide");
            document.getElementById("danger").style.display = "block";
            document.getElementById("erreur").style.display = "none"
        }
    }

    creationCompte(){
        navigate("creationCompte")
    }

    togglePasswordVisibility(inputId, iconId) {
        const passwordInput = document.getElementById(inputId);
        const eyeIcon = document.getElementById(iconId);

        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            eyeIcon.src = "../images/eyeWhite.svg";
            eyeIcon.alt = "Hide password";
        } else {
            passwordInput.type = "password";
            eyeIcon.src = "../images/eye-off-white.svg";
            eyeIcon.alt = "Show password";
        }
    }
}

export default() => window.indexController = new IndexController()
