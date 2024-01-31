export default class Api {
    constructor() {
        this.apiServer = "http://localhost:3333";
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