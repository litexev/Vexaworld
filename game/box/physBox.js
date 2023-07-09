import { ColorBox } from './colorBox.js';
import { ImageBox } from './imageBox.js';
import { WaterBox } from './waterBox.js';
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
function negativeOnly(number) {
    if (number < 0) {
      return number; // Return the negative float
    } else {
      return 0; // Return 0 for positive floats
    }
  }
  
export class PhysBox extends ImageBox {
    velX = 0;
    velY = 0;
    defaultGravity = 2 / 1000;
    gravity = 2 / 1000;
    isGrounded = false;
    newX;
    newY;
    onLadder = false;
    onWater = false;
    constructor(opt, scene) {
        super(opt, scene);
        this.debugHitbox = false;
        this.needsSubstep = true;
        this.noclip = false; // stub for player
        this.solid = opt.solid || true;
        this.lastPreGround = 0;
        this.landSound = new Howl({src: 'sfx/land.ogg'});
        this.landSound.volume(0.3)
    }
    /*draw(ctx, viewOffsetX, viewOffsetY){
        super.draw(ctx, viewOffsetX, viewOffsetY);
        ctx.font = "14px Arial";
        ctx.fillStyle = "white";
        ctx.fillText(this.isGrounded, this.x + 40 + viewOffsetX, this.y + viewOffsetY);
        ctx.fillText(this.lastPreGround.toFixed(4), this.x + 40 + viewOffsetX, this.y + 20 + viewOffsetY);
    }*/
    update(deltaTime) {
        if(this.ladderCheck() == true && this.onLadder == false){
            // ladder entered, remove existing velocity
            this.velY = 0;
        }
        if(this.ladderCheck() == false && this.onLadder == true){
            // ladder exited, give a small boost to help exiting
            // @TODO: this breaks exiting downwards, fix by figuring out what direction to apply a boost in somehow
            this.velY = -0.5;
        }
        this.onLadder = this.ladderCheck();
        if(this.onLadder == false || this.onWater){
            this.applyGravity(deltaTime);
        }
        this.calculateNewPosition(deltaTime);
        this.moveWithVelocity(deltaTime);
        this.lastPreGround = this.y;
        if(!this.noclip) this.performGroundCheck();
        this.reduceVelocityOverTime(deltaTime, 0.05);
    }
    ladderCheck(){
        if(this.noclip) return true;
        let foundLadder = false;
        this.scene.objects.forEach(obj => {
            if(obj.isLadder && obj.intersects(this)){
                foundLadder = true;
                if(obj instanceof WaterBox){
                    this.onWater = true;
                }else{
                    this.onWater = false;
                }
            }
        })
        return foundLadder;
    }
    applyGravity(deltaTime) {
        if (!this.isGrounded) {
            this.velY += this.gravity * deltaTime;
        }
    }

    calculateNewPosition(deltaTime){
        this.newX = this.x + this.velX * deltaTime;
        this.newY = this.y - 0.01;
    }

    moveWithVelocity(deltaTime){
        if (this.canMoveWithoutIntersection() || this.noclip) {
            this.x = this.newX;
        }
        
        if( this.isGrounded ){
            this.velY = negativeOnly(this.velY);
        }
        this.y += this.velY * deltaTime;
    }
    
    canMoveWithoutIntersection() {
        for (const obj of this.scene.objects) {
            if (obj !== this && obj.willIntersect(this.newX, this.newY, this.hitboxWidth, this.hitboxHeight) && obj.solid) {
                return false;
            }
        }
        return true;
    }
    
    reduceVelocityOverTime(deltaTime, reductionRate){
        this.velX *= 1 - (reductionRate * deltaTime);
        if(!this.onLadder){
            this.velY = clamp(this.velY, -2, 2);
        }else{
            // on ladders we want to reduce the y velocity over time too as there's no gravity
            this.velY *= 1 - (reductionRate * 0.5 * deltaTime);
        }
    }
    
    performGroundCheck() {
        let ourTop = this.y;
        let ourBottom = this.y + this.hitboxHeight;
        // Do a check over all objects to determine isGrounded
        this.isGrounded = this.scene.objects.some(obj => {
            // If the object isn't itself, and will intersect with the object we're looping over
            if(obj !== this && obj.willIntersect(this.x, this.y, this.hitboxWidth, this.hitboxHeight) && obj.solid) {
                let otherTop = obj.y;
                let otherBottom = obj.y + obj.hitboxHeight;
                // If the object's top y is lower than our top y (so we aren't below the object)
                // and the object's top y is higher than our bottom y (so we are touching)
                if(otherTop > ourTop && otherTop-1 < ourBottom) {
                    // Reset our velocity and snap our ground position
                    this.velY = 0;
                    this.correctBottomPosition(obj);
                    // Now we ground ourselves (if we aren't yet)
                    if(!this.isGrounded){
                        this.landSound.play();
                    }
                    return true;
                }
                // If the bottom y of the object is below our top y
                // and the object's bottom y is above our bottom y
                // then correct our top position
                if(otherBottom > ourTop && otherBottom < ourBottom){
                    this.velY = 0;
                    this.correctTopPosition(obj);
                }
            }
            return false;
        });
    }
        
    correctBottomPosition(obj){
        if(obj.y === this.y + this.hitboxHeight) return;
        this.y = obj.y - this.hitboxHeight;
    }
    
    correctTopPosition(obj){
        if(obj.y + obj.hitboxHeight === this.y) return;
        this.y = obj.y + obj.hitboxHeight;
    }
    
}