// 1. Додати нові фігури
// 2. Стилізувати нові фігури
// 3. Додати функцію рандому котра буде поветати випадкову фігуру
// 4. Центрувати фігуру незалежно від ширини

// 5. Поставити const rowTetro = -2; прописати код щоб працювало коректно
// 6. Зверстати поле для розрахунку балів гри
// 7. Прописати логіку і код розрахунку балів гри (1 ряд = 10; 2 ряди = 30; 3 ряди = 50; 4 = 100)
// 8. Реалізувати самостійний рух фігур до низу



const PLAYFIELD_COLUMNS = 10;
const PLAYFIELD_ROWS    = 20;
const TETROMINO_NAMES = ['I', 'O', 'T', 'J', 'L', 'S', 'Z']

const TETROMINOES = {
    'I': [
        [0,0,0,0],
        [1,1,1,1],
        [0,0,0,0],
        [0,0,0,0]
    ],
    'O': [
        [1,1],
        [1,1]
    ],
    'T': [
        [1,1,1],
        [0,1,0],
        [0,0,0]
    ],
    'J': [
        [0,1,0],
        [0,1,0],
        [1,1,0]
    ],
    'L': [
        [0,1,0],
        [0,1,0],
        [0,1,1]
    ],
    'S': [
        [0,1,1],
        [1,1,0],
        [0,0,0]
    ],
    'Z': [
        [1,1,0],
        [0,1,1],
        [0,0,0]
    ]
}

function convertPositionToIndex(row, column){
    return row * PLAYFIELD_COLUMNS + column;
}

function getRandomElement(array){
    const randomIndex = Math.floor(Math.random() * array.length)
    return array[randomIndex]
}

let playfield;
let tetromino;
let score = 0;

const MOVE_DOWN_INTERVAL = 1000; // in milliseconds
let moveDownIntervalId;

function startAutoMoveDown() {
    moveDownIntervalId = setInterval(() => {
        moveTetrominoDown();
        draw();
    }, MOVE_DOWN_INTERVAL);
}

function stopAutoMoveDown() {
    clearInterval(moveDownIntervalId);
}

function generatePlayField(){
    for(let i = 0; i < PLAYFIELD_ROWS * PLAYFIELD_COLUMNS; i++){
        const div = document.createElement(`div`);
        document.querySelector('.grid').append(div);
    }

    playfield = new Array(PLAYFIELD_ROWS).fill()
                    .map( ()=> new Array(PLAYFIELD_COLUMNS).fill(0) )
    // console.table(playfield);
}

//
//
//
function removeFullRows() {
    let rowsCleared = 0;

    for (let row = 0; row < PLAYFIELD_ROWS; row++) {
        if (playfield[row].every(cell => cell !== 0)) {
            playfield.splice(row, 1);
            playfield.unshift(new Array(PLAYFIELD_COLUMNS).fill(0));
            rowsCleared++;
        }
    }

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

    document.getElementById('score').innerText = score;
}
//
//
//

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

function placeTetromino(){
    const matrixSize = tetromino.matrix.length;
    for(let row = 0; row < matrixSize; row++){
        for(let column = 0; column < matrixSize; column++){
            if(tetromino.matrix[row][column]){
                playfield[tetromino.row + row][tetromino.column + column] = tetromino.name;
            }
        }
    }
    removeFullRows();
    generateTetromino();
}

generatePlayField();
generateTetromino();
startAutoMoveDown();
const cells = document.querySelectorAll('.grid div');

function drawPlayField(){
    for(let row = 0; row < PLAYFIELD_ROWS; row++){
        for(let column = 0; column < PLAYFIELD_COLUMNS; column++){
            if(playfield[row][column] == 0) continue;
            
            const name = playfield[row][column];
            const cellIndex = convertPositionToIndex(row,column);
            // console.log(cellIndex);
            cells[cellIndex].classList.add(name);
        }
    }
}

function drawTetromino(){
    const name = tetromino.name;
    const tetrominoMatrixSize = tetromino.matrix.length;
    
    for(let row = 0; row < tetrominoMatrixSize; row++){
        for(let column = 0; column < tetrominoMatrixSize; column++){
            // Щоб подивитися результат алгоритму з функції rotateMatrix() !!!!

            // const cellIndex = convertPositionToIndex(
            //     tetromino.row + row,
            //     tetromino.column + column
            // );
            // cells[cellIndex].innerHTML = showRotated[row][column];
            // --------------
            if(!tetromino.matrix[row][column]) continue;
            const cellIndex = convertPositionToIndex(
                tetromino.row + row,
                tetromino.column + column
            );
            // console.log(cellIndex);
            cells[cellIndex].classList.add(name);
        }
        // column
    }
    // row
}
// drawTetromino();
// drawPlayField();

function draw(){
    cells.forEach(cell => cell.removeAttribute('class'));
    drawPlayField();
    drawTetromino();
}

function rotateTetromino(){
    const oldMatrix = tetromino.matrix;
    const rotatedMatrix = rotateMatrix(tetromino.matrix);
    showRotated = rotateMatrix(showRotated);
    tetromino.matrix = rotatedMatrix;
    if(!isValid()){
        tetromino.matrix = oldMatrix;
    }
}

let showRotated = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

draw();

function rotate(){
    rotateTetromino();
    draw();
}

document.addEventListener('keydown', onKeyDown);
function onKeyDown(e){
    switch(e.key){
        case 'ArrowUp':
            rotateTetromino();
            break;
        case 'ArrowDown':
            moveTetrominoDown();
            break;
        case 'ArrowLeft':
            moveTetrominoLeft();
            break;
        case 'ArrowRight':
            moveTetrominoRight();
            break;
    }

    draw();
}

function rotateMatrix(matrixTetromino){
    const N = matrixTetromino.length;
    const rotateMatrix = [];
    for(let i = 0; i < N; i++){
        rotateMatrix[i] = [];
        for(let j = 0; j < N; j++){
            rotateMatrix[i][j] = matrixTetromino[N - j - 1][i];
        }
    }
    return rotateMatrix;
}

function moveTetrominoDown(){
    tetromino.row += 1;
    if(!isValid()){
        tetromino.row -= 1;
        placeTetromino();
    }
}
function moveTetrominoLeft(){
    tetromino.column -= 1;
    if(!isValid()){
        tetromino.column += 1;
    }
}
function moveTetrominoRight(){
    tetromino.column += 1;
    if(!isValid()){
        tetromino.column -= 1;
    }
}

function isValid(){
    const matrixSize = tetromino.matrix.length;
    for(let row = 0; row < matrixSize; row++){
        for(let column = 0; column < matrixSize; column++){
            // if(tetromino.matrix[row][column]) continue;
            if(isOutsideOfGameboard(row, column)){ return false; }
            if(hasCollisions(row, column)){ return false; }
        }
    }
    return true;
}

function isOutsideOfGameboard(row, column){
    return tetromino.matrix[row][column] &&
    (      
           tetromino.column + column < 0 ||
           tetromino.column + column >= PLAYFIELD_COLUMNS ||
           tetromino.row + row >= PLAYFIELD_ROWS
    );
}

function hasCollisions(row, column){
    return tetromino.matrix[row][column] &&
           playfield[tetromino.row + row][tetromino.column + column];
}

