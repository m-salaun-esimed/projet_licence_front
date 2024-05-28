import BaseController from "../controllers/basecontroller.js"
import UserModel from "../dataModel/userModel.js";

class CreationCompteController extends BaseController {
    constructor() {
        super()
        this.userModel = new UserModel()
        document.getElementById("erreur").textContent = ""
        document.getElementById("erreur").style.display = "none"
        const passwordInput = document.querySelector(".pass-field input");
        const eyeIcon = document.querySelector(".pass-field i");
        const requirementList = document.querySelectorAll(".requirement-list li");

// An array of password requirements with corresponding
// regular expressions and index of the requirement list item
        const requirements = [
            { regex: /.{8,}/, index: 0 }, // Minimum of 8 characters
            { regex: /[0-9]/, index: 1 }, // At least one number
            { regex: /[a-z]/, index: 2 }, // At least one lowercase letter
            { regex: /[^A-Za-z0-9]/, index: 3 }, // At least one special character
            { regex: /[A-Z]/, index: 4 }, // At least one uppercase letter
        ]

        passwordInput.addEventListener("keyup", (e) => {
            requirements.forEach(item => {
                const isValid = item.regex.test(e.target.value);
                const requirementItem = requirementList[item.index];

                if (isValid) {
                    requirementItem.classList.add("valid");
                    requirementItem.firstElementChild.className = "fa-solid fa-check";
                } else {
                    requirementItem.classList.remove("valid");
                    requirementItem.firstElementChild.className = "fa-solid fa-circle";
                }
            });
        });

        eyeIcon.addEventListener("click", () => {
            // Toggle the password input type between "password" and "text"
            passwordInput.type = passwordInput.type === "password" ? "text" : "password";
            eyeIcon.className = `fa-solid fa-eye${passwordInput.type === "password" ? "" : "-slash"}`;
        });
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
                        if (response.status === 200) {
                            console.log("Creation Compte réussie");
                            document.getElementById("erreur").style.display = "none";

                            // const responseData = await response.json(); // Parse the JSON content
                            // const token = responseData.token;
                            // console.log(token);
                            // sessionStorage.setItem("token", token);

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
