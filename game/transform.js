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
        this.accurateHitbox = true;
        
        // Whether the hitbox height should be centered (for objects) or at the bottom (for players)
        this.bottomHitbox = false;

        // Whether this object's update should be called multiple times per frame (used for physics)
        this.needsSubstep = false;

        // Whether this object can always be placed on top of other objects
        this.overlay = false;

        // Whether physics and the player can pass through this object (but it can't through others)
        this.solid = opt.solid || false;

        // Whether this object should ignore all intersects (used for UI like the object placer)
        this.ignoreIntersects = false;

        // Internal object used for ladders to pause player gravity
        this.isLadder = false;

        // Draw a debug overlay showing the object's actual hitbox
        this.debugHitbox = false;

        // The scene this object belongs to
        this.scene = scene;
    }
    draw(ctx){
        // stub
    }
    update(deltaTime){
        if(this.accurateHitbox){
            this.hitboxWidth = this.width;
            this.hitboxHeight = this.height;
        }
    }
    altclick(){
        // debug feature: log block to console
        // @TODO: add some sort of debug mode to enable this
        console.log(this);
    }
    intersects(other){
        if(this.ignoreIntersects) return false;

        let meWidth = this.hitboxWidth
        let otherWidth = other.hitboxWidth
        let meHeight = this.hitboxHeight
        let otherHeight = other.hitboxHeight

        let meX = this.x
        let otherX = other.x

        let meY = this.y
        let otherY = other.y

        return (
            meX <= otherX + otherWidth &&
            meX + meWidth >= otherX &&
            meY <= otherY + otherHeight &&
            meY + meHeight >= otherY
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
}
