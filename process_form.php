<?php
// Установите правильный Content-Type для JSON ответа
header('Content-Type: application/json');

// Адрес электронной почты, куда будут приходить заявки
$to_email = 'kudryashka.kokhma.15@mail.ru'; 

// От кого будет письмо (часто должен быть адрес на вашем домене для лучшей доставляемости)
$from_email = 'no-reply@kydriashka-iv.ru'; 

// Тема письма
$subject = 'Новая онлайн-запись в Студии "Кудряшка"';

// Получаем JSON-данные из тела запроса
$input = file_get_contents('php://input');
$data = json_decode($input, true); // Декодируем JSON в ассоциативный массив

// Проверяем, что данные получены и не пусты
if (empty($data) || !isset($data['gender'], $data['date'], $data['time'], $data['service'])) {
    echo json_encode(['success' => false, 'message' => 'Некорректные данные формы.']);
    exit;
}

// Извлекаем данные
$gender = htmlspecialchars($data['gender']); // Экранируем HTML-сущности для безопасности
$date = htmlspecialchars($data['date']);
$time = htmlspecialchars($data['time']);
$service = htmlspecialchars($data['service']);

// Формируем тело письма в формате HTML
$email_body = "
<html>
<head>
    <title>Новая онлайн-запись</title>
</head>
<body>
    <p>Поступила новая онлайн-запись на услугу в Студии Красоты \"Кудряшка\"!</p>
    <p><strong>Детали записи:</strong></p>
    <ul>
        <li><strong>Пол:</strong> {$gender}</li>
        <li><strong>Дата:</strong> {$date}</li>
        <li><strong>Время:</strong> {$time}</li>
        <li><strong>Услуга:</strong> {$service}</li>
    </ul>
    <p>С уважением,<br>Администрация Студии \"Кудряшка\"</p>
</body>
</html>
";

// Заголовки для отправки HTML-письма
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-type: text/html; charset=UTF-8\r\n";
$headers .= "From: Kudryashka <{$from_email}>\r\n"; // Имя отправителя и email

// Отправка письма
if (mail($to_email, $subject, $email_body, $headers)) {
    echo json_encode(['success' => true, 'message' => 'Заявка успешно отправлена!']);
} else {
    // В случае ошибки отправки письма (например, не настроен почтовый сервер)
    // Можно записать ошибку в лог для отладки: error_log("Failed to send email: " . error_get_last()['message']);
    echo json_encode(['success' => false, 'message' => 'Не удалось отправить письмо. Пожалуйста, попробуйте позже.']);
}
?>
