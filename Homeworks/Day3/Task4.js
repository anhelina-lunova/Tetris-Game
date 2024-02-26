// 4. Реалізувати самостійний рух фігур до низу

const MOVE_DOWN_INTERVAL = 1000; // Встановлюємо інтервал в мілісекундах
let moveDownIntervalId; // Додано змінну для зберігання ID таймера

// Встановлюємо інтервал руху фігури вниз
function startAutoMoveDown() {
    moveDownIntervalId = setInterval(() => {
        moveTetrominoDown();
        draw();
    }, MOVE_DOWN_INTERVAL);
}

// Функція для зупинки інтервалу руху фігури вниз
function stopAutoMoveDown() {
    clearInterval(moveDownIntervalId);
}

// Виклик функції
startAutoMoveDown();