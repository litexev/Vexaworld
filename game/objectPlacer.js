import { ColorBox } from './box/colorBox.js';
import { ImageBox } from './box/imageBox.js';
import { PhysBox } from './box/physBox.js';
import { PushBox } from './box/pushBox.js';
import { ClimbBox } from './box/climbBox.js';
import { WaterBox } from './box/waterBox.js';
import { KeyHandler } from './keyHandler.js';
import { Player } from './player.js';
import { mod, snapToGrid } from './utils.js';
import { FloodWaterBox } from './box/floodWaterBox.js';


export class ObjectPlacer extends ImageBox{
    constructor(scene, hud){
        super({}, scene);
        this.solid = false;
        this.ignoreIntersects = true;
        this.alpha = 0.5;

        this.x = 0;
        this.y = 0;
        this.prevX = 0;
        this.prevY = 0;
        this.lastBlock = null;
        this.blockChanged = false;
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
        this.buildSound.volume(0.2);

        this.rotateSound = new Howl({src: "sfx/rotate.wav"})
        this.rotateSound.volume(1);

        this.hud = hud;

        // temporary cycler
        this.cycleIndex = 0;
        this.cycle = [
            {class: ImageBox, props: {image: "img/block.png"}, preview: "img/block.png", type:"solid", name: "Metal Block"},
            {class: ClimbBox, props: {image: "img/ladder.png"}, preview: "img/ladder.png", type:"ladder", name: "Ladder"},
            {class: WaterBox, props: {image: "img/water.png"}, preview: "img/water.png", type:"water", name: "Water"},
            {class: PushBox, props: {image: "img/right.png"}, preview: "img/right.png", type:"pusher", name:"Pusher"},
            //{class: ImageBox, props: {image: "img/wideblock.png"}, preview: "img/wideblock.png", width: 96, height: 48}
        ]
        this.setBlock(this.cycle[0]);

        this.keyHandler = new KeyHandler();

        this.scene.game.canvas.addEventListener('mousedown', (e) => {
            if(e.button === 0){
                // Left click to place etc
                this.mouseDown = true;
                this.affectBlock(true);
            }else if(e.button === 2){
                // Rotate placement on right click
                console.log("right click!")
                this.rotation = (this.rotation + 1) % 4
                e.preventDefault();
            }
            
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

        // @TODO: will cause problems with ui input
        window.addEventListener('keydown', (e) => {
            if(e.code == "KeyR"){
                if (e.repeat) { return }
                this.rotation = (this.rotation + 1) % 4
                this.rotateSound.play();
            }
        });
    }
    affectBlock(allowModify){
        let breakMode = this.keyHandler.isPressed("ControlLeft");
        let altMode = this.keyHandler.isPressed("AltLeft") || this.keyHandler.isPressed("AltRight");
        let rotateMode = this.keyHandler.isPressed("KeyR");
        let resetMode = this.keyHandler.isPressed("KeyT");
        let currentBlock = this.getBlockAtPos();

        this.blockChanged = false;
        if(this.lastBlock !== currentBlock){
            this.lastBlock = currentBlock;
            this.blockChanged = true
        }

        if(currentBlock != false && (allowModify || this.blockChanged)){
            if(rotateMode){
                currentBlock.rotate(1);
                this.rotateSound.play();
                return;
            }
            if(resetMode){
                currentBlock.rotation = 0;
                this.rotateSound.play();
                return;
            }
            if(altMode){
                currentBlock.altclick();
                return;
            }
            if(breakMode){
                this.destroyBox(currentBlock);
                return;
            }
        }
        // @TODO: why??????
        if(rotateMode || resetMode || altMode || breakMode) return;
        if(!currentBlock && this.posChanged){
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
        this.blockClass = opt.class;
        this.blockProps = opt.props || {};
        this.blockWidth = opt.width || 48;
        this.blockHeight = opt.height || 48;
        this.width = this.blockWidth;
        this.height = this.blockHeight;
        this.setImage(opt.preview || "img/block.png")

        // hud
        this.hud.setContent(opt.preview || "img/block.png", opt.name, opt.type);
    }

    createBox(){
        let newBlock = new this.blockClass(this.blockProps, this.scene);
        newBlock.hidden = true;
        newBlock.x = this.x;
        newBlock.y = this.y;

        newBlock.rotation = this.rotation;

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

    destroyBox(obj){
        this.scene.objects.splice(this.scene.objects.indexOf(obj), 1);
    }

    getBlockAtPos(){
        this.foundBlock = false;
        this.scene.objects.forEach(obj => {
            if (obj.willIntersect(this.x + 1, this.y + 1, this.blockWidth - 2, this.blockHeight - 2)) {
                if(!(obj instanceof Player)){
                    this.foundBlock = obj;
                }
            }
        });
        return this.foundBlock;
    }
}