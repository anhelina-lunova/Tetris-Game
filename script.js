// 1. Додати нові фігури
// 2. Стилізувати нові фігури
// 3. Додати функцію рандому котра буде поветати випадкову фігуру
// 4. Центрувати фігуру незалежно від ширини

// 5. Поставити const rowTetro = -2; прописати код щоб працювало коректно
// 6. Зверстати поле для розрахунку балів гри
// 7. Прописати логіку і код розрахунку балів гри (1 ряд = 10; 2 ряди = 30; 3 ряди = 50; 4 = 100)
// 8. Реалізувати самостійний рух фігур до низу

// 9.Зробити розмітку висновків гри (Час гри, набрана кількість балів і т.п)
// 10.Створити окрему кнопку рестарт що перезапускатиме гру посеред гри
// 11. Додати клавіатуру на екрані браузеру 

// 12.Показувати наступну фігуру що буде випадати
// 13.Додати рівні при котрих збільшується швидкість падіння фігур
// 14.Зберегти і виводити найкращий власний результат

const PLAYFIELD_COLUMNS  = 10;
const PLAYFIELD_ROWS     = 20;
const TETROMINO_NAMES    = ['I', 'O', 'T', 'J', 'L', 'S', 'Z']
const TETROMINOES        = {
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
const btnRestart         = document.querySelector('.btn-restart');
const scoreElement       = document.getElementById('score');
const linesElement       = document.getElementById('lines');
const overlay            = document.querySelector('.overlay');
let isPaused             = false;
let isGameOver           = false;
let moveDownInterval     = 1000; // milliseconds
let score                = 0;
let deletedRowsCount     = 0;
let moveDownIntervalId   = null;
let playfield;
let tetromino;
let cells;

init();

function init(){
    score = 0;
    deletedRowsCount = 0;
    scoreElement.innerHTML = 0;
    linesElement.innerHTML = 0;
    isGameOver = false;
    generatePlayField();
    generateTetromino();
    cells = document.querySelectorAll('.grid div');
    startAutoMoveDown();
}

btnRestart.addEventListener('click', function(){
    document.querySelector('.grid').innerHTML = '';
    overlay.style.display = 'none';
    init();
})

function convertPositionToIndex(row, column){
    return row * PLAYFIELD_COLUMNS + column;
}

function getRandomElement(array){
    const randomIndex = Math.floor(Math.random() * array.length)
    return array[randomIndex]
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
            deletedRowsCount++;
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

    document.getElementById('score').innerHTML = score;
    document.getElementById('lines').innerHTML = deletedRowsCount;

}
//
//
//

function generateTetromino(){
    const name = getRandomElement(TETROMINO_NAMES);
    const matrix = TETROMINOES[name];

    const row = ['J', 'L', ].includes(name) ? -3 : -2;
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
            if(isOutsideOfTopboard(row)){
                isGameOver = true;
                return;
            }
            if(tetromino.matrix[row][column]){
                playfield[tetromino.row + row][tetromino.column + column] = tetromino.name;
            }
        }
    }
    removeFullRows();
    generateTetromino();
}

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
            if(isOutsideOfTopboard(row)) continue;
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
    // showRotated = rotateMatrix(showRotated);
    tetromino.matrix = rotatedMatrix;
    if(!isValid()){
        tetromino.matrix = oldMatrix;
    }
}

// let showRotated = [
//     [1, 2, 3],
//     [4, 5, 6],
//     [7, 8, 9]
// ]

draw();

function rotate(){
    rotateTetromino();
    draw();
}

document.addEventListener('keydown', onKeyDown);
function onKeyDown(e){
    if(e.key == 'Escape'){
        togglePauseGame();
    }
    if(!isPaused){
        switch(e.key){
            case ' ':
                dropTetrominoDown();
                break;
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
    }
    draw();
}

function dropTetrominoDown(){
    while(isValid()){
        tetromino.row++;
    }
    tetromino.row--;
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

function gameOver(){
    stopAutoMoveDown();
    overlay.style.display = 'flex';
}

function startAutoMoveDown() {
    if(!moveDownIntervalId){
        moveDownIntervalId = setInterval(() => {
        moveTetrominoDown();
        draw();
        if(isGameOver){
            gameOver();
        }
        }, moveDownInterval);
    }
}

function stopAutoMoveDown() {
    clearInterval(moveDownIntervalId);

    moveDownIntervalId = null;
}


function togglePauseGame(){
    if(isPaused === false){
        stopAutoMoveDown();
    } else {
        startAutoMoveDown();
    }
    isPaused = !isPaused;
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

function isOutsideOfTopboard(row){
    return tetromino.row + row < 0;
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
           playfield[tetromino.row + row]?.[tetromino.column + column];
}

