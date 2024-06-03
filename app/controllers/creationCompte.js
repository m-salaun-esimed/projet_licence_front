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
            const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            let verifierSiEmailEstValide =  regexEmail.test(login);
            if (verifierSiEmailEstValide){
                if (password === password2){
                    try {
                        const response = await this.userModel.createAccount(displayName, login, password);
                        if (response.ok) {
                            console.log("Creation Compte réussie");
                            document.getElementById("erreur").style.display = "none";
                            navigate("index")
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
                const errorDiv = document.getElementById("erreur");
                errorDiv.textContent = ""
                errorDiv.textContent = "login non comforme : format adresse mail";
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
