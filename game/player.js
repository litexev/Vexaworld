import { PhysBox } from './box/physBox.js';
import { ClimbBox } from './box/climbBox.js';
import { KeyHandler } from './keyHandler.js';

export class Player extends PhysBox{   
    constructor(x, y, width, height, color, scene){
        super(x, y, width, height, color, scene);
        this.keyHandler = new KeyHandler();
        this.accurateHitbox = false;
        this.bottomHitbox = true;
        this.noclip = false;
        this.hitboxWidth = this.width / 2;
        this.hitboxHeight = this.height / 2;
    }
    update(deltaTime){
        super.update(deltaTime);
            // scene view autoscroll with lerping
            let targetOffsetX = this.scene.game.canvas.width / 3;
            let targetOffsetY = this.scene.game.canvas.height / 1.6;
            const targetX = -this.x + targetOffsetX;
            const targetY = -this.y + targetOffsetY;
            const lerpSpeedX = 0.01; // Adjust this value to control the speed of the camera movement
            const lerpSpeedY = 0.003; // Adjust this value to control the speed of the camera movement

            // Lerp the viewOffsetX and viewOffsetY towards the target values
            this.scene.viewOffsetX += (targetX - this.scene.viewOffsetX) * lerpSpeedX * deltaTime;
            this.scene.viewOffsetY += (targetY - this.scene.viewOffsetY) * lerpSpeedY * deltaTime;

            // Noclip toggle @TODO: debug mode
            if(this.keyHandler.isPressed("KeyV")){
                this.noclip = !this.noclip;
            }
            if(this.noclip){
                this.doLadderMovement(deltaTime, 0.02, 0.4);
                return
            }
            // console.log(this.onLadder);
            // Choose right type of movement
            (!this.onLadder) ? this.doNormalMovement(deltaTime) : this.doLadderMovement(deltaTime, 0.01, 0.2);
        }
        doNormalMovement(deltaTime){
            // Normal movement (left and right)
            if(this.keyHandler.isPressed("ArrowLeft") || this.keyHandler.isPressed("KeyA")){
                this.velX += -0.02 * deltaTime;
                this.flip = 1;
            }
            if(this.keyHandler.isPressed("ArrowRight") || this.keyHandler.isPressed("KeyD")){
                this.velX += 0.02 * deltaTime;
                this.flip = 0;
            }
            if(this.keyHandler.isPressed("Space") || this.keyHandler.isPressed("ArrowUp")){
                if(this.isGrounded || this.onLadder){
                    this.isGrounded = false;
                    this.velY = -0.8;
                }
            }
        }
        doLadderMovement(deltaTime, xSpeed, ySpeed){
            // Ladder movement (up, down, left, right)
            if(this.keyHandler.isPressed("ArrowLeft") || this.keyHandler.isPressed("KeyA")){
                this.velX += -xSpeed * deltaTime;
                this.flip = 1;
            }
            if(this.keyHandler.isPressed("ArrowRight") || this.keyHandler.isPressed("KeyD")){
                this.velX += xSpeed * deltaTime;
                this.flip = 0;
            }
            if(this.keyHandler.isPressed("Space") || this.keyHandler.isPressed("ArrowUp") || this.keyHandler.isPressed("KeyW")){
                if(this.isGrounded || this.onLadder){
                    this.isGrounded = false;
                    this.velY = -ySpeed;
                }
            }
            if(this.keyHandler.isPressed("ArrowDown") || this.keyHandler.isPressed("KeyS")){
                if(this.isGrounded || this.onLadder){
                    this.isGrounded = false;
                    this.velY = ySpeed;
                }
            }
        }
}