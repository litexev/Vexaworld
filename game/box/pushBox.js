import { Transform } from '../transform.js';
import { ImageBox } from './imageBox.js';
import { Player } from '../player.js';
import { PhysBox } from './physBox.js';

export class PushBox extends ImageBox {
    constructor(opt, scene) {
        super(opt, scene);
        this.image.src = "img/right.png";
        this.solid = false;
        this.overlay = true;
        this.rotation = 0;
        this.accurateHitbox = false;
        this.hitboxWidth, this.hitboxHeight = 48/2, 48/2;
        this.isLadder = true;
    }
    update(deltaTime){
        super.update(deltaTime);
        this.scene.objects.forEach(obj => {
            if((obj instanceof Player || obj instanceof PhysBox) && !obj.noclip && this.inside(obj)){
                switch(this.rotation){
                    case 0:
                        obj.velX = 1;
                        break;
                    case 1:
                        obj.velY = 0.7;
                        break;
                    case 2:
                        obj.velX = -1;
                        break;
                    case 3:
                        obj.velY = -0.7;
                        break;
                }
            }
        })
    }

}