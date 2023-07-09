export class DebugText{
    constructor(scene){
        this.scene = scene;
    }
    update(ctx){
        ctx.font = "12px Arial";
        ctx.fillStyle = "gray";
        ctx.fillText("VEXAWORLD [DEBUG]", 10, 20);
        ctx.fillText(`x: ${this.scene.player.x.toFixed(4)}, vel: ${this.scene.player.velX.toFixed(4)}`, 10, 20 * 2);
        ctx.fillText(`y: ${this.scene.player.y.toFixed(4)}, vel: ${this.scene.player.velY.toFixed(4)}`, 10, 20 * 3);
        ctx.fillText(`object count: ${this.scene.objects.length}`, 10, 20 * 4);
    }
}