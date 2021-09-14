var fireCanvas = document.getElementById("burn"); // main canvas for fire effect

//fireCanvas starts at size 0, 0 until start button is pressed
fireCanvas.width = 0;
fireCanvas.height = 0;

var fireCtx = fireCanvas.getContext("2d");
const particleArray = [];

var paperCanvas = document.getElementById("paper");
var paperCtx = paperCanvas.getContext("2d");
const circlesArray = [];

const mouse = {
    x: undefined,
    y: undefined,
}

const canvasMouse = {
    x: undefined,
    y: undefined,
}

function getCanvasMouse(x, y) {
    let canvasRect = paperCanvas.getBoundingClientRect();
    let scaleX = paperCanvas.width/canvasRect.width;
    let scaleY = paperCanvas.height/canvasRect.height;

    canvasMouse.x = (x - canvasRect.left) * scaleX;
    canvasMouse.y = (y - canvasRect.top) * scaleY;
}

//makes fireCanvas size equal window so fire effect can appear
document.getElementById("startButton").addEventListener('click', function(event){
    fireCanvas.width = window.innerWidth;
    fireCanvas.height = window.innerHeight;

    //TESTING PURPOSE
    // paperCtx.beginPath();
    paperCtx.fillStyle = "white";
    paperCtx.fillRect(0, 0, paperCanvas.width, paperCanvas.height);
});

//resizes fireCanvas to fit window when window is resized
window.addEventListener('resize', function(event) {
    fireCanvas.width = window.innerWidth;
    fireCanvas.height = window.innerHeight;
});

//adds particles when mouse is moved
fireCanvas.addEventListener('mousemove', function(event){
    mouse.x = event.x;
    mouse.y = event.y;
    getCanvasMouse(event.x, event.y);

    for (let i = 0; i < 15; i ++) {
        particleArray.push(new Particle());
    }

    circlesArray.push(new Circle());
});

//add particles when mouse is clicked
fireCanvas.addEventListener('click', function(event){
    mouse.x = event.x;
    mouse.y = event.y;
    for (let i = 0; i < 15; i ++) {
        particleArray.push(new Particle());
    }
});

//Particle class. Circles that are used to create flame effect
class Particle {
    constructor() {
        this.x = mouse.x;
        this.y = mouse.y;
        this.size = Math.random() * 15 + 2;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * -3 - 1.5;
        this.hue = 65;
        this.color = 'hsl(' + this.hue + ', 100%, 50%)';
    }
    
    //handles the movement of the particles
    move() {
        this.x += this.speedX / 2;
        this.y += this.speedY;
        this.hue -= this.size * 0.2;
        this.color = 'hsl(' + this.hue + ', 100%, 50%)';
        this.size -= 0.4;
    }

    //draws the particles on the fireCanvas
    draw() {
        fireCtx.fillStyle = this.color;
        fireCtx.beginPath();
        fireCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        fireCtx.fill();
    }
}

//Handles the drawing and movement of the particles using requestAnimationFrame function
function handleParticles() {
    fireCtx.clearRect(0, 0, fireCanvas.width, fireCanvas.height);
    for (let i = 0; i < particleArray.length; i++) {
        particleArray[i].draw();
        particleArray[i].move();
        if (particleArray[i].size < 0) {
            particleArray.splice(i, 1);
            i--;
        }
    }
}


class Circle {
    constructor() {
    this.size = 0.5;
    this.burnSpeed = Math.random() * 0.15 + 0.03;
    this.x = canvasMouse.x;
    this.y = canvasMouse.y;
    }

    draw() {

        paperCtx.globalCompositeOperation = 'destination-out';
        paperCtx.beginPath();
        paperCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        paperCtx.fill();
    }

    update() {
        this.size += this.burnSpeed;
        // FIND WAY TO MAKE SPEED INVERSE TO SIZE
    }
}

function handleCircles() {
    //TESTING PURPOSE
    //paperCtx.clearRect(0, 0, paperCanvas.width, paperCanvas.height);

    for (let i = 0; i < circlesArray.length; i++) {
        circlesArray[i].update();
        circlesArray[i].draw();
        if (circlesArray[i].size > Math.floor(Math.random() * 20 + 15)) {
            circlesArray.splice(i, 1);
        }
    }
}

function animate() {
    handleParticles()
    handleCircles()
    window.requestAnimationFrame(animate);
}

animate();