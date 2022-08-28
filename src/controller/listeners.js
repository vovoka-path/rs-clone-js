import Router from './router.js';

class Listeners {
    constructor(controller) {
        this.controller = controller;
        this.router = new Router(this.controller);
    }

    async signIn() {
        const view = this.controller.view;

        view.signIn.button.addEventListener('click', async event => {
            event.preventDefault();
            
            const formData = {
                username: view.signIn.login.value,
                password: view.signIn.password.value,
            }
            
            const json = await this.controller.getRole(formData);
            const { role } = json;

            // const startStatus = this.controller.model.startStatuses[role];
            const roleStatus = 'incoming';

            // Сохраняем текущую статус заказа в model - надо ли?
            this.controller.model.roleStatus = roleStatus;
            
            // TODO?: get orders depend on defaultStatus
            const orders = await this.controller.getOrderData();
            const statuses = this.router.getStatuses(role, roleStatus);

            // const filteredOrders = this.router.filterOrdersByStatus(orders, startStatus);
            const filteredOrders = this.router.getOrdersByStatuses(orders, statuses)
            
            const props = {
                role: role,
                roleStatus: roleStatus,
                orderStatuses: statuses,
                order: {},
                orders: filteredOrders,
                orderButtonListener: this.router.orderButtonListener,
            };

            // console.log('# L props = ', props.orderButtonListener);
            
            // Рисуем кабинет со списком входящих заказов
            this.controller.view.renderCab(props);
            // Вешаем на меню обработчики
            this.routingMenu(role);
        }, true);
    }

    routingMenu(role) {
        const view = this.controller.view;

        this.router.init(role);

        // обработчик нажатий на ссылки
        let handler = event =>  {
            event.preventDefault();
            
            let url = new URL(event.currentTarget.href);
            
            // запускаем роутер, предавая ему path
            this.router.dispatch(url.pathname);

            // заголовок DELETE!
            view.cab.ordersList.header.innerText = url.pathname.split('/')[2];

            return false;
        }

        // получаем все ссылки на странице
        let anchors = document.getElementsByName('menu-item');
        
        // вешаем на событие click обработчик
        for( let anchor of anchors ) {
            anchor.addEventListener('click', handler);
        }
    }
}

export default Listeners;
