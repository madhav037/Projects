const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

let SCORE = 1;


let snakeHeight = 20;
let snakeWidth = 20;

let positionX = 10;
let positionY = 10;
let foodX = 0;
let foodY = 0;
[foodX , foodY] = generateFoodCordinates();
let snake = [{
    x: positionX,
    y: positionY,
}];

window.addEventListener('keydown', function(e) {
    checkCollision();
    if (e.key === 'ArrowUp') {
        if (positionY <= 10) return console.log('Limit reached');
        positionY -= 10;
        ctx.clearRect(0, 0, width, height);
        createSquare(positionX, positionY);
    }
    if (e.key === 'ArrowDown') {
        if (positionY >= height - 25) return console.log('Limit reached');
        positionY += 10;
        ctx.clearRect(0, 0, width, height);
        createSquare(positionX, positionY);
    }
    if (e.key === 'ArrowLeft') {
        if (positionX <= 10) return console.log('Limit reached');
        positionX -= 10;
        ctx.clearRect(0, 0, width, height);
        createSquare(positionX, positionY);
    }
    if (e.key === 'ArrowRight') {
        if (positionX >= width - 20) return console.log('Limit reached');
        positionX += 10;
        ctx.clearRect(0, 0, width, height);
        createSquare(positionX, positionY);
    }
    checkCollision();
    createFood();
});


function createSquare(x,y) {
    for (let i = 0; i < SCORE; i++) {
        ctx.fillStyle = 'red';
        ctx.fillRect(x + i * 20, y, snakeHeight, snakeWidth);
        // createSnake(x + i * 20, y);
    }

}

function createFood(_x ,_y) {
    ctx.fillStyle = 'green';
    if (foodX < 10) foodX = 10;
    if (foodY < 10) foodY = 10;
    if (foodX > width - 20) foodX = width - 20;
    if (foodY > height - 20) foodY = height - 20;
    ctx.fillRect(_x != null ? _x : foodX, _y != null ? _y : foodY, 10, 10);
}

createSquare(positionX, positionY);
createFood();

function generateFoodCordinates() {
    let foodX = Math.floor(Math.random() * (width - 20 - 10 + 1)) + 10;
    let foodY = Math.floor(Math.random() * (height - 20 - 10 + 1)) + 10;
    return [foodX, foodY];
}

function checkCollision() {
    if (
        positionX <= foodX + snakeWidth / 2 &&
        positionX >= foodX - snakeWidth / 2 &&
        positionY <= foodY + snakeHeight / 2 &&
        positionY >= foodY - snakeHeight / 2
    ) {
        SCORE += 1;
        [foodX, foodY] = generateFoodCordinates();
        createFood(foodX, foodY);
    }
}
