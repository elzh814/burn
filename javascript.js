//* ********************* *//
//  VARIABLE DECLARATIONS //
//* ******************** *//
var fireCanvas = document.getElementById("burn"); // main canvas for fire effect

//fireCanvas starts at size 0, 0 until start button is pressed
fireCanvas.width = 0;
fireCanvas.height = 0;

var fireCtx = fireCanvas.getContext("2d");
const particleArray = [];

var paperCanvas = document.getElementById("paper");
var paperCtx = paperCanvas.getContext("2d");
const circlesArray = [];

var backCanvas = document.getElementById("back");
var backCtx = backCanvas.getContext("2d");
backCanvas.width = window.innerWidth;
backCanvas.height = window.innerHeight;
const backArray = [];

//determines if user wants to draw on paper. If false, user cannot draw on paper. If true, user can draw on paper.
var isPainting = false;

const mouse = {
    x: undefined,
    y: undefined,
    //TESTING PURPOSE
    down: undefined,
}

//coordinates of mouse relative to paperCanvas.
const canvasMouse = {
    x: undefined,
    y: undefined,
}

//calculates for mouse coordinates relative to canvas
function getCanvasMouse(x, y) {
    let canvasRect = paperCanvas.getBoundingClientRect();
    let scaleX = paperCanvas.width/canvasRect.width;
    let scaleY = paperCanvas.height/canvasRect.height;

    canvasMouse.x = (x - canvasRect.left) * scaleX;
    canvasMouse.y = (y - canvasRect.top) * scaleY;
}


//* ************* *//
// EVENT LISTENERS //
//* ************* *//

//makes fireCanvas size equal window so fire effect can appear
document.getElementById("startButton").addEventListener('click', function(event){
    fireCanvas.width = window.innerWidth;
    fireCanvas.height = window.innerHeight;

    //ISSUE: PRESSING START "SPEEDS UP" ALL ANIMATIONS. MAKE ISSTARTED VARIABLE AND TEST IF FALSE BEFORE CALLING ANIMATE FUNCTION 
    //CAN ALSO JUST MAKE START BUTTON TURN INTO END BUTTON INSTEAD OF STAYING START BUTTON
    animate();
});

//calls reset function to clear circle and particle arrays and reset paper
document.getElementById("resetButton").addEventListener('click', function(event) {
    reset();
});

//sets draw to true if draw is false. Sets draw to false if draw is true.
document.getElementById("drawButton").addEventListener('click', function(event) {
    if(!isPainting) {
        document.getElementById("drawButton").innerHTML = "stop drawing";
        isPainting = true;
        mouse.down = false;
    } else {
        isPainting = false;
        mouse.down = false;
        document.getElementById("drawButton").innerHTML = "draw";
    }
});

//resizes fireCanvas to fit window when window is resized
window.addEventListener('resize', function(event) {
    if (fireCanvas.width != 0) {
        fireCanvas.width = window.innerWidth;
        fireCanvas.height = window.innerHeight;
    }
});

//adds particles when mouse is moved
fireCanvas.addEventListener('mousemove', function(event){
    mouse.x = event.x;
    mouse.y = event.y;
    getCanvasMouse(event.x, event.y);

    for (let i = 0; i < 15; i ++) {
        particleArray.push(new Particle(mouse.x, mouse.y, 2, 17));
    }
        circlesArray.push(new Circle());
});

//add particles when mouse is clicked
fireCanvas.addEventListener('click', function(event){
    mouse.x = event.x;
    mouse.y = event.y;
    for (let i = 0; i < 15; i ++) {
        particleArray.push(new Particle(mouse.x, mouse.y, 2, 17));
    }
});


//* ******** *//
//  PAINTING  //
//* ******** *//
paperCanvas.addEventListener('mouseup', isDown);
paperCanvas.addEventListener('mousedown', isDown);
paperCanvas.addEventListener('mousemove', paint);
paperCanvas.addEventListener('mouseleave', isDown);

//paints onto the fireCanvas
function paint(event) {
    if (isPainting && mouse.down) {
        getCanvasMouse(event.x, event.y)
        paperCtx.lineWidth = 10;
        paperCtx.lineCap = 'round';
        paperCtx.lineTo(canvasMouse.x, canvasMouse.y);
        paperCtx.stroke();
    }
};

//Checks if the mouse is down
function isDown(event) {
    if(event.type == 'mousedown') {
        getCanvasMouse(event.x, event.y);
        paperCtx.beginPath();
        paperCtx.moveTo(canvasMouse.x, canvasMouse.y);
        mouse.down = true;
    } else if (event.type == 'mouseup' || event.type == 'mouseleave') {
        paperCtx.closePath();
        mouse.down = false;
    }
}

