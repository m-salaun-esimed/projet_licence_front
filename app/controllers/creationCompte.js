import BaseController from "../controllers/basecontroller.js"
import UserModel from "../dataModel/userModel.js";

class CreationCompteController extends BaseController {
    constructor() {
        super()
        this.userModel = new UserModel()
        document.getElementById("erreur").textContent = ""
        document.getElementById("erreur").style.display = "none"
    }

    pageConnexion(){
        navigate("index")
    }

    async creationCompte() {
        const displayName = document.getElementById("pseudo").value.trim();
        const login = document.getElementById("login").value.trim();
        const password = document.getElementById("password").value.trim();
        const password2 = document.getElementById("password2").value.trim();

        // Validate required fields
        if (!displayName || !login || !password || !password2) {
            this.displayError("Veuillez remplir tout les champs");
            return;
        }

        // Validate email format
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexEmail.test(login)) {
            this.displayError("email non comforme : format adresse mail");
            return;
        }

        // Validate password match
        if (password !== password2) {
            this.displayError("Mot de passe non identique");
            return;
        }

        try {
            const response = await this.userModel.createAccount(displayName, login, password);
            if (response.ok) {
                document.getElementById("erreur").style.display = "none";
                alert("Création du compte réussite !")
            } else {
                console.log("Échec Creation Compte");
                const errorData = await response.json();
                console.error("Erreur API:", errorData.error);
                this.handleAPIError(errorData.error);
            }
        } catch (error) {
            console.error("Une erreur est survenue:", error);
        }
    }

    displayError(errorMessage) {
        const errorDiv = document.getElementById("erreur");
        errorDiv.textContent = errorMessage;
        errorDiv.style.display = "block";
    }

    handleAPIError(apiErrorMessage) {
        this.displayError(`${apiErrorMessage}`);
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

export default() => window.creationCompteController = new CreationCompteController()
