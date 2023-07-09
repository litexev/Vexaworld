const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let WIDTH = canvas.width = window.innerWidth;
let HEIGHT = canvas.height = window.innerHeight;
const PHYSICS_SUBSTEP = 8;
let MOUSE_X = 0;
let MOUSE_Y = 0;
window.onresize = () => {
    WIDTH = canvas.width = window.innerWidth;
    HEIGHT = canvas.height = window.innerHeight;
}
window.onmousemove = (e) => {
    MOUSE_X = e.clientX;
    MOUSE_Y = e.clientY;
}
class KeyHandler {
    constructor() {
        this.keys = {};
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
        });
        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
    }

    isPressed(keyCode) {
        return this.keys[keyCode] || false;
    }
}

const keyHandler = new KeyHandler();

class Transform {
    constructor(x, y, width, height, scene) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.scene = scene;
    }
    draw(ctx){
        // stub
    }
    update(deltaTime){
        // stub
    }
    intersects(other){
        return (
            this.x <= other.x + other.width &&
            this.x + this.width >= other.x &&
            this.y <= other.y + other.height &&
            this.y + this.height >= other.y
        );
    }
    willIntersect(other, x, y){
        return (
            this.x <= x + other.width &&
            this.x + this.width >= x &&
            this.y <= y + other.height &&
            this.y + this.height >= y
        );
    }
}

class ColorBox extends Transform {
    constructor(x, y, width, height, color, scene) {
        super(x, y, width, height, scene);
        this.color = color;
    }
    draw(ctx){
        ctx.fillStyle = this.color;
        ctx.fillRect(Math.round(this.x), Math.round(this.y), this.width, this.height);
    }
}


class Player extends PhysBox{   
    constructor(x, y, width, height, color, scene){
        super(x, y, width, height, color, scene);
    }
    update(deltaTime){
        super.update(deltaTime);
        if(keyHandler.isPressed("ArrowLeft")){
            this.velX += -0.02 * deltaTime;
        }
        if(keyHandler.isPressed("ArrowRight")){
            this.velX += 0.02 * deltaTime;
        }
        if(keyHandler.isPressed("Space")){
            if(this.isGrounded){
                this.isGrounded = false;
                this.velY = -0.8;
            }
        }
    }
}
class Scene {
    objects = [];
    constructor() {
        this.objectPlacer = new ObjectPlacer(this);
        this.objects.push(new Player(300, 10, 48, 48 + 24, 'yellow', this));
    }
    loadTestScene() {
        for (let i = 0; i < 20; i++) {
            this.objects.push(new ColorBox(i * 48, 48 * 10, 48, 48, 'green', this));
        }
        this.objects.push(new ColorBox(48 * 5, 48 * 9, 48, 48, 'lightblue', this));
        this.objects.push(new ColorBox(48 * 2, 48 * 9, 48, 48, 'lightblue', this));
        this.objects.push(new ColorBox(48 * 2, 48 * 8, 48, 48, 'lightblue', this));
    }
    draw(ctx) {
        this.objects.forEach(obj => obj.draw(ctx));
        this.objectPlacer.draw(ctx);
    }
    update(deltaTime){
        this.objects.forEach(obj => obj.update(deltaTime));
    }
}
function snapToGrid(number, step){
    return Math.round(number / step) * step
}
class ObjectPlacer{
    constructor(scene){
        this.scene = scene;
        this.x = 0;
        this.y = 0;
        this.prevX = 0;
        this.prevY = 0;
        this.posChanged = false;
        this.blockSize = 48;
        this.mouseDown = false;
        window.addEventListener('mousedown', (e) => {
            this.mouseDown = true;
            this.createBox(e);
        });
        window.addEventListener('mouseup', (e) => {
            this.mouseDown = false;
        });
        window.addEventListener('mousemove', (e) => {
            if(this.mouseDown){
                if(this.posChanged){
                    this.createBox(e);
                    this.posChanged = false;
                }
            }
        });
    }
    draw(ctx){
        this.x = snapToGrid(MOUSE_X - this.blockSize/2, this.blockSize);
        this.y = snapToGrid(MOUSE_Y - this.blockSize/2, this.blockSize);
        if(this.x != this.prevX || this.y != this.prevY){
            this.posChanged = true;
            this.prevX = this.x;
            this.prevY = this.y;
        }
        ctx.fillStyle = 'gray';
        ctx.fillRect(this.x, this.y, this.blockSize, this.blockSize);
    }
    createBox(e){
        let newObject = new ColorBox(this.x, this.y, this.blockSize, this.blockSize, 'lightblue', this.scene);
        this.scene.objects.push(newObject);
    }
}
let lastTime = performance.now();

let scene = new Scene();
scene.loadTestScene();
function animate(){
    // get deltatime
    let now = performance.now();
    let deltaTime = now - lastTime;
    lastTime = now;

    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    scene.draw(ctx);
    for(let i = 0; i < PHYSICS_SUBSTEP; i++){
        scene.update(deltaTime / PHYSICS_SUBSTEP);
    }
    
    requestAnimationFrame(animate);
}
animate()