//* ************** *//
// PARTICLE EFFECT //
//* ************* *//

//Particle class. Circles that are used to create flame effect
class Particle {
    constructor(x, y, minSize, maxSize) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * (maxSize - minSize) + minSize;
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
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

//Handles the drawing and movement of the particles using requestAnimationFrame function
function handleParticles() {
    fireCtx.clearRect(0, 0, fireCanvas.width, fireCanvas.height);

    for (let i = 0; i < particleArray.length; i++) {
        particleArray[i].draw(fireCtx);
        particleArray[i].move();
        if (particleArray[i].size < 0) {
            particleArray.splice(i, 1);
            i--;
        }
    }

    //TESTING PURPOSES
    backCtx.clearRect(0, 0, backCanvas.width, backCanvas.height);
   
    backArray.push(new Particle(backCanvas.width/2 - 50, (backCanvas.height - backCanvas.height/3), 15, 50));
    backArray.push(new Particle(backCanvas.width/2, (backCanvas.height - backCanvas.height/3), 15, 50));
    backArray.push(new Particle(backCanvas.width/2 + 50, (backCanvas.height - backCanvas.height/3), 15, 50));
    
    for (let i = 0; i < backArray.length; i++) {
        backArray[i].draw(backCtx);
        backArray[i].move();
        if (backArray[i].size < 0) {
            backArray.splice(i, 1);
            i--;
        }
    }
}


//* ************ *//
// BURNING EFFECT //
//* ************ *//

//Circle class used to create burning effect
class Circle {
    constructor() {
    this.size = 0.7;
    this.burnSpeed = Math.random() * 0.25 + 0.10;
    this.x = canvasMouse.x + (Math.random() * 25 - 25);
    this.y = canvasMouse.y + (Math.random() * 25 - 25);
    }

    //"erases" the circle from the paper canvas
    draw() {
        paperCtx.globalCompositeOperation = 'destination-out';
        paperCtx.beginPath();
        paperCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        paperCtx.fill();
    }

    //increases the size of the circle
    update() {
        this.size += this.burnSpeed;
        // FIND WAY TO MAKE SPEED INVERSE TO SIZE
    }
}

//handles circle by updating and drawing all circles in the circlesArray. 
//Slices circles that are a random size between 15 and 20 so they do not conintue updating/ growing.
function handleCircles() {

    for (let i = 0; i < circlesArray.length; i++) {
        circlesArray[i].update();
        circlesArray[i].draw();
        if (circlesArray[i].size > Math.floor(Math.random() * 500 + 20)) { //150 - 50
            circlesArray.splice(i, 1);
        }
    }
}


//* *************** *//
// GENERAL FUNCTIONS //
//* *************** *//

//clears circlesArray and particlesArray and resets paper on screen. Will reset size of paperCanvas drawing surface relative to current window size.
function reset() {
    circlesArray.splice(0, (circlesArray.length - 1));
    particleArray.splice(0, (particleArray.length - 1));
    fireCanvas.width = 0;
    fireCanvas.height = 0;

    paperCtx.clearRect(0, 0, paperCanvas.width, paperCanvas.height);
    paperCanvas.width = window.innerWidth * 0.4;
    paperCanvas.height = window.innerHeight * 0.9;
    paperCtx.fillStyle = "white";
    paperCtx.fillRect(0, 0, paperCanvas.width, paperCanvas.height);
    paperCanvas.globalCompositeOperation = 'source-over';

    isPainting = false;
    document.getElementById("drawButton").innerHTML = "draw";
}

//animates all effects by calling handleParticles and handleCircles.
function animate() {
    handleParticles()
    handleCircles()
    window.requestAnimationFrame(animate);
}

//Resizes paperCanvas size AND drawing surface size of paperCanvas. Style Sheet only resizes canvas size, not drawing surface size
paperCanvas.width = window.innerWidth * 0.4;
paperCanvas.height = window.innerHeight * 0.9;

paperCtx.fillStyle = "white";
paperCtx.fillRect(0, 0, paperCanvas.width, paperCanvas.height);
// animate();

/* create textarea element when screen is first loaded. All txt will be entered there until user 
chooses to start burning paper. Then draw that text onto canvas same size as it was in the text box.
that way it can be burned.
possible issues. Areas were text was drawn might get erased when circles start erasing. 
possible solution. Put text onto ANOTHER canvas and erase that canvas at the same time as the paper canvas??

size would be hard to match up and may change if user tries to resize browser window
Maybe just make paper fixed or have a min size? */