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

const frame = document.getElementById("main-frame");

var backCanvas = document.getElementById("back");
var backCtx = backCanvas.getContext("2d");
backCanvas.width = frame.scrollWidth;
backCanvas.height = frame.clientHeight;
const backArray = [];

//determines if user wants to draw on paper. If false, user cannot draw on paper. If true, user can draw on paper.
var isPainting = false;

//determines if the program has been started
var isStarted = false;

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
    let scaleX = paperCanvas.width / canvasRect.width;
    let scaleY = paperCanvas.height / canvasRect.height;

    canvasMouse.x = (x - canvasRect.left) * scaleX;
    canvasMouse.y = (y - canvasRect.top) * scaleY;
}

// the interval id;
var id;

var textarea = document.getElementById("text");
var writeButton = document.getElementById("writeButton");

var isTyping = false;

//* ************* *//
// EVENT LISTENERS //
//* ************* *//

//makes fireCanvas size equal window so fire effect can appear
document.getElementById("startButton").addEventListener('click', function (event) {
    fireCanvas.width = frame.scrollWidth;
    fireCanvas.height = frame.clientHeight;

    isStarted = true;
    document.getElementById("startButton").disabled = true;
    document.getElementById("drawButton").disabled = true;
    writeButton.disabled = true;

    let text = textarea.value.split('\n');
    let lineHeight = 36;
    console.log(text);

    paperCtx.font = "normal 600 40px Handwritten";
    for (let i = 0; i < text.length; i++) {
        paperCtx.fillText(text[i], textarea.getBoundingClientRect().x - paperCanvas.getBoundingClientRect().x + 2, (textarea.getBoundingClientRect().y - (paperCanvas.getBoundingClientRect().y - 32) + i * lineHeight));
    }
    // paperCtx.fillText(textarea.value, textarea.getBoundingClientRect().x - paperCanvas.getBoundingClientRect().x + 3, textarea.getBoundingClientRect().y - (paperCanvas.getBoundingClientRect().y - 30));
    textarea.value = "";
    textarea.style.pointerEvents = "none";

    id = setInterval(animate, 15);
});

//calls reset function to clear circle and particle arrays and reset paper
document.getElementById("resetButton").addEventListener('click', function (event) {
    reset();
});

//sets draw to true if draw is false. Sets draw to false if draw is true.
document.getElementById("drawButton").addEventListener('click', function (event) {
    if (!isPainting) {
        document.getElementById("drawButton").innerHTML = "stop drawing";
        isPainting = true;
        mouse.down = false;
    } else {
        isPainting = false;
        mouse.down = false;
        document.getElementById("drawButton").innerHTML = "draw";
    }

    writeButton.innerHTML = "Write";
    textarea.style.pointerEvents = "none";
    isTyping = false;
});

document.getElementById("writeButton").addEventListener('click', function () {
    if (isTyping) {
        writeButton.innerHTML = "Write";
        textarea.style.pointerEvents = "none";
        isTyping = false;
    } else {
        writeButton.innerHTML = "Stop Writing";
        textarea.style.pointerEvents = "all";
        textarea.focus();
        isTyping = true;
    }
    document.getElementById("drawButton").innerHTML = "draw";
    isPainting = false;


});

document.getElementById("aboutButton").addEventListener('click', function (event) {
    let aboutCon = document.getElementById("about_container");
    aboutCon.style.zIndex = 14;
    aboutCon.style.backgroundColor = "black";
    let aboutPara = document.createElement("p");
    aboutPara.innerHTML = "Have you ever been angry? Of course you have! We all have! Anger is a very healthy and understandable emotion to feel so long as you find a positive outlet for your emotions. Here, you can scribble out all your anger and burn it without the dangers of actual arson. <br> <br> When you're ready, press the Draw button to begin drawing, or the Write button to start typing. Once you're finished putting your thoughts to paper, burn it by pressing the Start button. Feel free to relax and enjoy the fireplace once you're done! Still have some hot thoughts to burn? Press the Reset button for a fresh sheet of paper! Happy burning!";
    aboutCon.appendChild(aboutPara);
    document.getElementById("aboutButton").disabled = true;
    let closeButton = document.createElement("button");
    closeButton.id = "closeButton";
    closeButton.innerHTML = "Close";
    aboutCon.appendChild(closeButton);

    closeButton.addEventListener('click', function (event) {
        aboutCon.style.backgroundColor = 'transparent';
        aboutPara.remove();
        closeButton.remove();
        aboutCon.style.zIndex = -1;
        document.getElementById("aboutButton").disabled = false;
    });

});


//resizes fireCanvas to fit window when window is resized
window.addEventListener('resize', function (event) {
    if (fireCanvas.width != 0) {
        fireCanvas.width = frame.scrollWidth;
        fireCanvas.height = frame.clientHeight;
    }
    backCanvas.width = frame.clientWidth;
    backCanvas.height = frame.clientHeight;

    // things get messy here so I'm resetting until I figure this out...one day...
    reset();
});

