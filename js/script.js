// Этот код выполняется после полной загрузки HTML-документа
// js/script.js

// Весь JavaScript код должен быть обернут в один document.addEventListener('DOMContentLoaded'),
// чтобы он выполнялся только после полной загрузки и парсинга HTML-документа.
document.addEventListener('DOMContentLoaded', function() {
    console.log('Сайт студии красоты "Кудряшка" загружен!');

    // --- 1. Плавная прокрутка к секции при клике на ссылку в навигации ---
    // ИСПРАВЛЕНО: Синтаксическая ошибка в forEach (было `anchor =goToSlide {`, стало `anchor => {`)
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // Отменяем стандартное действие ссылки

            const targetId = this.getAttribute('href'); // Получаем ID целевой секции
            const targetElement = document.querySelector(targetId); // Находим целевой элемент

            if (targetElement) { // Убедимся, что элемент существует
                targetElement.scrollIntoView({
                    behavior: 'smooth' // Делаем прокрутку плавной
                });
            }
        });
    });

    // --- 2. Обработка формы онлайн-записи ---
    // ИСПРАВЛЕНО: Отсутствующие закрывающие скобки и неправильные логические операторы
    const bookingForm = document.querySelector('#book-online form'); // Ищем форму записи по ID контейнера и тегу form

    if (bookingForm) { // Проверяем, существует ли форма на текущей странице, прежде чем добавлять слушателя
        bookingForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Предотвращаем стандартную отправку формы

            // Получаем значения полей
            // Добавляем .trim() для удаления лишних пробелов в начале и конце строк
            // Добавляем проверки на существование элементов, чтобы избежать ошибок, если ID полей вдруг не найдутся
            const userName = document.getElementById('name') ? document.getElementById('name').value.trim() : '';
            const userPhone = document.getElementById('phone') ? document.getElementById('phone').value.trim() : '';
            const chosenService = document.getElementById('service') ? document.getElementById('service').value : '';

            // Простая валидация
            // ИСПРАВЛЕНО: Добавлены логические операторы '||' (ИЛИ)
            // Условие: если имя короче 2 символов ИЛИ телефон короче 10 символов ИЛИ услуга не выбрана (пустая строка)
            if (userName.length < 2 || userPhone.length < 10 || chosenService === '') {
                alert('Пожалуйста, заполните все обязательные поля!');
            }
            else {
                // ИСПРАВЛЕНО: Используются ОБРАТНЫЕ КАВЫЧКИ (``) для шаблонной строки
                alert(`Спасибо, ${userName}! Ваша заявка на ${chosenService} принята. Мы свяжемся с вами по телефону ${userPhone} для уточнения и подтверждения.`);
                // Здесь в реальном проекте будут AJAX-запросы для отправки данных на сервер
                bookingForm.reset(); // Очищаем форму
            }
        }); // ЗДЕСЬ ДОЛЖНА БЫТЬ ЗАКРЫВАЮЩАЯ СКОБКА ДЛЯ addEventListener
    } // ЗДЕСЬ ДОЛЖНА БЫТЬ ЗАКРЫВАЮЩАЯ СКОБКА ДЛЯ if (bookingForm)


    // --- 3. Функционал Карусели (Слайдера) ---
    // Переменные для карусели
    const slider = document.querySelector('.carousel-slider');
    const images = document.querySelectorAll('.carousel-slider img');
    const prevBtn = document.querySelector('.carousel-button.prev');
    const nextBtn = document.querySelector('.carousel-button.next');
    const dotsContainer = document.querySelector('.carousel-dots');

    let currentIndex = 0;
    const totalImages = images.length;

    // Важно: Проверить, что элементы карусели существуют
    if (!slider || totalImages === 0 || !dotsContainer) {
        console.warn('Карусель не может быть инициализирована: отсутствуют необходимые HTML-элементы.');
        // Выходим из функции, если нет элементов карусели, чтобы избежать ошибок
        return;
    }

    // Функция для обновления отображения слайдера
    function updateCarousel() {
        // Убедимся, что images[0] существует, прежде чем обращаться к clientWidth
        // Если imageWidth вдруг 0 (например, изображение еще не загрузилось или его стили мешают),
        // это может быть причиной непрокрутки.
        const imageWidth = images[0] ? images[0].clientWidth : 0;

        if (imageWidth === 0 && totalImages > 0) {
            console.warn('Ширина первого изображения равна 0. Карусель может не работать корректно. Проверьте CSS или загрузку изображений.');
        }

        // ИСПРАВЛЕНО: Используются ОБРАТНЫЕ КАВЫЧКИ (``) для шаблонной строки
        slider.style.transform = `translateX(${-currentIndex * imageWidth}px)`;
        updateDots();
    }

    // Создание точек пагинации
    function createDots() {
        // Очищаем контейнер точек перед созданием, чтобы избежать дублирования
        // если эта функция вдруг вызовется несколько раз.
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalImages; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            dot.dataset.index = i; // Сохраняем индекс слайда в данных точки
            dotsContainer.appendChild(dot);

            dot.addEventListener('click', () => {
                goToSlide(i);
            });
        }
    }

    // Обновление активной точки
    function updateDots() {
        const dots = document.querySelectorAll('.carousel-dots .dot');
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // Переход к конкретному слайду
    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
    }

    // Обработчик для кнопки "Вперед"
    if (nextBtn) { // Проверяем, существует ли кнопка
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % totalImages; // Переход к следующему, если последний - к первому
            updateCarousel();
        });
    }

    // Обработчик для кнопки "Назад"
    if (prevBtn) { // Проверяем, существует ли кнопка
        prevBtn.addEventListener('click', () => {
            // + totalImages нужен, чтобы результат % всегда был положительным для currentIndex - 1, если currentIndex = 0
            currentIndex = (currentIndex - 1 + totalImages) % totalImages;
            updateCarousel();
        });
    }

    // Инициализация карусели при загрузке страницы
    createDots(); // Создаем точки
    updateCarousel(); // Показываем первый слайд и активируем первую точку

    // Добавляем обработчик изменения размера окна, чтобы карусель корректно пересчитывала ширину
    window.addEventListener('resize', updateCarousel);

}); // ЗДЕСЬ ДОЛЖНА БЫТЬ ЗАКРЫВАЮЩАЯ СКОБКА ДЛЯ ГЛАВНОГО document.addEventListener('DOMContentLoaded')

    // Инициализация карусели при загрузке страницы
    createDots(); // Создаем точки
    updateCarousel(); // Показываем первый слайд и активируем первую точку

    // Опционально: автоматическая прокрутка (раскомментировать, если нужно)
   // const intervalTime = 5000; // 5 секунд
    // let autoSlideInterval = setInterval(() => {
    //   currentIndex = (currentIndex + 1) % totalImages;
     // updateCarousel();
    // }, intervalTime);

    // Остановка автопрокрутки при наведении мыши (опционально)
    // const carouselContainer = document.querySelector('.carousel-container');
    // carouselContainer.addEventListener('mouseenter', () => {
    //     clearInterval(autoSlideInterval);
   // });
   // carouselContainer.addEventListener('mouseleave', () => {
    //    autoSlideInterval = setInterval(() => {
      //       currentIndex = (currentIndex + 1) % totalImages;
      //       updateCarousel();
      //  }, intervalTime);
   //  });

    // Добавляем обработчик изменения размера окна, чтобы карусель корректно пересчитывала ширину
    window.addEventListener('resize', updateCarousel);
    document.addEventListener('DOMContentLoaded', function() {
    // 1. Получаем все изображения в галерее, на которые будет осуществляться клик
    const galleryImages = document.querySelectorAll('.gallery-item img');

    // 2. Получаем основные элементы лайтбокса по их ID и классам
    const lightboxOverlay = document.getElementById('lightbox-overlay');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');

    // 3. Проверяем, что все эти элементы найдены на странице.
    // Это важно, чтобы избежать ошибок в консоли, если скрипт подключен на других страницах без галереи.
    if (galleryImages.length > 0 && lightboxOverlay && lightboxImg && lightboxClose) {
        // 4. Для каждого изображения в галерее добавляем "слушатель событий" (event listener) на клик
        galleryImages.forEach(image => {
            image.addEventListener('click', function() {
                // 5. При клике:
                //    a. Получаем путь к полноразмерному изображению.
                //       Сначала пробуем взять из атрибута data-full-src (это предпочтительно для больших фото).
                //       Если data-full-src не указан, берем путь из обычного атрибута src.
                const fullSrc = this.getAttribute('data-full-src') || this.src;
                lightboxImg.src = fullSrc; // Устанавливаем полученный путь как источник для изображения в лайтбоксе

                //    b. Получаем текст для подписи изображения.
                //       Сначала ищем элемент .item-title внутри оверлея текущего элемента галереи.
                const overlayTitleElement = this.closest('.gallery-item').querySelector('.item-overlay .item-title');
                if (overlayTitleElement) {
                    // Если нашли, используем его текстовое содержимое.
                    lightboxCaption.textContent = overlayTitleElement.textContent;
                } 

                //    c. Показываем лайтбокс.
                //       Добавляем класс 'active' к #lightbox-overlay. Этот класс, согласно CSS, делает его видимым.
                lightboxOverlay.classList.add('active'); 
                //    d. Запрещаем прокрутку основной страницы, пока лайтбокс открыт.
                document.body.style.overflow = 'hidden'; 
            });
        });

        // 6. Добавляем "слушатели событий" для закрытия лайтбокса:

        //    a. При клике на кнопку закрытия (X)
        lightboxClose.addEventListener('click', function() {
            lightboxOverlay.classList.remove('active'); // Скрываем лайтбокс, удаляя класс 'active'
            document.body.style.overflow = ''; // Разрешаем прокрутку основной страницы
        });

        //    b. При клике на затемненный фон лайтбокса (но не на само изображение или его подпись)
        lightboxOverlay.addEventListener('click', function(event) {
            // Проверяем, что клик был именно по элементу lightboxOverlay, а не по его дочерним элементам.
            if (event.target === lightboxOverlay) {
                lightboxOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        //    c. При нажатии клавиши 'Escape' на клавиатуре
        document.addEventListener('keydown', function(event) {
            // Если нажата клавиша Escape И лайтбокс в данный момент активен
            if (event.key === 'Escape' && lightboxOverlay.classList.contains('active')) {
                lightboxOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
});





