import { Scene } from './scene.js';
import { PixelDrawer } from './ui/pixelDrawer.js';
import { clamp } from './utils.js';
import { Liet } from './ui/liet.js';
import { Hud } from './ui/hud.js';
export class Game{
    constructor(opt){
        this.lastTime = null;

        if(opt.container == null) throw new Error('No container specified in options.');
        this.container = opt.container

        this.canvas = null;
        this.ctx = null;
        this.scene = null;
        this.stop = true;

        this.liet = new Liet();

        // create the canvas
        this.canvas = this.liet.new({
            type: 'canvas',
            class: 'gameCanvas',
            parent: this.container
        })

        this.canvas.style.position = 'absolute';
        this.ctx = this.canvas.getContext('2d');

        // ui layer
        this.ui = this.liet.new({type: "div", class:"uiLayer h-box stretch", parent: this.container});
        this.ui.style.zIndex = 1000;
        this.ui.style.position = 'absolute';
        this.container.appendChild(this.ui);
        
        // disable browser context menu
        // @TODO: not on whole window
        window.addEventListener('contextmenu', function(e) { 
            e.preventDefault();
        }, false);
        
        this.pixelDrawer = new PixelDrawer(this.ui);
        this.pixelDrawer.show();
        this.hud = new Hud(this.ui);
        this.hud.createUI(this.ui);

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
            this.ui.style.width = this.canvas.width + 'px';
            this.ui.style.height = this.canvas.height + 'px';
            this.ui.style.pointerEvents = 'none';
        }
        // clear and draw scene
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#302c2e';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.scene.draw(this.ctx);

        this.scene.update(deltaTime);

        // request next loop per refresh rate
        if(!this.stop) requestAnimationFrame(this.loop.bind(this));
    }
}