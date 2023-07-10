import { Scene } from './scene.js';
import { PixelDrawer } from './ui/pixelDrawer.js';
import { clamp } from './utils.js';

export class Game{
    constructor(opt){
        this.lastTime = null;

        if(opt.container == null) throw new Error('No container specified in options.');
        this.container = opt.container

        this.canvas = null;
        this.ctx = null;
        this.scene = null;
        this.stop = true;

        // create the canvas
        this.canvas = document.createElement('canvas');
        this.container.appendChild(this.canvas);

        // @TODO: expand with container
        this.canvas.width = '800';
        this.canvas.height = '600';
        this.canvas.style.position = 'absolute';
        this.ctx = this.canvas.getContext('2d');

        // ui layer
        this.ui = document.createElement('div');
        this.ui.width = '800';
        this.ui.height = '600';
        this.ui.style.zIndex = 1000;
        this.ui.style.position = 'absolute';
        this.container.appendChild(this.ui);

        // @TODO: TEMPORARY to hide window testing on github pages
        // if(window.location.host == '127.0.0.1:5500') this.window = new PixelDrawer(this.ui);
    }
    start(){
        // temporary debug scene
        this.scene = new Scene(this);
        this.scene.loadTestScene();

        this.stop = false;
        this.loop();
    }
    loop(timestamp){
        // calculate deltatime
        let deltaTime = this.lastTime ? (timestamp - this.lastTime) : 0;
        this.lastTime = timestamp;
        deltaTime = clamp(deltaTime, 0.1, 30);

        // resize canvas if neccessary
        if(this.canvas.width != this.container.style.offsetWidth || this.canvas.height != this.container.offsetHeight){
            this.canvas.width = this.container.offsetWidth;
            this.canvas.height = this.container.offsetHeight;
        }
        // clear and draw scene
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#222425';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.scene.draw(this.ctx);

        this.scene.update(deltaTime);

        // request next loop per refresh rate
        if(!this.stop) requestAnimationFrame(this.loop.bind(this));
    }
}