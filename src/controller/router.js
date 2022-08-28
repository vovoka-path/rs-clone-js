import routes from '../data/routes.json' assert { type: "json" };
import cabViews from '../data/cabViews.json' assert { type: "json" };

// Меню кабинета
class Router {
    constructor(controller) {
        this.controller = controller;
        this._routes = [];
        this.orderButtonListener = this.listButtons.bind(this.controller);
    }

    // метод проходится по массиву routes и создает объект на каждый маршрут
    init(role) {
        // Получаем все роуты текущего кабинета
        const cabRoutes = routes[role];

        for(let route in cabRoutes) {
            // получаем текущий статус заказов для отображения
            let roleStatus = cabRoutes[route].status;

            // регулярное выражение с которым будет сопоставляться ссылка
            // ее надо преобразовать из формата :tag в RegEx
            // модификатор g обязателен
            const pattern = new RegExp('^' + route.replace(/:\w+/g,'(\\w+)') + '$');
            
            // добавляем в массив роутов объект
            this._routes.push({
                pattern: pattern,
                callback: () => this.handleMenuClick(roleStatus),
                // callback: this[method],
            });
        }
    }

    dispatch(path) {
        this._routes.forEach((route) => {
            // смотрим есть ли маршруты
            const paths = path.match(route.pattern);

            // если машруты найдены
            // вызываем обработчик из объекта, передавая ему маршруты
            // paths.slice(1) отрезает всю найденную строку
            if (paths) route.callback.apply(this, paths.slice(1));
        })
    }

    // обработчик кликов по меню
    async handleMenuClick(roleStatus) {
        // Запоминаем новый статус работника в model
        this.controller.model.roleStatus = roleStatus;

        const allOrders = await this.controller.getOrderData();
        
        const role = this.controller.model.auth.role;
        const statuses = this.getStatuses(role, roleStatus);
        const orders = this.getOrdersByStatuses(allOrders, statuses);
        
        // console.log(`role= ${role} ! roleStatus= ${roleStatus}`);
        
        const props = {
            role: role,
            roleStatus: roleStatus,
            orderStatuses: statuses,
            order: {},
            orders: orders,
            orderButtonListener: this.orderButtonListener,
        }

        this.controller.view.cab.renderOrderList(props);
    }

    getStatuses(role, roleStatus) {
        const statuses = cabViews[role][roleStatus].statusesForOrders;

        return statuses;
    }

    getOrdersByStatuses(allOrders, statuses) {
        let orders = [];

        statuses.forEach((status) => {
            orders = [...orders, ...this.filterOrdersByStatus(allOrders, status)];
        })

        return orders;
    }

    filterOrdersByStatus(orders, status) {
        const filteredOrders = [];

        orders.forEach((order) => {
            // Получаем заказы только c текущим статусом
            if (order.status === status) {
                filteredOrders.push(order);
            }
        });

        return filteredOrders;
    }

    // обработчик кнопки списка заказов "Посмотреть заказ"
    listButtons() {
        // показать M2: Входящий заказ (один)
        return (event) => {
            // this = controller
            const orderId = event.target.id;
            const role = this.model.auth.role;
            const roleStatus = this.model.roleStatus;
            const statuses = this.listeners.router.getStatuses(role, roleStatus);

            const orders = this.model.orders;
            
            const [ currentOrder ] = orders.filter((order) => {
                return order._id === orderId;
            });

            const props = {
                role: role,
                roleStatus: roleStatus,
                orderStatuses: statuses,
                order: currentOrder,
                orders: orders,
                // orderButtonListener: this.orderButtonListener,
            }
            
            this.view.cab.cabContainer.innerHTML = '';
            this.view.cab.renderStatusView(props);
        }
    }
} 

export default Router;

// ------------------------- archive -----------------------------

// //  -- обработчики --
// // главной страницы
// signin() {
//     console.log("! signin");
// }

// ---- Меню кабинета ----

// *** delete **
// Кабинет менеджера: входящие
// async incoming(method) {
//     const role = this.controller.model.auth.role;

//     console.log(`${role} ! ${method}`);
//     const orders = await this.controller.getOrderData();
//     // console.log('# this.controller.view.cab.ordersList.render = ', this.controller.view.cab.ordersList.render);

//     this.controller.view.cab.renderOrderList({
//         orderStatus: 'incoming',
//         orders: orders,
//         orderButtonListener: this.orderButtonListener,
//     }
//     );
// }

   // Кабинет менеджера: У фотографа
//     acceptingPhotographer() {
//         const role = this.controller.model.auth.role;
//         console.log(`${role} ! acceptingPhotographer`);
//     }

//     shooting() {
//         const role = this.controller.model.auth.role;
//         console.log(`${role} ! shooting`);
//         // this.controller.view.managerCab.ordersList.renderOrderList(
//         //     [{a: 'fffffff', bb: 'nnnnnnnnnnn'}],
//         //     this.controller.buttonViewOrderListener,
//         //     );
//         // this.controller.view.managerCab.ordersList.list.innerHTML ? 
//         //     this.controller.view.managerCab.ordersList.list.innerHTML = '' : null;
//     }

//     // Кабинет менеджера: У обработчика
//     managerEditing() {
//         console.log(`! managerEditing`);
//         // this.controller.view.managerCab.createOrderList(
//         //     [],
//         //     this.controller.buttonViewOrderListener
//         // );
//         this.controller.view.managerCab.ordersList.list.innerHTML 
//             ? this.controller.view.managerCab.ordersList.list.innerHTML = '' 
//             : '';
//     }

//     // Кабинет менеджера: Отправить клиенту
//     managerSending() {
//         console.log(`! managerSending`);
//         this.controller.view.managerCab.ordersList.removeOrderList();

//         this.controller.view.managerCab.ordersList.list.innerHTML 
//             ? this.controller.view.managerCab.ordersList.list.innerHTML = '' 
//             : '';
//     }

//     // Кабинет менеджера: Завершенные
//     async managerCompleted() {
//         console.log(`! managerCompleted`);
//         // const orders = await this.controller.getOrderData();
//         // this.controller.view.managerCab.createOrderList(
//         //     orders,
//         //     this.controller.buttonViewOrderListener
//         // );
//         // this.controller.view.managerCab.ordersList.renderOrderList(
//         //     orders,
//         //     this.controller.buttonViewOrderListener
//         // );

//                 this.controller.view.managerCab.ordersList.list.innerHTML 
//             ? this.controller.view.managerCab.ordersList.list.innerHTML = '' 
//             : '';
//     }
// }

// handleMenuClick() {
//     const dispatch = this.controller.listeners.router.dispatch;
//     // console.log('# this.controller.listeners.router.dispatch = ', this.controller.listeners.router.dispatch);
//     // console.log('# this.dispatch = ', this.dispatch);

//     return (event) => {
//         event.preventDefault();
//         const menuHref = event.target.href;
//         console.log('# handleMenuClick - menuHref = ', menuHref);
//         dispatch(menuHref);
//         // const orders = this.controller.model.orders;
//         // console.log('# orders = ', orders);

//         // this.controller.view.manager.ordersList.renderOrderList({
//         //     orders: orders,
//         //     orderButtonListener: this.previewButtons,
//         // });
//     }
// }