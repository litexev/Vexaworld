import { Transform } from '../transform.js';
export class ImageBox extends Transform {
    constructor(opt, scene) {
        super(opt, scene);
        this.image = new Image();
        this.image.src = opt.image || 'img/block.png';
        this.flip = opt.flip || false;
        this.solid = opt.solid || true;
        this.alpha = opt.alpha || 1;
    }
    draw(ctx, viewOffsetX, viewOffsetY){
        if(this.hidden) return;
        let accX = this.x;
        let accY = this.y;
    
        // apply viewoffset
        accX += viewOffsetX;
        accY += viewOffsetY;
    
        // apply hitbox correction
        if(!this.bottomHitbox){
            // center the hitbox
            accX += (this.hitboxWidth - this.width) / 2;
            accY += (this.hitboxHeight - this.height) / 2;
        }else{
            accX += (this.hitboxWidth - this.width) / 2;
            accY += (this.hitboxHeight - this.height);
        }
        // round so it's pixel-perfect
        accX = Math.round(accX);
        accY = Math.round(accY);
    
        ctx.save();
        ctx.globalAlpha = this.alpha;
        
        // Translate to image center regardless of flip
        ctx.translate(accX + this.width / 2, accY + this.height / 2);
        
        // Rotate image
        ctx.rotate(this.rotation * Math.PI / 2);
    
        if (this.flip) {
            ctx.scale(-1, 1);
            ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        } else {
            ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        }
    
        ctx.restore();
    
        ctx.globalAlpha = 1;
        if(this.debugHitbox){
            // hitbox visualizer
            ctx.fillStyle = "red";
            ctx.fillRect(this.x + viewOffsetX, this.y + viewOffsetY, this.hitboxWidth, this.hitboxHeight);
        }
    }
    
    setImage(url){
        this.image.src = url;
    }
}
