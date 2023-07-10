import { ColorBox } from './box/colorBox.js';
import { ImageBox } from './box/imageBox.js';
import { PhysBox } from './box/physBox.js';
import { PushBox } from './box/pushBox.js';
import { ClimbBox } from './box/climbBox.js';
import { WaterBox } from './box/waterBox.js';
import { KeyHandler } from './keyHandler.js';
import { Player } from './player.js';
import { mod } from './utils.js';

function snapToGrid(number, step){
    return Math.round(number / step) * step
}
export class ObjectPlacer extends ImageBox{
    constructor(scene){
        super({}, scene);
        this.solid = false;
        this.ignoreIntersects = true;
        this.alpha = 0.5;

        this.x = 0;
        this.y = 0;
        this.prevX = 0;
        this.prevY = 0;
        this.posChanged = false;

        this.blockSize = 48;
        this.width = this.blockSize;
        this.height = this.blockSize;
        this.mouseDown = false;
        this.mouseX = 0;
        this.mouseY = 0;

        this.blockClass = ImageBox;
        this.blockProps = {image: "img/block.png"}
        
        this.buildSound = new Howl({src: "sfx/build.wav"})
        this.buildSound.volume(0.1)

        // temporary cycler
        this.cycleIndex = 0;
        this.cycle = [
            {blockClass: ImageBox, blockProps: {image: "img/block.png"}, previewImage: "img/block.png", objectSize: 48},
            {blockClass: ClimbBox, blockProps: {image: "img/ladder.png"}, previewImage: "img/ladder.png", objectSize: 48},
            {blockClass: WaterBox, blockProps: {image: "img/water.png"}, previewImage: "img/water.png", objectSize: 48},
            {blockClass: PushBox, blockProps: {image: "img/right.png"}, previewImage: "img/right.png", objectSize: 48},
        ]
        this.keyHandler = new KeyHandler();
        this.scene.game.canvas.addEventListener('mousedown', (e) => {
            this.mouseDown = true;
            this.affectBlock();
        });
        // temporary cycler
        this.scene.game.canvas.addEventListener('wheel', (e) => {
            if(e.deltaY > 0) this.cycleIndex += 1
            if(e.deltaY < 0) this.cycleIndex -= 1
            this.cycleIndex = mod(this.cycleIndex, this.cycle.length)
            this.setBlock(this.cycle[this.cycleIndex]);
            this.buildSound.play();
        })
        this.scene.game.canvas.addEventListener('mouseup', (e) => {
            this.mouseDown = false;
        });
        this.scene.game.canvas.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            if(this.mouseDown){
                this.affectBlock();
            }
        });
    }
    affectBlock(){
        let breakMode = this.keyHandler.isPressed("ControlLeft");
        let altMode = this.keyHandler.isPressed("AltLeft") || this.keyHandler.isPressed("AltRight");
        let replaceMode = this.keyHandler.isPressed("ShiftLeft") || this.keyHandler.isPressed("ShiftRight");

        if(altMode){
            this.altBox();
            return
        }

        // Only run these if we're not on the same block
        if(this.posChanged){
            if(replaceMode && this.posChanged){
                this.destroyBox();
                this.createBox();
                return
            }
            if(breakMode && this.posChanged){
                this.destroyBox();
                return
            }
            this.createBox();
            this.posChanged = false;
        }
    }
    update(ctx){
        super.update(ctx);
        // @TODO: event listeners
        this.x = snapToGrid(this.mouseX - this.scene.viewOffsetX - this.blockSize/2, this.blockSize);
        this.y = snapToGrid(this.mouseY - this.scene.viewOffsetY - this.blockSize/2, this.blockSize);
        if(this.x != this.prevX || this.y != this.prevY){
            this.posChanged = true;
            this.prevX = this.x;
            this.prevY = this.y;
        }
    }
    setBlock(opt){
        this.blockClass = opt.blockClass;
        this.blockProps = opt.blockProps || {};
        this.objectSize = opt.objectSize || 48;
        this.setImage(opt.previewImage || "img/block.png")
    }
    createBox(){
        console.log("lets create")
        let isColliding = false;
        this.scene.objects.forEach(obj => {
            if (obj.willIntersect(this.x + 1, this.y + 1, this.blockSize - 2, this.blockSize - 2) && !obj.overlay) {
                isColliding = true;
            }
        });

        let newBlock = new this.blockClass(this.blockProps, this.scene);
        if( isColliding && !newBlock.overlay ) return;
        newBlock.x = this.x;
        newBlock.y = this.y;
        // @TODO: support for bottom hitbox
        if(!newBlock.accurateHitbox && !newBlock.bottomHitbox){
            newBlock.x += (newBlock.width - newBlock.hitboxWidth ) / 2
            newBlock.y += (newBlock.height - newBlock.hitboxHeight ) / 2
        }
        newBlock.width = this.blockSize;
        newBlock.height = this.blockSize;
        this.scene.objects.push(newBlock);
        this.buildSound.play();
    }
    destroyBox(){
        this.scene.objects.forEach(obj => {
            if (obj.willIntersect(this.x + 1, this.y + 1, this.blockSize - 2, this.blockSize - 2)) {
                if(!(obj instanceof Player)){
                    this.scene.objects.splice(this.scene.objects.indexOf(obj), 1);
                }
            }
        });
    }
    altBox(){
        this.scene.objects.forEach(obj => {
            if (obj.willIntersect(this.x + 1, this.y + 1, this.blockSize - 2, this.blockSize - 2)) {
                if(!(obj instanceof Player)){
                    obj.altclick();
                }
            }
        });
    }
}