document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.getElementById('bookingForm');
    const confirmationModal = document.getElementById('confirmationModal');
    const modalMessage = document.getElementById('modalMessage');
    const closeButton = document.querySelector('.close-button');

    if (bookingForm) {
        bookingForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Предотвращаем стандартную отправку формы

            // Собираем данные из формы
            const genderElement = document.querySelector('input[name="gender"]:checked');
            const gender = genderElement ? genderElement.value : '';
            const bookingDate = document.getElementById('bookingDate').value;
            const bookingTime = document.getElementById('bookingTime').value;
            const service = document.getElementById('service').value;

            // Базовая клиентская валидация
            if (!gender || !bookingDate || !bookingTime || !service) {
                modalMessage.textContent = "Пожалуйста, заполните все обязательные поля формы!";
                confirmationModal.style.display = 'flex';
                return;
            }

            // Создаем объект с данными для записи
            const formData = {
                gender: gender,
                date: bookingDate,
                time: bookingTime,
                service: service
            };

            console.log('Отправка данных онлайн-записи:', formData);

            // Отправляем данные на PHP-скрипт
            fetch('process_form.php', { // путь к PHP-файлу 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Отправляем данные в формате JSON
                },
                body: JSON.stringify(formData), // Преобразуем объект в строку JSON
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json(); // Ожидаем JSON-ответ от PHP
            })
            .then(data => {
                if (data.success) {
                    modalMessage.textContent = "Спасибо за использование онлайн-записи! Будем ждать вас на процедуре.";
                    bookingForm.reset(); // Очищаем форму
                } else {
                    // Если PHP вернул success: false
                    modalMessage.textContent = data.message || "Произошла ошибка при записи. Пожалуйста, попробуйте еще раз.";
                }
                confirmationModal.style.display = 'flex'; // Показываем модальное окно
            })
            .catch((error) => {
                console.error('Ошибка при отправке или получении ответа:', error);
                modalMessage.textContent = "Произошла ошибка при отправке запроса. Пожалуйста, проверьте ваше подключение или свяжитесь с нами по телефону.";
                confirmationModal.style.display = 'flex';
            });
        });
    }

    // Закрытие модального окна по кнопке "x"
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            confirmationModal.style.display = 'none';
        });
    }

    // Закрытие модального окна при клике вне его
    if (confirmationModal) {
        window.addEventListener('click', function(event) {
            if (event.target == confirmationModal) {
                confirmationModal.style.display = 'none';
            }
        });
    }

    // Установка минимальной даты для input[type="date"] при загрузке страницы
    const bookingDateInput = document.getElementById('bookingDate');
    if (bookingDateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // Месяцы от 0 до 11
        const dd = String(today.getDate()).padStart(2, '0');
        bookingDateInput.min = `${yyyy}-${mm}-${dd}`;
    }
});
