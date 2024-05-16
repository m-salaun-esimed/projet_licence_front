import AmiModel from "../dataModel/amiModel.js";
import UserModel from "../dataModel/userModel.js";
import SerieModel from "../dataModel/serieModel.js";
import MoviesModel from "../dataModel/moviesModel.js";

class AdminController {
    constructor() {
        this.userModel = new UserModel();

        this.serieModel = new SerieModel();
        this.moviesModel = new MoviesModel();
    }
    showContent(contentType){
        var contentContainer = document.getElementById('contentContainer');
        var content = '';

        var courseItems = document.getElementsByClassName("ag-courses_item");
        for (var i = 0; i < courseItems.length; i++) {
            courseItems[i].style.display = 'none';
        }

        var box = document.getElementsByClassName("ag-courses_box");
        for (var i = 0; i < box.length; i++) {
            box[i].style.display = 'none';
        }

        switch (contentType) {
            case 'ajouterFilmSerie':
                content = ' <div class="ag-courses_item mt-3">\n' +
                    '                <a class="ag-courses-item_link">\n' +
                    '                    <div></div>\n' +
                    '                    <div class="ag-courses-item_title">\n' +
                    '                        Ajouter film / série\n' +
                    '                    </div>\n' +
                    '                </a>\n' +
                    '            </div>';
                break;
            case 'supprimerFilmSerie':
                content = '<div class="ag-courses_item mt-3">\n' +
                    '                <a class="ag-courses-item_link">\n' +
                    '                    <div></div>\n' +
                    '                    <div class="ag-courses-item_title">\n' +
                    '                        Supprimer film / série\n' +
                    '                    </div>\n' +
                    '                </a>\n' +
                    '            </div>' +
                    '<div class="ag-courses_item">\n' +
                    '                <div class="ag-courses-item_content">\n' +
                    '                    <h2>Formulaire de suppression</h2>\n' +
                    '                    <form id="deleteForm" class="m-3">\n' +
                    '                        <label for="mediaType">Choisir entre Film ou Série:</label><br>\n' +
                    '                        <div class="d-flex justify-content-center align-items-center mb-3">\n' +
                    '                            <input type="radio" id="film" name="mediaType" value="film" class="me-2">\n' +
                    '                            <label for="film" class="me-3">Film</label>\n' +
                    '                            <input type="radio" id="serie" name="mediaType" value="serie" class="me-2">\n' +
                    '                            <label for="serie">Série</label>\n' +
                    '                        </div>\n' +
                    '                        <label for="identifierType">Choisir le type d\'identification:</label><br>\n' +
                    '                        <div class="d-flex justify-content-center align-items-center mb-3">\n' +
                    '                            <input type="radio" id="id" name="identifierType" value="id" class="me-2">\n' +
                    '                            <label for="id" class="me-3">ID</label>\n' +
                    '                            <input type="radio" id="name" name="identifierType" value="name" class="me-2">\n' +
                    '                            <label for="name">Nom</label>\n' +
                    '                        </div>\n' +
                    '                        <label for="identifier">Entrez l\'identifiant (idapi) ou le nom:</label><br>\n' +
                    '                        <input type="text" id="identifier" name="identifier" class="form-control mb-3"><br>\n' +
                    '                        <button type="button" class="btn btn-primary" onclick="adminController.deleteSerie()"> Supprimer</button>\n' +
                    '                    </form>\n' +
                    '                </div>\n' +
                    '            </div>';
                break;

            case 'updateFilmSerie':
                content = ' <div class="ag-courses_item mt-3">\n' +
                    '                <a class="ag-courses-item_link">\n' +
                    '                    <div></div>\n' +
                    '                    <div class="ag-courses-item_title">\n' +
                    '                        Mettre à jour film / série\n' +
                    '                    </div>\n' +
                    '                </a>\n' +
                    '            </div>' +
                    '<div class="ag-courses_item">\n' +
                    '                <div class="ag-courses-item_content">\n' +
                    '                    <h2>Mettre à jour</h2>\n' +
                    '                    <form id="updateFilmSerie" class="m-3">\n' +
                    '                        <label for="mediaTypeUpdate">Choisir entre Film ou Série:</label><br>\n' +
                    '                        <div class="d-flex justify-content-center align-items-center mb-3">\n' +
                    '                            <input type="radio" id="filmUpdate" name="mediaTypeUpdate" value="film" class="me-2">\n' +
                    '                            <label for="filmUpdate" class="me-3">Film</label>\n' +
                    '                            <input type="radio" id="serieUpdate" name="mediaTypeUpdate" value="serie" class="me-2">\n' +
                    '                            <label for="serieUpdate">Série</label>\n' +
                    '                        </div>\n' +
                    '                        <label for="identifierTypeUpdate">Choisir le type d\'identification:</label><br>\n' +
                    '                        <div class="d-flex justify-content-center align-items-center mb-3">\n' +
                    '                            <input type="radio" id="idUpdate" name="identifierTypeUpdate" value="id" class="me-2">\n' +
                    '                            <label for="idUpdate" class="me-3">ID</label>\n' +
                    '                            <input type="radio" id="nameUpdate" name="identifierTypeUpdate" value="name" class="me-2">\n' +
                    '                            <label for="nameUpdate">Nom</label>\n' +
                    '                        </div>\n' +
                    '                        <label for="identifierUpdate">Entrez l\'identifiant (idapi) ou le nom:</label><br>\n' +
                    '                        <input type="text" id="identifierUpdate" name="identifierUpdate" class="form-control mb-3"><br>\n' +
                    '                        <label for="newName">Changer le nom :</label><br>\n' +
                    '                        <input type="text" id="newName" name="newName" class="form-control mb-3"><br>\n' +
                    '                        <label for="overview">Changer le Synopsis :</label><br>\n' +
                    '                        <input type="text" id="overview" name="overview" class="form-control mb-3"><br>\n' +
                    '                        <button type="button" class="btn btn-primary" onclick="adminController.update()">Update</button>\n' +
                    '                    </form>\n' +
                    '                </div>\n' +
                    '            </div>';
                break;
            case 'addDeleteUser':
                content = ' <div class="ag-courses_item mt-3">\n' +
                    '                <a class="ag-courses-item_link">\n' +
                    '                    <div></div>\n' +
                    '                    <div class="ag-courses-item_title">\n' +
                    '                        Ajouter un utilisateur' +
                    '                    </div>\n' +
                    '                </a>\n' +
                    '            </div>' +
                    '<div class="ag-courses_item">\n' +
                    '                <div class="ag-courses-item_content">\n' +
                    '                    <h2>Formulaire d\'ajout d\'un utilisateur</h2>\n' +
                    '                    <form>\n' +
                    '                        <div class="form-group">\n' +
                    '                            <div class="row">\n' + // Ajout d'une rangée pour aligner horizontalement les champs
                    '                                <div class="col">\n' + // Colonne pour "Votre pseudo"
                    '                                    <input type="text" class="form-control" id="pseudo" placeholder="Pseudo">\n' +
                    '                                </div>\n' +
                    '                                <div class="col">\n' + // Colonne pour "login (adresse mail)"
                    '                                    <input type="email" class="form-control" id="login" placeholder="Login (adresse mail)">\n' +
                    '                                </div>\n' +
                    '                            </div>\n' +
                    '                        </div>\n' +
                    '                        <div class="form-group input-group mt-3">\n' +
                    '                            <input type="password" class="form-control" id="password" placeholder="Mot de passe">\n' +
                    '                            <input type="password" class="form-control" id="password2" placeholder="Verifier mot de passe">\n' +
                    '                            <div class="input-group-prepend">\n' +
                    '                            </div>\n' +
                    '                        </div>\n' +
                    '                        <div class="row mt-3">\n' +
                    '                            <div class="col d-flex justify-content-center">\n' +
                    '                                <button type="button" class="btn btn-outline-primary" onclick="adminController.creationCompte()">Créer un compte</button>\n' +
                    '                            </div>\n' +
                    '                        </div>\n' +
                    '                    </form>\n' +
                    '                </div>\n' +
                    '            </div>';
                break;


            case 'updateMdpUser':
                content = ' <div class="ag-courses_item mt-3">\n' +
                    '                <a class="ag-courses-item_link">\n' +
                    '                    <div></div>\n' +
                    '                    <div class="ag-courses-item_title">\n' +
                    '                        Modifier le mot de passe d un utilisateur ' +
                    '                    </div>\n' +
                    '                </a>\n' +
                    '            </div>' +
                    '<div class="ag-courses_item">\n' +
                    '                <div class="ag-courses-item_content">\n' +
                    '                    <h2>Modifier mot de passe user</h2>\n' +
                    '                    <form>\n' +
                    '                        <div class="form-group">\n' +
                    '                            <input type="email" class="form-control" id="loginPwd" placeholder="Adresse mail">\n' +
                    '                        </div>\n' +
                    '                        <div class="form-group mt-3">\n' +
                    '                            <input type="text" class="form-control" id="pwd" placeholder="Nouveau mot de passe">\n' +
                    '                        </div>\n' +
                    '                        <div class="row mt-3">\n' +
                    '                            <div class="col d-flex justify-content-center">\n' +
                    '                                <button type="button" class="btn btn-primary" onclick="adminController.updatePwd()">Modifier</button>\n' +
                    '                            </div>\n' +
                    '                        </div>\n' +
                    '                    </form>\n' +
                    '                </div>\n' +
                    '            </div>';
                break;
            case 'deleteUser':
                content = ' <div class="ag-courses_item mt-3">\n' +
                    '                <a class="ag-courses-item_link">\n' +
                    '                    <div></div>\n' +
                    '                    <div class="ag-courses-item_title">\n' +
                    '                         Supprimer un utilisateur' +
                    '                    </div>\n' +
                    '                </a>\n' +
                    '            </div>'+
                    '<div class="ag-courses_item">\n' +
                    '                <div class="ag-courses-item_content">\n' +
                    '                    <h2>Supprimer un utilisateur</h2>\n' +
                    '                    <form>\n' +
                    '                        <div class="form-group">\n' +
                    '                            <input type="email" class="form-control" id="email" placeholder="Adresse e-mail de l\'utilisateur">\n' +
                    '                        </div>\n' +
                    '                        <div class="row mt-3">\n' +
                    '                            <div class="col d-flex justify-content-center">\n' +
                    '                                <button type="button" class="btn btn-danger" onclick="adminController.deleteUser()">Supprimer</button>\n' +
                    '                            </div>\n' +
                    '                        </div>\n' +
                    '                    </form>\n' +
                    '                </div>\n' +
                    '            </div>';
                break;

        }

        contentContainer.innerHTML = content;
    }

