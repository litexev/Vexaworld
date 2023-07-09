import { Transform } from '../transform.js';
import { ImageBox } from './imageBox.js';
import { Player } from '../player.js';

export class PushBox extends ImageBox {
    constructor(opt, scene) {
        super(opt, scene);
        this.image.src = "img/right.png";
        this.solid = false;
        this.overlay = true;
        this.rotation = 0;
    }
    altclick(){
        super.altclick();
        this.rotation = (this.rotation + 1) % 4;
        // console.log(this.rotation);
        switch(this.rotation){
            // @ TODO: use this.setImage("url") instead
            case 0:
                this.image.src = "img/right.png";
                break;
            case 1:
                this.image.src = "img/down.png";
                break;
            case 2:
                this.image.src = "img/left.png";
                break;
            case 3:
                this.image.src = "img/up.png";
                break;
        }
    }
    update(deltaTime){
        super.update(deltaTime);
        this.scene.objects.forEach(obj => {
            if(obj instanceof Player && this.intersects(obj)){
                switch(this.rotation){
                    case 0:
                        obj.velX = 1;
                        break;
                    case 1:
                        obj.velY = 1;
                        break;
                    case 2:
                        obj.velX = -1;
                        break;
                    case 3:
                        obj.velY = -0.5;
                        break;
                }
            }
        })
    }

}