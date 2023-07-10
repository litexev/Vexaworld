import { ImageBox } from './imageBox.js';
import { WaterBox } from './waterBox.js';
import { clamp } from '../utils.js';

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
    onWater = false;
    constructor(opt, scene) {
        super(opt, scene);
        this.debugHitbox = false;
        this.needsSubstep = true;
        this.solid = opt.solid || true;

        // Disable gravity, used for ladders and player noclip
        this.useGravity = opt.useGravity || true;

        // Disable ground / wall collision, used for player noclip
        this.noCollide = opt.noCollide || false;
        
        // Sound played when the object is grounded
        this.landSound = new Howl({src: opt.landSound || 'sfx/land.ogg'});
        this.landSound.volume(0.3)

        this.lastPreGround = 0;
    }
    /*draw(ctx, viewOffsetX, viewOffsetY){
        super.draw(ctx, viewOffsetX, viewOffsetY);
        ctx.font = "14px Arial";
        ctx.fillStyle = "white";
        ctx.fillText(this.isGrounded, this.x + 40 + viewOffsetX, this.y + viewOffsetY);
        ctx.fillText(this.lastPreGround.toFixed(4), this.x + 40 + viewOffsetX, this.y + 20 + viewOffsetY);
    }*/
    update(deltaTime) {
        if(this.useGravity) this.applyGravity(deltaTime);
        this.calculateNewPosition(deltaTime);
        this.moveWithVelocity(deltaTime);
        this.lastPreGround = this.y;
        if(!this.noCollide) this.performGroundCheck();
        this.reduceVelocityOverTime(deltaTime, 0.05);
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
        if (this.canMoveWithoutIntersection() || this.noCollide) {
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
        // We only need to reduce the y velocity if gravity isn't doing it for us
        if(!this.useGravity) this.velY *= 1 - (reductionRate/3 * deltaTime);

        // Terminal velocity limits
        this.velX = clamp(this.velX, -10, 10);
        this.velY = clamp(this.velY, -2, 2);

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

                // Bottom block collision
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

                // Top block collision
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