import { ImageBox } from './imageBox.js';
export class WaterBox extends ImageBox {
    constructor(opt, scene) {
        super(opt, scene);
        this.image.src = "img/water.png";
        this.solid = false;
        this.type = "water";
        
        // this lets you swim
        this.isLadder = true;
    }
    update(deltaTime){
        super.update(deltaTime);
        // swimming is handled by the player and physbox code
    }

}