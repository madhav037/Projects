const gui = new dat.GUI();

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

addEventListener('resize', (e) => {
    canvas.height = innerHeight
    canvas.width = innerWidth
})

const wave = {
  y: canvas.height / 2,
  length: 0.01,
  amplitude: 100,
  frequency: 0.01
};

const strokeColor = {
    color: 200,
    saturation: 50,
    light: 50
}

const backgroundColor = {
    r: 128,
    g: 128,
    b: 128,
    a: 0.01
}

const options = {
    clearEveryY: false,
    clear: false
}


const waveFolder = gui.addFolder('wave')
waveFolder.add(wave, "y", 0, canvas.height);
waveFolder.add(wave, "length", -0.01, 0.01);
waveFolder.add(wave, "amplitude", -300, 300);
waveFolder.add(wave, "frequency", -0.01, 1);
waveFolder.open()

const strokeFolder = gui.addFolder('stroke')
strokeFolder.add(strokeColor, "color", 0, 255);
strokeFolder.add(strokeColor, "saturation", 0, 100);
strokeFolder.add(strokeColor, "light", 0, 100);
strokeFolder.open()


const backgroundColorFolder = gui.addFolder('background')
backgroundColorFolder.add(backgroundColor, "r", 0, 255);
backgroundColorFolder.add(backgroundColor, "g", 0, 255);
backgroundColorFolder.add(backgroundColor, "b", 0, 255);
backgroundColorFolder.add(backgroundColor, "a", 0, 1);
// backgroundColorFolder.open()

const option = gui.addFolder('options')
option.add(options,'clearEveryY')
option.add(options,'clear')

let increment = wave.frequency
let initialVal = {
    length: wave.length,
    amplitude: wave.amplitude,
    frequency: wave.frequency,
    y: wave.y
}

console.log(initialVal)
function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = `rgba(${backgroundColor.r}, ${backgroundColor.g}, ${backgroundColor.b}, ${backgroundColor.a})`
    ctx.fillRect(0,0,canvas.width, canvas.height)
    // if (wave.length != initialVal.length || wave.amplitude != initialVal.amplitude || wave.frequency != initialVal.frequency) {
    //   ctx.clearRect(0,0,canvas.width,canvas.height)
    // initialVal.length = wave.length.toFixed(3)
    // initialVal.amplitude = wave.amplitude.toFixed(0)
    // initialVal.frequency = wave.frequency.toFixed(3)
    // console.log(initialVal)
    // }

    if (options.clear) { ctx.clearRect(0,0,canvas.width,canvas.height) }

    if (options.clearEveryY && initialVal.y != wave.y) {
        ctx.clearRect(0,0,canvas.width,canvas.height)
        initialVal.y = wave.y
    }

    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);

    for (let i = 0; i < canvas.width; i++) {
    // ctx.lineTo(i, wave.y + (Math.sin(i * wave.length + increment) * wave.amplitude) * Math.sin(increment));
    ctx.lineTo(i, wave.y + (Math.sin(i * wave.length * increment) * wave.amplitude) * Math.sin(increment));

    }

    ctx.strokeStyle = `hsl(${strokeColor.color}, ${strokeColor.saturation}%, ${strokeColor.light}%)`
    ctx.stroke();
    increment += wave.frequency
}

animate();