    async deleteUser() {
        try {
            const email = document.getElementById('email').value;
            const response = await this.userModel.deleteUser(email);
            console.log(response)
            alert(response.message)
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'utilisateur:', error);
        }
    }
    async deleteSerie() {
        const mediaType = document.querySelector('input[name="mediaType"]:checked').value;
        const identifierType = document.querySelector('input[name="identifierType"]:checked').value;
        const identifier = document.getElementById('identifier').value;
        let response;

        try {
            if (mediaType === 'serie'){
                if (identifierType === 'id') {
                    await this.serieModel.deleteSerie("idserieapi", identifier);
                } else if (identifierType === 'name') {
                    await this.serieModel.deleteSerie(identifierType, identifier);
                }
            }
            else {
                if (identifierType === 'id') {
                    await this.moviesModel.deleteMovie("idmovieapi", identifier);
                } else if (identifierType === 'name') {
                    await this.moviesModel.deleteMovie(identifierType, identifier);
                }
            }
            document.getElementById("identifier").innerText = '';
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            alert('Erreur lors de la suppression .');
        }
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
                            alert("Creation Compte réussie")
                        } else {
                            console.log("Échec Creation Compte");
                            if (response.status === 400) {
                                const errorData = await response.json();
                                console.error("Erreur API:", errorData.error);

                                alert("Erreur")
                            }
                        }
                    }catch (e){
                        throw e;
                    }
                }
                else{

                    alert("Mot de passe non identique")
                }
            }else{
                alert("login non comforme : format adresse mail")
            }
        }else{
          alert("Veuillez remplir tout les champs")
        }
    }

    async update(){
        var mediaType = document.querySelector('input[name="mediaTypeUpdate"]:checked').value;
        var identifierType = document.querySelector('input[name="identifierTypeUpdate"]:checked').value;
        var identifier = document.getElementById('identifierUpdate').value;
        var newName = document.getElementById('newName').value;
        var overview = document.getElementById('overview').value;

        console.log(mediaType)
        console.log(identifierType)
        console.log(identifier)
        console.log(newName)
        console.log(overview)
        try {
            var args = {};

            if (newName.trim() !== '') {
                args.newName = newName;
            }
            if (overview.trim() !== '') {
                args.overview = overview;
            }
            if (mediaType === 'serie') {
                if (identifierType === 'id') {
                    args.id = identifier;
                } else if (identifierType === 'name') {
                    args.name = identifier;
                }
                await this.serieModel.updateSerie(args);
            } else {
                if (identifierType === 'id') {
                    args.id = identifier;
                    console.log("oui")
                } else if (identifierType === 'name') {
                    args.name = identifier;
                }
                await this.moviesModel.updateMovie(args);
            }

            document.getElementById("identifier").innerText = '';
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
        }
    }

    async updatePwd(){
        let login = document.getElementById("loginPwd").value
        let pwd = document.getElementById("pwd").value
        try{
            let result = await this.userModel.updatePwd(login, pwd);
            alert(result.message)
            document.getElementById("loginPwd").innerText = ''
            document.getElementById("pwd").innerText = ''
        }catch (error){

        }

    }
}

export default() => window.adminController = new AdminController()