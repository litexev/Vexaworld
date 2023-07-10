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
    isGrounded = true;
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

        this.xBlocker = null;
        this.yBlocker = null;
    }

    update(deltaTime) {
        if(this.useGravity) this.applyGravity(deltaTime);
        this.calculateNewPosition(deltaTime);
        this.applyNewPosition(deltaTime);
        this.reduceVelocityOverTime(deltaTime, 0.05);
    }

    applyGravity(deltaTime) {
        if (!this.isGrounded) {
            this.velY += this.gravity * deltaTime;
        }
    }

    calculateNewPosition(deltaTime){
        this.newX = this.x + this.velX * deltaTime;
        this.newY = this.y + this.velY * deltaTime;
    }

    applyNewPosition(deltaTime){
        if (this.canMoveX() || this.noCollide) this.x = this.newX;
        if (this.canMoveY() || this.noCollide){
            this.y += this.velY * deltaTime;
            this.setGrounded(false)
        }else{
            if(this.isBelow(this.yBlocker)){
                this.snapBottom(this.yBlocker);
                this.setGrounded(true);
            }else{
                this.velY = 0;
                this.snapTop(this.yBlocker);
            }
        }
    }
    
    setGrounded(ground){
        if(ground && !this.isGrounded){
            this.isGrounded = true;
            this.landSound.play();
        } else if(!ground && this.isGrounded){
            this.isGrounded = false;
        }
    }
    canMoveX() {
        for (const obj of this.scene.objects) {
            if (obj !== this && obj.willIntersect(this.newX, this.y - 1, this.hitboxWidth, this.hitboxHeight) && obj.solid) {
                this.xBlocker = obj;
                return false;
            }
        }
        return true;
    }

    canMoveY() {
        for (const obj of this.scene.objects) {
            if (obj !== this && obj.willIntersect(this.x, this.newY, this.hitboxWidth, this.hitboxHeight) && obj.solid) {
                this.yBlocker = obj;
                return false;
            }
        }
        return true;
    }
    
    reduceVelocityOverTime(deltaTime, reductionRate){
        this.velX *= 1 - (reductionRate * deltaTime);
        // We only need to reduce the y velocity if gravity isn't doing it for us (we can also reuse this for water)
        if(!this.useGravity || this.onWater) this.velY *= 1 - (reductionRate/3 * deltaTime);

        // Terminal velocity limits
        this.velX = clamp(this.velX, -10, 10);
        this.velY = clamp(this.velY, -2, 2);
    }
        
    snapBottom(obj){
        if(obj.y === this.y + this.hitboxHeight) return;
        this.y = obj.y - this.hitboxHeight;
    }
    
    snapTop(obj){
        if(obj.y + obj.hitboxHeight === this.y) return;
        this.y = obj.y + obj.hitboxHeight;
    }

    isBelow(obj){
        return this.y + this.hitboxHeight - 1< obj.y;
    }

}