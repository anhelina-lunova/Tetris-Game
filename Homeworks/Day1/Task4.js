// 4. Центрувати фігуру незалежно від ширини

function generateTetromino(){

    const random = Math.floor(Math.random() * TETROMINO_NAMES.length);

    const name = TETROMINO_NAMES[random];
    const matrix = TETROMINOES[name];

    const row = name === 'I' ? -1 : 0;
    const column =
    ['T', 'J', 'S'].includes(name)
    ? playfield[0].length / 2 - Math.floor(matrix[0].length / 2)
    : playfield[0].length / 2 - Math.ceil(matrix[0].length / 2);

    // console.log(matrix);
    tetromino = {
        name,
        matrix,
        row,
        column,

    }
}