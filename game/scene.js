import { ObjectPlacer } from './objectPlacer.js';
import { ColorBox } from './box/colorBox.js';
import { ImageBox } from './box/imageBox.js';
import { ClimbBox } from './box/climbBox.js';
import { OverlayBox } from './box/overlayBox.js';
import { Player } from './player.js';
import { DebugText } from './debugText.js';
export class Scene {
    objects = [];
    constructor(game) {
        this.game = game;
        this.viewOffsetX = 0;
        this.viewOffsetY = 0;

        this.bg = new Image();
        this.bg.src = 'img/bg.png';

        this.objectPlacer = new ObjectPlacer(this, this.game.hud.placerHud);
        this.objects.push(this.objectPlacer);
        this.debugText = new DebugText(this);
        this.player = new Player({x: 300, y: 0, width: 48, height: 48 + 24, image: 'img/player.png'}, this)
        this.objects.push(this.player);
    }
    loadTestScene() {
        for (let u = 0; u < 6; u++) {
            for (let i = 0; i < 50; i++) {
                let img = 'img/grass.png'
                if(u > 0) img = 'img/dirt.png'
                this.objects.push(new ImageBox({x: i * 48, y: (u * 48)+48, image: img}, this));
            }
        }
        this.objects.push(new ImageBox({x: 48 * 5, y: 0, image: 'img/blueblock.png'}, this));
        this.objects.push(new ImageBox({x: 48 * 2, y: 0, image: 'img/blueblock.png'}, this));
        this.objects.push(new ImageBox({x: 48 * 2, y: -48, image: 'img/blueblock.png'}, this));
        // this.objects.push(new OverlayBox({x: 48 * 3, y: -(48*7), width: 192, height: 192, image: 'img/rainbow.png'}, this));
        // this.objects.push(new ClimbBox({x: 48 * 10, y: 48 * 4, width: 48, height: 48, color: 'lightblue'}, this));
    }
    draw(ctx) {
        // @TODO: draw tiling background properly
        //ctx.setTransform( 1, 0, 0, 1, Math.round(this.viewOffsetX), Math.round(this.viewOffsetY));
        //ctx.fillStyle = ctx.createPattern(this.bg, 'repeat');
        //ctx.fillRect(-50000, -50000, 100000, 1000000);
        //dctx.setTransform( 1, 0, 0, 1, 0, 0);

        // draw objects and object placer
        this.objects.forEach(obj => {
            if(!(obj instanceof Player) && !(obj instanceof ObjectPlacer)){
                obj.draw(ctx, this.viewOffsetX, this.viewOffsetY)
            }
        });
        this.player.draw(ctx, this.viewOffsetX, this.viewOffsetY);
        this.objectPlacer.draw(ctx, this.viewOffsetX, this.viewOffsetY);
        this.objectPlacer.update(ctx);

        // debug text
        this.debugText.update(ctx)
    }
    update(deltaTime){
        this.objects.forEach(obj => {
            if(obj.needsSubstep){
                // @TODO: do we even need substeps anymore
                for(let i = 0; i < 1; i++){
                    obj.update(deltaTime / 1);
                }
            }else{
                obj.update(deltaTime);
            }
        });
    }
}