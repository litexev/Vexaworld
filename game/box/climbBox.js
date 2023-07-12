import { Transform } from '../transform.js';
import { ImageBox } from './imageBox.js';
import { Player } from '../player.js';
import { KeyHandler } from '../keyHandler.js';
export class ClimbBox extends ImageBox {
    constructor(opt, scene) {
        super(opt, scene);
        this.image.src = opt.image || "img/ladder.png";
        this.solid = false;
        this.type = "ladder";
        // important
        this.isLadder = true;
    }
    update(deltaTime){
        super.update(deltaTime);
        // i've decided to hardcode ladders as there's no clear way to avoid
        // ladders overlapping and both affecting the player at once when you
        // press the arrow keys
    }

}