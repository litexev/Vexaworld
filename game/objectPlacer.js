import { ColorBox } from './box/colorBox.js';
import { ImageBox } from './box/imageBox.js';
import { PhysBox } from './box/physBox.js';
import { PushBox } from './box/pushBox.js';
import { ClimbBox } from './box/climbBox.js';
import { WaterBox } from './box/waterBox.js';
import { KeyHandler } from './keyHandler.js';
import { Player } from './player.js';
import { mod } from './utils.js';
import { FloodWaterBox } from './box/floodWaterBox.js';

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

        this.blockWidth = 48;
        this.blockHeight = 48;

        this.width = this.blockWidth;
        this.height = this.blockHeight;
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
            {blockClass: ImageBox, blockProps: {image: "img/block.png", hitboxWidth: 46, hitboxHeight: 46}, previewImage: "img/block.png", objectWidth: 48, objectHeight: 48},
            {blockClass: ImageBox, blockProps: {image: "img/wideblock.png"}, previewImage: "img/wideblock.png", objectWidth: 96, objectHeight: 48},
            {blockClass: ClimbBox, blockProps: {image: "img/ladder.png"}, previewImage: "img/ladder.png", objectSize: 48},
            {blockClass: WaterBox, blockProps: {image: "img/water.png"}, previewImage: "img/water.png", objectSize: 48},
            {blockClass: PushBox, blockProps: {image: "img/right.png"}, previewImage: "img/right.png", objectSize: 48},
            {blockClass: FloodWaterBox, blockProps: {image: "img/floodWater.png"}, previewImage: "img/floodWater.png", objectSize: 48},

        ]
        this.setBlock(this.cycle[0]);
        this.keyHandler = new KeyHandler();

        this.scene.game.canvas.addEventListener('mousedown', (e) => {
            this.mouseDown = true;
            this.affectBlock(true);
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
                this.affectBlock(false);
            }
        });

    }
    affectBlock(allowAltMode){
        let breakMode = this.keyHandler.isPressed("ControlLeft");
        let altMode = this.keyHandler.isPressed("AltLeft") || this.keyHandler.isPressed("AltRight");

        // Only run these if we're not on the same block
        if(this.posChanged){
            if(altMode){
                if(allowAltMode) this.altBox();
                return
            }
            if(breakMode){
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
        this.x = snapToGrid(this.mouseX - this.scene.viewOffsetX - this.blockWidth/2, this.blockWidth);
        this.y = snapToGrid(this.mouseY - this.scene.viewOffsetY - this.blockHeight/2, this.blockHeight);
        if(this.x != this.prevX || this.y != this.prevY){
            this.posChanged = true;
            this.prevX = this.x;
            this.prevY = this.y;
        }
    }
    setBlock(opt){
        this.blockClass = opt.blockClass;
        this.blockProps = opt.blockProps || {};
        this.blockWidth = opt.objectWidth || 48;
        this.blockHeight = opt.objectHeight || 48;
        this.width = this.blockWidth;
        this.height = this.blockHeight;
        this.setImage(opt.previewImage || "img/block.png")
    }
    createBox(){
        let isColliding = false;
        this.scene.objects.forEach(obj => {
            if (obj.willIntersect(this.x + 1, this.y + 1, this.blockWidth - 2, this.blockHeight - 2) && !obj.overlay) {
                isColliding = true;
            }
        });

        let newBlock = new this.blockClass(this.blockProps, this.scene);
        newBlock.hidden = true;
        if( isColliding && !newBlock.overlay ) return;
        newBlock.x = this.x;
        newBlock.y = this.y;

        // @TODO: support for bottom hitbox
        if(!newBlock.accurateHitbox){
            newBlock.x += (newBlock.width - newBlock.hitboxWidth ) / 2
            if(newBlock.bottomHitbox){
                newBlock.y += (newBlock.height - newBlock.hitboxHeight )
            }else{
                newBlock.y += (newBlock.height - newBlock.hitboxHeight ) / 2
            }
        }
        newBlock.width = this.blockWidth;
        newBlock.height = this.blockHeight;

        // bug workaround
        newBlock.hitboxWidth = this.blockProps.hitboxWidth || newBlock.hitboxWidth;
        newBlock.hitboxHeight = this.blockProps.hitboxHeight || newBlock.hitboxHeight;

        this.scene.objects.push(newBlock);

        newBlock.hidden = false;
        this.buildSound.play();
    }
    destroyBox(){
        this.scene.objects.forEach(obj => {
            if (obj.willIntersect(this.x + 1, this.y + 1, this.blockWidth - 2, this.blockHeight - 2)) {
                if(!(obj instanceof Player)){
                    this.scene.objects.splice(this.scene.objects.indexOf(obj), 1);
                }
            }
        });
    }
    altBox(){
        this.scene.objects.forEach(obj => {
            if (obj.willIntersect(this.x + 1, this.y + 1, this.blockWidth - 2, this.blockHeight - 2)) {
                if(!(obj instanceof Player)){
                    obj.altclick();
                }
            }
        });
    }
}