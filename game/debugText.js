export class DebugText{
    constructor(scene){
        this.scene = scene;
    }
    update(ctx){
        ctx.font = "12px Arial";
        ctx.fillStyle = "gray";
        ctx.fillText("Vexaworld [DEBUG]", 10, 20 * 5);
        ctx.fillText(`x: ${this.scene.player.x.toFixed(4)}, vel: ${this.scene.player.velX.toFixed(4)}`, 10, 20 * 6);
        ctx.fillText(`y: ${this.scene.player.y.toFixed(4)}, vel: ${this.scene.player.velY.toFixed(4)}`, 10, 20 * 7);
        ctx.fillText(`objspace: ${(this.scene.player.x / 48).toFixed(2)}, ${(this.scene.player.y / 48).toFixed(2)}`, 10, 20 * 8);
        ctx.fillText(`object count: ${this.scene.objects.length}`, 10, 20 * 9);
    }
}