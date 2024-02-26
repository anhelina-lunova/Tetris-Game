// 1. Поставити const rowTetro = -2; прописати код щоб працювало коректно

function generateTetromino(){

    const name = getRandomElement(TETROMINO_NAMES);
    const matrix = TETROMINOES[name];

    const row = name === 'I' ? -1 : 0;
    const column =
    ['T', 'J', 'S'].includes(name)  // T - ?
    ? PLAYFIELD_COLUMNS / 2 - Math.floor(matrix.length / 2)
    : PLAYFIELD_COLUMNS / 2 - Math.ceil(matrix.length / 2);

    // console.log(matrix);
    tetromino = {
        name,
        matrix,
        row,
        column,
    }
}