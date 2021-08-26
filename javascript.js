const canvas = document.getElementById('burn');
const flameArray = [];

const mouse = {
    x: undefined,
    y: undefined,
}

canvas.addEventListener('click', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
    for (let i = 0; i < 15; i++) {
        fireArray.push(new Flame());
    }
});

canvas.addEventListener('mousemove', function(event){
    mouse.x = event.x;
    mouse.y = event.y;
    for( let i = 0; i < 5; i++) {
        flameArray.push(new Flame());
    }
})

class Flame {
    constuctor() {
        
    }
}