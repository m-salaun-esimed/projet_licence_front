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

    async creationCompte(){
        let displayName = document.getElementById("pseudo").value;
        let login = document.getElementById("login").value;
        let password = document.getElementById("password").value;
        let password2 = document.getElementById("password2").value;
        if (displayName !== "" && login !== "" && password !== "" && password2 !== "") {
            if (password === password2){
                try {
                    const response = await this.userModel.createAccount(displayName, login, password);
                    if (response.status === 200) {
                        console.log("Creation Compte réussie");
                        document.getElementById("erreur").style.display = "none";

                        const responseData = await response.json(); // Parse the JSON content
                        const token = responseData.token;
                        console.log(token);
                        sessionStorage.setItem("token", token);

                        navigate("formulaireRoulette")

                    } else {
                        console.log("Échec Creation Compte");
                        if (response.status === 400) {
                            const errorData = await response.json();
                            console.error("Erreur API:", errorData.error);

                            const errorDiv = document.getElementById("erreur");
                            errorDiv.textContent = ""
                            errorDiv.textContent = errorData.error;
                            errorDiv.style.display = "block";
                        }
                    }
            }catch (e){
                    throw e;
                }
            }
            else{
                const errorDiv = document.getElementById("erreur");
                errorDiv.textContent = ""
                errorDiv.textContent = "Mot de passe non identique";
                errorDiv.style.display = "block";
            }
        }else{
            console.log("vide");
            const errorDiv = document.getElementById("erreur");
            errorDiv.textContent = ""
            errorDiv.textContent = "Veuillez remplir tout les champs";
            errorDiv.style.display = "block";

        }
    }
}

export default() => window.creationCompteController = new CreationCompteController()
