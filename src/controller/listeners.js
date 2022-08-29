import Router from './router.js';
import { getStatuses, getOrdersByStatuses } from '../utils/utils.js';

class Listeners extends Router{
    constructor() {
        super();
    }
    
    bindHandlers(controller) {
        this.controller = controller;
        this.orderButtonListener = this.orderButtonListenerNotBind.bind(this.controller);
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
            const orders = await this.controller.getOrderData(this.controller.model.auth.token);
            const statuses = getStatuses(role, roleStatus);

            // const filteredOrders = this.router.filterOrdersByStatus(orders, startStatus);
            const filteredOrders = getOrdersByStatuses(orders, statuses)
            
            const props = {
                role: role,
                roleStatus: roleStatus,
                orderStatuses: statuses,
                order: {},
                orders: filteredOrders,
                orderButtonListener: this.orderButtonListener,
            };

            // console.log('# L props = ', props.orderButtonListener);
            
            // Рисуем кабинет со списком входящих заказов
            this.controller.view.renderCab(props);
            // Вешаем на меню обработчики
            this.routingMenu(role);
        }, true);
    }
    
    // обработчик кликов по меню
    async handleMenuClick(roleStatus) {
        // Запоминаем новый статус работника в model
        this.controller.model.roleStatus = roleStatus;

        const allOrders = await this.controller.getOrderData();
        
        const role = this.controller.model.auth.role;
        const statuses = getStatuses(role, roleStatus);
        const orders = getOrdersByStatuses(allOrders, statuses);
        
        // console.log(`role= ${role} ! roleStatus= ${roleStatus}`);
        
        const props = {
            role: role,
            roleStatus: roleStatus,
            orderStatuses: statuses,
            order: {},
            orders: orders,
            orderButtonListener: this.orderButtonListener,
            statusButtonListener: null, // добавляем после входа в конкретный заказ
        }

        this.controller.view.cab.renderOrderList(props);
    }

    statusButtonListener() {

    }

    // обработчик кнопки списка заказов "Посмотреть заказ"
    orderButtonListenerNotBind() {
        // показать M2: Входящий заказ (один)
        return (event) => {
            // this = controller
            // console.log('# orderButtonListener: this = ', this);
            const orderId = event.target.id;
            const role = this.model.auth.role;
            const roleStatus = this.model.roleStatus;
            const statuses = getStatuses(role, roleStatus);

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

export default Listeners;
