import UserRoute from "../services/userRoute.js";

export default class userModel {
    constructor() {
        this.api = new UserRoute();
    }

    async authenticate(login, password){
        let data = {
            login : login,
            password : password
        }

        try {
            console.log("userModel : authenticate")
            return await this.api.authenticate(data)
        }catch (e){
            throw e;
        }
    }

    async createAccount(displayName, login, password){
        let data = {
            displayName : displayName,
            login : login,
            password : password
        }

        try {
            console.log("userModel : authenticate")
            return await this.api.createAccount(data)
        }catch (e){
            throw e;
        }
    }

    async verifyToken(token){
        try {
            let data = {
                authorization : token
            }
            console.log("userModel : verifyToken")
            return await this.api.verifyToken(data)
        }catch (e){
            throw e;
        }
    }


}
