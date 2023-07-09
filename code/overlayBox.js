import { ImageBox } from './imageBox.js';

export class OverlayBox extends ImageBox {
    constructor(opt, scene) {
        super(opt, scene);
        this.image.src = opt.src || "rainbow.png";
        this.solid = false;
        this.overlay = true;
    }

}