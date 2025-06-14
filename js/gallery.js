// js/script.js - Скрипты для интерактивных элементов на странице

document.addEventListener('DOMContentLoaded', () => {
    console.log('Скрипт загружен.'); // Отладочное сообщение

    // Получаем все элементы галереи, по которым можно кликнуть
    const galleryItems = document.querySelectorAll('.gallery-item');

    // Получаем элементы лайтбокса
    const lightboxOverlay = document.getElementById('lightbox-overlay');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxMaster = document.getElementById('lightbox-master');
    const lightboxClose = document.querySelector('.lightbox-close');

    // Проверка, что все основные элементы найдены
    if (!lightboxOverlay || !lightboxImg || !lightboxTitle || !lightboxMaster || !lightboxClose) {
        console.error('Ошибка: Один или несколько элементов лайтбокса не найдены в HTML. Проверьте ID/классы.');
        return; // Останавливаем выполнение скрипта, если элементы не найдены
    }

    // Функция для открытия лайтбокса
    function openLightbox(imgSrc, title, master) {
        lightboxImg.src = imgSrc; // Устанавливаем путь к изображению
        lightboxTitle.textContent = title; // Устанавливаем заголовок
        lightboxMaster.textContent = master; // Устанавливаем имя мастера

        lightboxOverlay.classList.add('active'); // Добавляем класс 'active', чтобы показать лайтбокс
        document.body.style.overflow = 'hidden'; // Запрещаем прокрутку основной страницы
        console.log('Лайтбокс открывается. Изображение:', imgSrc); // Отладочное сообщение
    }

    // Функция для закрытия лайтбокса
    function closeLightbox() {
        lightboxOverlay.classList.remove('active'); // Удаляем класс 'active', чтобы скрыть лайтбокс
        document.body.style.overflow = ''; // Восстанавливаем прокрутку основной страницы

        // Очищаем содержимое лайтбокса, чтобы избежать "мерцания" следующего изображения
        lightboxImg.src = ''; 
        lightboxTitle.textContent = '';
        lightboxMaster.textContent = '';
        console.log('Лайтбокс закрыт.'); // Отладочное сообщение
    }

    // Добавляем обработчик кликов для каждого элемента галереи
    if (galleryItems.length > 0) {
        galleryItems.forEach(item => {
            console.log('Элемент галереи найден:', item); // Отладочное сообщение
            item.addEventListener('click', () => {
                const imgElement = item.querySelector('img');
                const titleElement = item.querySelector('.item-overlay h3');
                const masterElement = item.querySelector('.item-overlay p');

                if (imgElement && titleElement && masterElement) {
                    const imgSrc = imgElement.src; // Получаем src изображения внутри gallery-item
                    const title = titleElement.textContent; // Получаем заголовок из оверлея
                    const master = masterElement.textContent; // Получаем имя мастера из оверлея
                    openLightbox(imgSrc, title, master); // Открываем лайтбокс с полученными данными
                    console.log('Клик по изображению, данные:', imgSrc, title, master); // Отладочное сообщение
                } else {
                    console.error('Ошибка: Не найдены img, h3 или p в элементе gallery-item для клика.');
                }
            });
        });
    } else {
        console.warn('Внимание: Элементы галереи с классом ".gallery-item" не найдены.'); // Отладочное предупреждение
    }

    // Добавляем обработчик клика для кнопки закрытия
    lightboxClose.addEventListener('click', closeLightbox);

    // Добавляем обработчик клика для закрытия лайтбокса при клике вне изображения
    lightboxOverlay.addEventListener('click', (e) => {
        // Если клик был непосредственно по оверлею (а не по изображению внутри него)
        if (e.target === lightboxOverlay) {
            closeLightbox();
        }
    });

    // Добавляем обработчик для закрытия лайтбокса по нажатию клавиши Esc
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightboxOverlay.classList.contains('active')) {
            closeLightbox();
        }
    });
});
