var fireCanvas = document.getElementById("burn"); // main canvas for fire effect
fireCanvas.width = window.innerWidth;
fireCanvas.height = window.innerHeight;
var fireCtx = fireCanvas.getContext("2d");
const particleArray = []

var paperCanvas = document.getElementById("paper");
var paperCtx = paperCanvas.getContext("2d");

const mouse = {
    x: undefined,
    y: undefined,
}



//resizes fireCanvas when window is resized
window.addEventListener('resize', function() {
    fireCanvas.width = window.innerWidth;
    fireCanvas.height = window.innerHeight;
});

//adds particles when mouse is moved
fireCanvas.addEventListener('mousemove', function(event){
    mouse.x = event.x;
    mouse.y = event.y;
    particleArray.push(new Particle());
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

    console.log(particleArray.length);
    window.requestAnimationFrame(handleParticles);
}

handleParticles();

