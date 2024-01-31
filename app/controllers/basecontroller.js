export default class BaseController {
    constructor() {
        this.setBackButtonView('index')
    }
    toast(elemId) {
        // const toast = new bootstrap.Toast(document.getElementById(elemId))
        // toast.show()
    }
    setBackButtonView(view) {
        window.onpopstate = function() {
            navigate(view)
        }; history.pushState({}, '');
    }
}
