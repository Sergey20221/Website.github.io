// script.js

document.addEventListener('DOMContentLoaded', function() {

    // --- Модальные окна ---
    const orderButton = document.getElementById('orderButton');
    const orderModal = document.getElementById('orderModal');
    const closeOrderModal = document.getElementById('closeOrderModal');
    const cartButton = document.getElementById('cartButton');
    const cartModal = document.getElementById('cart');
    const closeCartModal = document.getElementById('closeCartModal');

    const checkoutButton = document.getElementById('checkoutButton');
    const checkoutModal = document.getElementById('checkoutModal');
    const closeCheckoutModal = document.getElementById('closeCheckoutModal');

    // --- Элементы счетчика товаров в корзине (в шапке) ---
    const cartItemCount = document.getElementById('cartItemCount');

    // --- Корзина ---
    let cartItems = []; // Массив для хранения товаров
    let cartTotal = 0;
    const cartList = document.getElementById('cartList');
    const cartTotalElement = document.getElementById('cartTotal');
    const checkoutCartList = document.getElementById('checkoutCartList');
    const checkoutCartTotalElement = document.getElementById('checkoutCartTotal');

    // --- Функция для форматирования цены ---
    function formatPrice(price) {
        return price.toLocaleString('ru-RU');
    }

    // --- Функция для обновления отображения корзины ---
    function updateCartDisplay() {
        cartList.innerHTML = ''; // Очищаем список в корзине
        checkoutCartList.innerHTML = ''; // Очищаем список в форме оформления заказа
        cartTotal = 0;

        cartItems.forEach((item, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span>${item.productName} - ${formatPrice(item.price)} руб.</span>
                <button class="remove-from-cart" data-index="${index}"><i class="fas fa-trash"></i></button>
            `;
            cartList.appendChild(listItem);

            const checkoutListItem = document.createElement('li');
            checkoutListItem.textContent = `${item.productName} - ${formatPrice(item.price)} руб.`;
            checkoutCartList.appendChild(checkoutListItem);

            cartTotal += item.price;
        });

        cartTotalElement.textContent = formatPrice(cartTotal);
        checkoutCartTotalElement.textContent = formatPrice(cartTotal);

        // Отображаем/скрываем корзину и кнопку оформления заказа
        if (cartItems.length > 0) {
            cartButton.style.display = 'inline-flex'; // Отображаем кнопку корзины
            checkoutButton.style.display = 'inline-block'; // Отображаем кнопку "Оформить заказ"
        } else {
            cartButton.style.display = 'none'; // Скрываем кнопку корзины
            checkoutButton.style.display = 'none'; // Скрываем кнопку "Оформить заказ"
        }

        // Обновляем счетчик товаров в шапке
        cartItemCount.textContent = cartItems.length;

        // Добавляем обработчики удаления (после добавления элементов)
        document.querySelectorAll('.remove-from-cart').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.dataset.index, 10);
                removeItemFromCart(index);
            });
        });
    }

    // --- Функция для удаления товара из корзины ---
    function removeItemFromCart(index) {
        cartItems.splice(index, 1);
        updateCartDisplay();
    }

    // --- Функция добавления товара в корзину ---
    function addToCart(productName, price) {
        cartItems.push({ productName: productName, price: price });
        updateCartDisplay();
    }

    // --- Обработчики для модальных окон ---
    orderButton.addEventListener('click', function() {
        orderModal.style.display = 'block';
    });

    closeOrderModal.addEventListener('click', function() {
        orderModal.style.display = 'none';
    });

    closeCartModal.addEventListener('click', function() {
        cartModal.style.display = 'none';
    });

    closeCheckoutModal.addEventListener('click', function() {
        checkoutModal.style.display = 'none';
    });

    cartButton.addEventListener('click', function() {
        updateCartDisplay();
        cartModal.style.display = 'block';
    });

    // Закрытие модальных окон при клике вне контента
    window.addEventListener('click', function(event) {
        if (event.target == orderModal || event.target == cartModal || event.target == checkoutModal) {
            // Закрываем модальное окно только если клик был вне контента
            if (event.target === orderModal || event.target === cartModal || event.target === checkoutModal) {
                 orderModal.style.display = 'none';
                 cartModal.style.display = 'none';
                 checkoutModal.style.display = 'none';
            }
        }
    });

    // --- Валидация и отправка формы заказа (первое окно) ---
    const orderForm = document.getElementById('orderForm');
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');

    orderForm.addEventListener('submit', function(event) {
        event.preventDefault();

        let isValid = true;

        if (nameInput.value.trim() === "") {
            isValid = false;
            nameInput.classList.add('invalid');
        } else {
            nameInput.classList.remove('invalid');
        }

        const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
        if (!phoneRegex.test(phoneInput.value.trim())) {
            isValid = false;
            phoneInput.classList.add('invalid');
        } else {
            phoneInput.classList.remove('invalid');
        }

        if (isValid) {
            const name = nameInput.value;
            const phone = phoneInput.value;
            const product = document.getElementById('product').value;
            const comment = document.getElementById('comment').value;

            console.log('Заказ (первое окно) отправлен:', { name, phone, product, comment });
            orderModal.style.display = 'none';
            alert('Заказ (первое окно) успешно отправлен!');
            orderForm.reset();
        } else {
            alert('Пожалуйста, заполните все поля корректно.');
        }
    });

   // --- Обработчики отправки формы оформления заказа (из корзины) ---
    const checkoutForm = document.getElementById('checkoutForm');
    const nameCheckoutInput = document.getElementById('nameCheckout');
    const phoneCheckoutInput = document.getElementById('phoneCheckout');

    // --- Оформление заказа из корзины ---
    checkoutButton.addEventListener('click', function() {
        if (cartItems.length === 0) {
            alert('Ваша корзина пуста!');
            return;
        }
        checkoutModal.style.display = 'block';
    });

    checkoutForm.addEventListener('submit', function(event) {
        event.preventDefault();

        let isValid = true;

        if (nameCheckoutInput.value.trim() === "") {
            isValid = false;
            nameCheckoutInput.classList.add('invalid');
        } else {
            nameCheckoutInput.classList.remove('invalid');
        }

        const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
        if (!phoneRegex.test(phoneCheckoutInput.value.trim())) {
            isValid = false;
            phoneCheckoutInput.classList.add('invalid');
        } else {
            phoneCheckoutInput.classList.remove('invalid');
        }

        if (isValid) {
            const name = nameCheckoutInput.value;
            const phone = phoneCheckoutInput.value;

            console.log('Оформление заказа:', { name, phone, cartItems: cartItems });

            checkoutModal.style.display = 'none';
            cartItems = [];
            updateCartDisplay();
            alert('Заказ успешно оформлен!');
            checkoutForm.reset();
        } else {
            alert('Пожалуйста, заполните все поля корректно.');
        }
    });


    // --- Очистка класса invalid при изменении полей (для обеих форм) ---
    const inputFields = document.querySelectorAll('.order-form input[type="text"], .order-form input[type="tel"]');
    inputFields.forEach(input => {
        input.addEventListener('input', function() {
            this.classList.remove('invalid');
        });
    });

    // --- Добавление в корзину (обработчики на кнопках) ---
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.dataset.product;
            const price = parseInt(this.dataset.price, 10);
            addToCart(productName, price);
        });
    });
});