class Button {
    constructor() {
        this.header = this.createHeader();
    }

    render(text) {
        const buttonOrder = document.createElement('button');
        buttonOrder.className = 'btn-status';
        buttonOrder.innerText = text;
        // buttonOrder.setAttribute('id', order._id);

        // Вешаем обработчик
        buttonOrder.addEventListener('click', orderButtonListener());
        
        this.order = this.orderContainer.append(buttonOrder);
    }

    createHeader() {
        const header = document.createElement('h3');
        // header.innerText = 'incoming';

        return header;
    }

    createList(status = 'incoming') {

        const list = document.createElement('h3');
        // header.innerText = 'incoming';

        return list;
    }
}

export default Button;
