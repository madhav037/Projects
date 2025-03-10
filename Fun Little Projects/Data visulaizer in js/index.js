const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

const addData = document.getElementById('add-data');
const addCol = document.getElementById('add-col');
const inputBar = document.getElementById('input-place')

let mode = 'data'

const changePlaceHolderToData = () => {
    inputBar.placeholder = 'Add data'
    mode = 'data'
}

const changePlaceHolderToCol = () => {
    inputBar.placeholder = 'Add column'
    mode = 'col'
}

function addInput() {
    let data = inputBar.value

}

const canvasHeight = ctx.canvas.height;
// Define your data
const data = [200, 150, 300, 100, 250, 500];
const col = []

// Define the dimensions of the graph
const graphHeight = 500;
const barWidth = 50;
const barGap = 20;
const graphWidth = (barWidth + barGap) * data.length;

ctx.fillStyle = 'black'; // Change color to black for the text
// Draw the graph
for (let i = 0; i < data.length; i++) {
    // Calculate the height of the bar
    const barHeight = data[i] / Math.max(...data) * graphHeight;

    const y = canvasHeight - barHeight;
    // Calculate the x position of the bar
    const x = i * (barWidth + barGap) + 10;

    // Draw the bar
    ctx.fillRect(x, y, barWidth, barHeight);
    ctx.fillText(data[i], x, y - 10); // Display the data above the bar
}