// adds particles to location of event.
function addParticles(event) {
    mouse.x = event.x - ((window.innerWidth - frame.scrollWidth) / 2);
    mouse.y = event.y - ((window.innerHeight - frame.clientHeight) / 2);
    getCanvasMouse(event.x, event.y);

    for (let i = 0; i < 15; i++) {
        particleArray.push(new Particle(mouse.x, mouse.y, 2, 17, 0.2));
    }
    circlesArray.push(new Circle());
}

//adds particles when mouse is moved
// TODO: One day add touchscreen support...
fireCanvas.addEventListener('mousemove', function (event) {
    addParticles(event);
});

fireCanvas.addEventListener('touchmove', function (event) {
    addParticles(event);
});


//add particles when mouse is clicked
fireCanvas.addEventListener('click', function (event) {
    mouse.x = event.x - ((window.innerWidth - frame.scrollWidth) / 2);
    mouse.y = event.y - ((window.innerHeight - frame.clientHeight) / 2);
    for (let i = 0; i < 15; i++) {
        particleArray.push(new Particle(mouse.x, mouse.y, 2, 17, 0.2));
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
        paperCtx.linejoin = 'round';
        paperCtx.lineTo(canvasMouse.x, canvasMouse.y);
        paperCtx.stroke();
    }
};

//Checks if the mouse is down
function isDown(event) {
    if (event.type == 'mousedown') {
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
    constructor(x, y, minSize, maxSize, hueChange) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * (maxSize - minSize) + minSize;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * -3 - 1.5;
        this.hue = 65;
        this.hueChange = hueChange;
        this.color = 'hsl(' + this.hue + ', 100%, 50%)';
    }

    //handles the movement of the particles
    move() {
        this.x += this.speedX / 2;
        this.y += this.speedY;
        this.hue -= this.size * this.hueChange;
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

//Handles the drawing and movement of the particles using setInterval function
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

    //Creates fire in background
    backCtx.clearRect(0, 0, backCanvas.width, backCanvas.height);
    let colorChange = document.getElementById("colorSlider").value * 0.01;
    backArray.push(new Particle(frame.clientWidth / 2 - (frame.clientWidth * .06), (frame.clientHeight - frame.clientHeight / 3), frame.clientHeight * .04, frame.clientHeight * .07, colorChange));
    backArray.push(new Particle(frame.clientWidth / 2, (frame.clientHeight - frame.clientHeight / 2.9), frame.clientHeight * .07, frame.clientHeight * .1, colorChange));
    backArray.push(new Particle(frame.clientWidth / 2 + (frame.clientWidth * .06), (frame.clientHeight - frame.clientHeight / 3), frame.clientHeight * .04, frame.clientHeight * .07, colorChange));

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
    }
}

//handles circle by updating and drawing all circles in the circlesArray. 
//Slices circles that are a random size between 15 and 20 so they do not conintue updating/ growing.
function handleCircles() {

    for (let i = 0; i < circlesArray.length; i++) {
        circlesArray[i].update();
        circlesArray[i].draw();
        if (circlesArray[i].size > Math.floor(Math.random() * 550 + 30)) { //150 - 50
            circlesArray.splice(i, 1);
        }
    }
}


//* *************** *//
// GENERAL FUNCTIONS //
//* *************** *//

//clears arrays and canvases. Will reset size of paperCanvas drawing surface relative to current window size.
function reset() {
    isStarted = false
    isPainting = false;
    isTyping = false;

    clearInterval(id);
    circlesArray.splice(0, (circlesArray.length - 1));
    particleArray.splice(0, (particleArray.length - 1));
    backArray.splice(0, (backArray.length - 1));
    fireCanvas.width = 0;
    fireCanvas.height = 0;

    backCtx.clearRect(0, 0, backCanvas.width, backCanvas.height);
    paperCtx.clearRect(0, 0, paperCanvas.width, paperCanvas.height);
    paperCanvas.globalCompositeOperation = 'source-over';

    textarea.value = "";

    document.getElementById("drawButton").innerHTML = "Draw";
    writeButton.innerHTML = "Write";
    start();
}

//animates all effects by calling handleParticles and handleCircles.
function animate() {
    if (isStarted) {
        handleParticles()
        handleCircles()
        // window.requestAnimationFrame(animate);
    }
}

//* ***************** *//
// WHERE IT ALL STARTS //
// * **************** *//

function start() {
    //Resizes paperCanvas size AND drawing surface size of paperCanvas. Style Sheet only resizes canvas size, not drawing surface size
    paperCanvas.width = frame.clientWidth * 0.5;
    paperCanvas.height = frame.clientHeight * 0.9;

    //Draws the paper image onto the paperCanvas
    const paperImage = document.getElementById("paperImg");
    paperCtx.drawImage(paperImage, 0, 0, paperCanvas.width, paperCanvas.height);
    document.getElementById("startButton").disabled = false;
    document.getElementById("drawButton").disabled = false;
    writeButton.disabled = false;
}
/* create textarea element when screen is first loaded. All txt will be entered there until user 
chooses to start burning paper. Then draw that text onto canvas same size as it was in the text box.
that way it can be burned.
possible issues. Areas were text was drawn might get erased when circles start erasing. 
possible solution. Put text onto ANOTHER canvas and erase that canvas at the same time as the paper canvas??

size would be hard to match up and may change if user tries to resize browser window
Maybe just make paper fixed or have a min size? */