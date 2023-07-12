import { Transform } from '../transform.js';
import { ImageBox } from './imageBox.js';
import { Player } from '../player.js';
import { rndInt } from '../utils.js';
export class FloodWaterBox extends ImageBox {
    constructor(opt, scene) {
        super(opt, scene);
        this.image.src = opt.image || 'img/floodWater.png';
        this.solid = opt.solid || false;
        this.tickPassed = 0;
        this.type = "floodwater"
    }
    update(deltaTime){
        super.update(deltaTime);
        this.tickPassed += deltaTime;
        if(this.tickPassed > (100 + rndInt(0,1000))){
            this.doIteration()
            this.tickPassed = 0;
        }

    }
    doIteration(){
        if(!this.checkDirection(0, 1)) this.createWater(0, 1)
        // if(!this.checkUp()) this.createWater(0, -1)
        if(!this.checkDirection(-1, 0)) this.createWater(-1, 0)
        if(!this.checkDirection(1, 0)) this.createWater(1, 0)
    }
    createWater(xOffset, yOffset){
        this.scene.objects.push(new FloodWaterBox({x: this.x + (xOffset * 48), y: this.y + (yOffset * 48), width: this.width, height: this.height, color: this.color}, this.scene));
    }
    checkDirection(xOffset, yOffset){
        let theObj = false;
        this.scene.objects.forEach(obj => {
            if(obj !== this && !(obj instanceof Player) && obj.willIntersect(this.x + (xOffset * 48) + 1, this.y + (yOffset * 48) + 1, this.width - 2, this.height - 2)){
                theObj = obj;
            }
        })
        return theObj;
    }
}