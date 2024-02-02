import BaseController from "../controllers/basecontroller.js"
import UserModel from "../dataModel/userModel.js";

class CreationCompteController extends BaseController {
    constructor() {
        super()
        this.userModel = new UserModel()
        document.getElementById("danger").style.display = "none"
        document.getElementById("erreur").style.display = "none"

    }

    pageConnexion(){
        navigate("index")
    }

    async creationCompte(){
        let displayName = document.getElementById("pseudo").value;
        let login = document.getElementById("login").value;
        let password = document.getElementById("password").value;

        if (displayName !== "" && login !== "" && password !== "") {
            try {
                const response = await this.userModel.createAccount(displayName, login, password);
                if (response.status === 200) {
                    console.log("Creation Compte réussie");
                    document.getElementById("danger").style.display = "none";
                    document.getElementById("erreur").style.display = "none"

                    const responseData = await response.json(); // Parse the JSON content
                    const token = responseData.token;
                    console.log(token);
                    sessionStorage.setItem("token", token);

                    navigate("formulaireRoulette")

                } else {
                    console.log("Échec Creation Compte réussie");
                    document.getElementById("erreur").style.display = "block"
                    document.getElementById("danger").style.display = "none";
                }
            }catch (e){
                throw e;
            }
        }else{
            console.log("vide");
            document.getElementById("danger").style.display = "block";
            document.getElementById("erreur").style.display = "none"
        }
    }
}

export default() => window.creationCompteController = new CreationCompteController()
