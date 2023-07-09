import { Transform } from '../transform.js';

export class ColorBox extends Transform {
    constructor(opt, scene) {
        super(opt, scene);
        this.color = opt.color || 'red';
        this.solid = opt.solid || true;
    }
    draw(ctx, viewOffsetX, viewOffsetY){
        ctx.fillStyle = this.color;
        ctx.fillRect(Math.round(this.x + viewOffsetX), Math.round(this.y + viewOffsetY), this.width, this.height);
    }
}