export default class Api {
    constructor() {
        this.apiServer = "https://www.main-bvxea6i-ilzfunk6nmoog.fr-4.platformsh.site";
        // this.apiServer = "http://localhost:3333";

        this.myHeaders = new Headers({
            "Au":""
        })
    }

    myFetch(url) {
        return new Promise(((resolve, reject) => {
            fetch(`${this.apiServer}/${url}`,
                {headers: this.myHeaders})
                .then(response => {
                    if (response.status === 200) {
                        resolve(response.json())
                    } else {
                        reject(response.status)
                    }
                })
                .catch(err => reject(err))
        }))
    }
}