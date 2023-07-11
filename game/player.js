import { PhysBox } from './box/physBox.js';
import { ClimbBox } from './box/climbBox.js';
import { WaterBox } from './box/waterBox.js';
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
        this.onLadder = false;
        this.onWater = false;
    }
    
    update(deltaTime){
        // Physics pre-config
        this.doLadderBoost();
        this.onLadder = this.ladderCheck();

        this.useGravity = true;
        this.noCollide = false;
        this.ignoreIntersects = false;

        if(this.onLadder) this.useGravity = false;
        if(this.onWater) this.useGravity = true;

        if(this.noclip){
            this.useGravity = false;
            this.noCollide = true;
            this.ignoreIntersects = true;
        }

        // DEBUG temp
        if(this.keyHandler.isPressed("KeyE")){
            this.velY = 2;
        }
        // Update Physbox
        super.update(deltaTime);
        // Scene view autoscroll with lerping
        let targetOffsetX = this.scene.game.canvas.width / 3;
        let targetOffsetY = this.scene.game.canvas.height / 1.6;
        const targetX = -this.x + targetOffsetX;
        const targetY = -this.y + targetOffsetY;
        const lerpSpeedX = 0.01;
        const lerpSpeedY = 0.003;

        // Lerp the viewOffsetX and viewOffsetY towards the target values
        this.scene.viewOffsetX += (targetX - this.scene.viewOffsetX) * lerpSpeedX * deltaTime;
        this.scene.viewOffsetY += (targetY - this.scene.viewOffsetY) * lerpSpeedY * deltaTime;

        // Noclip toggle
        // @TODO: We should be using the keyHandler for this
        window.onkeydown = (e) => {
            if(e.code == "KeyV"){
                this.noclip = !this.noclip;
            }
        }

        // Select right type fo movement
        if(this.noclip){
            this.doLadderMovement(deltaTime, 0.02, 0.4);
            return
        }
        if(this.onLadder){
            this.doLadderMovement(deltaTime, 0.01, 0.2);
            return
        }
        this.doNormalMovement(deltaTime);
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
            console.log("JUMP!")
            if(this.isGrounded || this.onLadder){
                this.isGrounded = false;
                this.velY = -0.8;
            }
        }
    }

    ladderCheck(){
        let foundLadder = false;
        let foundWater = false;
        this.scene.objects.forEach(obj => {
            if(obj.isLadder && obj.intersects(this)){
                foundLadder = true;
                if(obj instanceof WaterBox) foundWater = true;
            }
        })
        this.onWater = foundWater;
        return foundLadder;
    }

    doLadderBoost(){
        if(this.ladderCheck() == true && this.onLadder == false){
            // ladder entered, remove existing velocity
            this.velY = 0;
        }
        if(this.ladderCheck() == false && this.onLadder == true){
            // ladder exited, give a small boost to help exiting
            if(this.velY < 0) this.velY = this.velY * 3;
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
            this.velY = -ySpeed;
        }
        if(this.keyHandler.isPressed("ArrowDown") || this.keyHandler.isPressed("KeyS")){
            this.velY = ySpeed;
        }
    }
}