// import dataOrders from '../data/orderData.json'  assert { type: "json" };
// import Router from './router.js';
import Listeners from './listeners.js';
import Api from './api.js';

const START_PAGE = 'signin';

class Controller {
    constructor(view, model) {
        this.view = view;
        this.model = model;
        this.api = new Api();
        // this.router = new Router(this);
        this.pageName = START_PAGE;
        // this.startPage = 'signin';
        
        this.listeners = new Listeners(this);
        this.pageListeners = {
            signin: () => this.listeners.signIn(),
            manager: (role) => this.listeners.routingMenu(role),
            photographer: (role) => this.listeners.routingMenu(role),
            editor: (role) => this.listeners.routingMenu(role),
        };
    }

    start() {
        this.view.renderSignIn();
        this.listeners.signIn();

        // this.updateOrder('630383851f03c78cc3562156', 'acceptingPhotographer');
        // this.updateOrder('6303848981b5339d4fce5d22', 'shooting');
        // this.updateOrder('6308cbd1a509b499eb04583b', 'acceptingEditor');
        // this.updateOrder('630387d47188d92f664ce91b', 'editing');
        // this.updateOrder('630389da26bf30f0c954b7a1', 'sending');
        // this.updateOrder('6305126d2bd69b0dc944d90b', 'completed');
        // this.updateOrder('63051ec92bd69b0dc944d90e', 'canceled');
        // this.updateOrder('6307c2896e7892024474117e', 'feedbacks');
        // this.updateOrder('6307c28d6e78920244741180', 'shooting');
        // this.updateOrder('6307c2d36e78920244741183', 'editing');
        // this.updateOrder('6308cbbfa509b499eb045835', 'shooting');
    }

    async getRole(formData) {
        const json = await this.api.signIn(formData);
        const data = json.data;

        this.model.setAuth(data);

        return data;
    }
    
    async getOrderData(){
        const orders = await this.api.getOrderData();
        this.model.orders = orders;
        // console.log('# orders = ', orders);

        return orders;
    }

    updateOrder(id, orderStatus) {
        const data = {
            _id: id,
            status: orderStatus,
        }
        const token = this.model.auth.token;

        this.api.updateOrder({ data, token })
        this.model.orderStatus = orderStatus;
    }
   
}

export default Controller;

// ------------------------- archive -----------------------------

    // renderCab(pageName) {
    //     const role = this.model.getAuth().role;

    //     this.view.container.innerHTML = '';

    //     (async () => {
    //         const orders = await this.getOrderData();
    //         this.view.render(pageName, orders, this.listeners.router.previewButtons());
    //         this.pageListeners[pageName](role);
    //     })();
    // }
        // if (this.pageName === 'signin') {
        //     // без запроса orderDara
        //     this.view.render(this.pageName);
        //     this.pageListeners[this.pageName](role);
        // } else {
        //     // c запросом orderData
        //     this.renderCab(this.pageName);
        // }

    // setCurrentPageListener(role) {
    //     this.listeners[role]();
    // }

    // async getOrderData() {
    //     // get from api
    //     const data = await this.getCars();
    //     console.log('# data = ', data);

    //     return data;
    //     // return dataOrders;
    // }

    
    // updateURL(path) {
    //     if (history.pushState) {
    //         var baseUrl = window.location.protocol 
    //             + "//" + window.location.host 
    //             // + window.location.pathname;
    //         var newUrl = baseUrl + path;
    //         history.pushState(null, null, newUrl);
    //     }
    //     else {
    //         console.warn('History API не поддерживает ваш браузер');
    //     }
    // }
       

    // setHandlers() {
    //     this.view.handlers.Submit = this.Submit;
    //     this.view.handlers.Submit = this.Submit;
    // }

    // handleSignInButton(event) {
    //     event.preventDefault();
    //     console.log('# this = ', this);
    //     const password = this.view.signIn.input.value; signIn.input.value;
    //     console.log('handleSignInButton: password=', password);
        
    //     // this.api.setRole(password);
    //     this.model.setRole(password);
    //     // this.view.renderHeader(this.func1);
    //     this.view.innerHTML = '';
    //     this.view.renderStartPage(this.model.startPageData);
    // }