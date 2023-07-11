export class Transform {
    constructor(opt, scene) {
        // Position in the scene, in pixel coordinates
        this.x = opt.x || 0;
        this.y = opt.y || 0;
        
        // Visual size
        this.width = opt.width || 48;
        this.height = opt.height || 48;

        // Hitbox size used for physics (will be rendered centered width, bottom height)
        this.hitboxWidth = this.width;
        this.hitboxHeight = this.height;

        // Clone the visual and hitbox size (disable to change the hitbox size independently)
        this.accurateHitbox = opt.accurateHitbox || true;
        
        // Whether the hitbox height should be centered (for objects) or at the bottom (for players)
        this.bottomHitbox = opt.bottomHitbox || false;

        // Whether this object's update should be called multiple times per frame (used for physics)
        this.needsSubstep = opt.needsSubstep || false;

        // Whether this object can always be placed on top of other objects
        this.overlay = opt.overlay || false;

        // Whether physics and the player can pass through this object (but it can't through others)
        this.solid = opt.solid || false;

        // Whether this object should ignore all intersects (used for UI like the object placer)
        this.ignoreIntersects = opt.ignoreIntersects || false;

        // Internal object used for ladders to pause player gravity
        this.isLadder = opt.isLadder || false;

        // Draw a debug overlay showing the object's actual hitbox
        this.debugHitbox = opt.debugHitbox || false;

        // Print the object's position to console every frame
        this.debugPos = opt.debugPos || false;

        // The scene this object belongs to
        this.scene = scene;

        // Whether to render the object
        this.hidden = false;
    }
    draw(ctx){
        // stub
    }
    update(deltaTime){
        if(this.accurateHitbox){
            this.hitboxWidth = this.width;
            this.hitboxHeight = this.height;
        }
        if(this.debugPos) console.log(this.x, this.y)
    }
    altclick(){
        // debug feature: log block to console
        console.log(this);
    }
    intersects(other){
        if(this.ignoreIntersects) return false;

        return (
            this.x <= other.x + other.hitboxWidth &&
            this.x + this.hitboxWidth >= other.x &&
            this.y <= other.y + other.hitboxHeight &&
            this.y + this.hitboxHeight >= other.y
        );
    }
    inside(other){
        if(this.ignoreIntersects) return false;

        return (
            (this.x+1) <= other.x + other.hitboxWidth &&
            (this.x+1) + (this.hitboxWidth-2) >= other.x &&
            (this.y+1) <= other.y + other.hitboxHeight &&
            (this.y+1) + (this.hitboxHeight-2) >= other.y
        );
    }
    willIntersect(x, y, width, height){
        if(this.ignoreIntersects) return false;

        return (
            this.x <= x + width &&
            this.x + this.hitboxWidth >= x &&
            this.y <= y + height &&
            this.y + this.hitboxHeight >= y
        );
    }
    willBeInside(x, y, width, height){
        if(this.ignoreIntersects) return false;
        return (
            (this.x+1) <= x + width &&
            (this.x+1) + (this.hitboxWidth-2) >= x &&
            (this.y+1) <= y + height &&
            (this.y+1) + (this.hitboxHeight-2) >= y
        );
    }
    // This used to be a hack for ladders but may be useful in the future
    /*isIntersectTop(other){
        if(this.ignoreIntersects) return false;
    
        let otherWidth = other.hitboxWidth
        let otherHeight = other.hitboxHeight
    
        // Check if the other object intersects with the top half of this object
        return (
            this.x <= other.x + otherWidth &&
            this.x + this.hitboxWidth >= other.x &&
            this.y <= other.y + otherHeight &&
            other.y + otherHeight <= this.y + this.hitboxHeight / 2
        );
    }*/
    
}
