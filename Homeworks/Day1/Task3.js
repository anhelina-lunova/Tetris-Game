// 3. Додати функцію рандому котра буде поветати випадкову фігуру

function generateTetromino(){

    const random = Math.floor(Math.random() * TETROMINO_NAMES.length);

    const name = TETROMINO_NAMES[random];
    const matrix = TETROMINOES[name];

    tetromino = {
        name,
        matrix,
        row: 3,
        column: 4,

    }
}