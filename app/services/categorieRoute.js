import Api from "./api.js";

export default class CategorieRoute extends Api {
    constructor() {
        super();
    }

    async getAllCategorieMovie(token) {
        try {
            console.log("token : " + token)
            let events = `movieCategory`
            const response = await fetch(`${this.apiServer}/${events}`, { method: 'GET', headers:{
                    authorization : token
                }  });
            const data = await response.json();
            return data;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }
}
