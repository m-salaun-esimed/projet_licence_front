import Api from "./api.js";

export default class UserRoute extends Api {
    constructor() {
        super();
        this.routesUrl = `streamingPlatform`;
    }

    async getAllStreamingPlatform() {
        console.log(`getAllStreamingPlatform ${this.apiServer}/${this.routesUrl}`);
        try {
            const response = await fetch(`${this.apiServer}/${this.routesUrl}`, { method: 'GET' });
            const data = await response.json();
            return data;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

}
