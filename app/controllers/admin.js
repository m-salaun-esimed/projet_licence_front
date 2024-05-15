import AmiModel from "../dataModel/amiModel.js";
import UserModel from "../dataModel/userModel.js";

class AdminController {
    constructor() {

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
                    '                        <input type="radio" id="film" name="mediaType" value="film">\n' +
                    '                        <label for="film">Film</label><br>\n' +
                    '                        <input type="radio" id="serie" name="mediaType" value="serie">\n' +
                    '                        <label for="serie">Série</label><br><br>\n' +
                    '                        <label for="identifierType">Choisir le type d\'identification:</label><br>\n' +
                    '                        <input type="radio" id="id" name="identifierType" value="id">\n' +
                    '                        <label for="id">ID</label><br>\n' +
                    '                        <input type="radio" id="name" name="identifierType" value="name">\n' +
                    '                        <label for="name">Nom</label><br><br>\n' +
                    '                        <label for="identifier">Entrez l\'identifiant ou le nom:</label><br>\n' +
                    '                        <input type="text" id="identifier" name="identifier"><br><br>\n' +
                    '                        <button type="button" class="btn btn-primary"> Supprimer</button>\n' +
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
                    '            </div>';
                break;
            case 'addDeleteUser':
                content = ' <div class="ag-courses_item mt-3">\n' +
                    '                <a class="ag-courses-item_link">\n' +
                    '                    <div></div>\n' +
                    '                    <div class="ag-courses-item_title">\n' +
                    '                        Ajouter Supprimer un utilisateur' +
                    '                    </div>\n' +
                    '                </a>\n' +
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
                    '            </div>';
                break;

            case 'addDeleteAdmin':
                content = ' <div class="ag-courses_item mt-3">\n' +
                    '                <a class="ag-courses-item_link">\n' +
                    '                    <div></div>\n' +
                    '                    <div class="ag-courses-item_title">\n' +
                    '                        Ajouter supprimer un admin' +
                    '                    </div>\n' +
                    '                </a>\n' +
                    '            </div>';
                break;
        }

        contentContainer.innerHTML = content;
    }
}

export default() => window.adminController = new AdminController()