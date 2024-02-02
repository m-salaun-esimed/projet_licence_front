import streamingPlatformRoute from "../services/streamingPlatformRoute.js";

export default class streamingPlatformModel {
    constructor() {
        this.api = new streamingPlatformRoute();
    }

    async getAllStreamingPlatform(){
        try {
            return await this.api.getAllStreamingPlatform()
        }catch (e){
            console.error(e);
            throw e;
        }
    }
}
