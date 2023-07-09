import { Transform } from './transform.js';
import { ColorBox } from './colorBox.js';
import { Player } from './player.js';

export class FloodWaterBox extends ColorBox {
    constructor(opt, scene) {
        super(opt, scene);
        this.color = opt.color || 'rgba(71, 109, 222, 0.5)';
        this.solid = opt.solid || false;
        this.tickPassed = 0;
    }
    update(deltaTime){
        super.update(deltaTime);
        this.tickPassed += deltaTime;
        console.log(this.tickPassed);
        if(this.tickPassed > 300){
            this.doIteration()
            this.tickPassed = 0;
        }
        // console.log(this.checkUp(), this.checkDown(), this.checkLeft(), this.checkRight());

    }
    doIteration(){
        if(!this.checkDown() && !this.checkWaterDown()){
                this.createWater(0, 48);
        }else if(!this.checkUp()){
            if(!this.checkLeft()){
                this.scene.objects.push(new WaterBox({x: this.x - 48, y: this.y, width: this.width, height: this.height, color: this.color}, this.scene));
            }
            if(!this.checkRight()){
                this.scene.objects.push(new WaterBox({x: this.x + 48, y: this.y, width: this.width, height: this.height, color: this.color}, this.scene));
            } 
        }
        if(!this.checkUp() && this.checkLeft() && this.checkRight() && this.checkDown()){
            this.scene.objects.push(new WaterBox({x: this.x, y: this.y - 48, width: this.width, height: this.height, color: this.color}, this.scene));
        }
    }
    createWater(xOffset, yOffset){
        this.scene.objects.push(new WaterBox({x: this.x + xOffset, y: this.y + yOffset, width: this.width, height: this.height, color: this.color}, this.scene));
    }
    checkDown(){
        let theObj = false;
        this.scene.objects.forEach(obj => {
            if(obj !== this && !(obj instanceof WaterBox) && !(obj instanceof Player) && obj.willIntersect(this.x, this.y + 48, this.width, this.height)){
                theObj = obj;
            }
        })
        return theObj;
    }
    checkWaterDown(){
        let theObj = false;
        this.scene.objects.forEach(obj => {
            if(obj !== this && obj instanceof WaterBox && obj.willIntersect(this.x, this.y + 48, this.width, this.height)){
                theObj = true;
            }
        })
        return theObj;
    }
    
    checkUp(){
        let found = false;
        this.scene.objects.forEach(obj => {
            if(obj !== this && !(obj instanceof Player) && obj.willIntersect(this.x, this.y - 48, this.width, this.height)){
                found = true;
            }
        })
        return found;
    }
    checkLeft(){
        let found = false;
        this.scene.objects.forEach(obj => {
            if(obj !== this && !(obj instanceof Player) && obj.willIntersect(this.x - 48, this.y, this.width, this.height)){
                found = true;
            }
        })
        return found;
    }
    checkRight(){
        let found = false;
        this.scene.objects.forEach(obj => {
            if(obj !== this && !(obj instanceof Player) && obj.willIntersect(this.x + 48, this.y, this.width, this.height)){
                found = true;
            }
        })
        return found;
    }
}