// 3. Прописати логіку і код розрахунку балів гри (1 ряд = 10; 2 ряди = 30; 3 ряди = 50; 4 = 100)

// Створюємо змінну для відстеження загального рахунку
let score = 0;

// Додаємо функцію для перевірки, чи заповнений ряд
function isRowFull(row) {
    for (let column = 0; column < PLAYFIELD_COLUMNS; column++) {
        if (playfield[row][column] === 0) {
            return false;
        }
    }
    return true;
}

// Видаляємо заповнений ряд і збільшуємо рахунок відповідно до кількості заповнених рядів
function removeFullRows() {
    let rowsCleared = 0;

    for (let row = 0; row < PLAYFIELD_ROWS; row++) {
        if (isRowFull(row)) {
            playfield.splice(row, 1);
            playfield.unshift(new Array(PLAYFIELD_COLUMNS).fill(0));
            rowsCleared++;
        }
    }

    // Оновлюємо рахунок відповідно до кількості заповнених рядів
    switch (rowsCleared) {
        case 1:
            score += 10;
            break;
        case 2:
            score += 30;
            break;
        case 3:
            score += 50;
            break;
        case 4:
            score += 100;
            break;
    }

    // Оновлюємо відображення рахунку на сторінці
    document.getElementById('score').innerText = score;
}

// Додаємо виклик функції видалення рядків у функції placeTetromino() після розміщення фігури
function placeTetromino(){
    const matrixSize = tetromino.matrix.length;
    for(let row = 0; row < matrixSize; row++){
        for(let column = 0; column < matrixSize; column++){
            if(tetromino.matrix[row][column]){
                playfield[tetromino.row + row][tetromino.column + column] = tetromino.name;
            }
        }
    }
    removeFullRows(); // Додано для розрахунку балів після розміщення фігури
    generateTetromino();
}
