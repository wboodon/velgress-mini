
/**
* Use this file to define custom functions and blocks.
* Read more at https://arcade.makecode.com/blocks/custom
*/

enum MyEnum {
    //% block="one"
    One,
    //% block="two"
    Two
}

/**
 * Custom blocks
 */
//% block="Tower" weight=100 color=#0fbc11 icon=""
namespace tower {

    export class FloorDetectorSprite extends sprites.ExtendableSprite {
        constructor(public parent: PlayerSprite) {
            super(img`
                7 7 7 7 7 7
                7 7 7 7 7 7
            `, SpriteKind.FloorDetector)
            this.flags |= 
                SpriteFlag.Invisible | 
                SpriteFlag.GhostThroughWalls | 
                SpriteFlag.GhostThroughTiles;
        }
        
        update(deltaTimeMillis: number) {
            this.setPosition(this.parent.x, this.parent.y + 5);

        }
    }

    /**
     * Creates a player sprite
     */
    //% block
    export function createPlayer(): PlayerSprite {
        return new PlayerSprite();
    }

    const playerSpeed = 100;
    const playerGroundAcceleration = 10;
    const playerAirAcceleration = 5;
    const playerDecelerationScale = 2;
    const shootInterval = 200;
    const jumpSpeed = -150;
    const gravity = 300;
    export class PlayerSprite extends sprites.ExtendableSprite {
        directionX: number = 1;
        directionY: number = 0;

        private hitboxWidth = Fx8(8);
        private hitboxHeight = Fx8(8);
        private imageWidth = 8;
        private imageHeight = 8;

        playerNum = 1
        lastVy: number = 0
        
        constructor() {
            super(assets.image`playerRight`, SpriteKind.Player);

            //this.setDimensions(8, 8);
            this.ay = gravity;
            this.flags |= SpriteFlag.StayInScreen;
            controller.moveSprite(this, 75, 0);
            //scene.cameraFollowSprite(this)

            this.setupControls();
            this.setupAnimations();

            const floorDetector = new FloorDetectorSprite(this);

        }

        private setupAnimations(): void {
            characterAnimations.loopFrames(
                this,
                assets.animation`playerIdleRight`,
                500,
                characterAnimations.rule(Predicate.LookingForward, Predicate.FacingRight)
            )
            characterAnimations.loopFrames(
                this,
                assets.animation`playerIdleLeft`,
                500,
                characterAnimations.rule(Predicate.LookingForward, Predicate.FacingLeft)
            )
            characterAnimations.loopFrames(
                this,
                assets.animation`playerIdleRightUp`,
                200,
                characterAnimations.rule(Predicate.LookingUp, Predicate.FacingRight)
            )
            characterAnimations.loopFrames(
                this,
                assets.animation`playerIdleRightDown`,
                200,
                characterAnimations.rule(Predicate.LookingDown, Predicate.FacingRight)
            )
            characterAnimations.loopFrames(
                this,
                assets.animation`playerIdleLeftDown`,
                200,
                characterAnimations.rule(Predicate.LookingDown, Predicate.FacingLeft)
            )
            characterAnimations.loopFrames(
                this,
                assets.animation`playerIdleLeftUp`,
                200,
                characterAnimations.rule(Predicate.LookingUp, Predicate.FacingLeft)
            )
        }


        private coyoteTime = false;
        private setupControls(): void {
            controller.player1.onButtonEvent(ControllerButton.A, ControllerButtonEvent.Pressed, () => {
                if (this.coyoteTime || this.isHittingTile(CollisionDirection.Bottom)) {
                    this.coyoteTime = false;
                    this.wasOnGround = false;
                    this.vy = jumpSpeed;
                }
            })

            controller.A.onEvent(ControllerButtonEvent.Released, () => {
                if (this.vy <= 0 && !this.isHittingTile(CollisionDirection.Bottom)) {
                    this.vy = 0;
                }
            })

            /*
            controller.B.onEvent(ControllerButtonEvent.Pressed, () => {

                timer.throttle("shoot", shootInterval, () => {
                    let directionY = 0;
                    if (characterAnimations.matchesRule(this, Predicate.LookingUp)) directionY = -1;
                    if (characterAnimations.matchesRule(this, Predicate.LookingDown)) directionY = 1;
                    if (directionY) {
                        let projectile = sprites.createProjectileFromSprite(assets.image`playerBullet`, this, 0, 200 * directionY);
                        projectile.flags |= SpriteFlag.GhostThroughWalls;
                    } else {
                        let directionX = (characterAnimations.matchesRule(this, Predicate.FacingRight) ? 1 : -1);
                        let projectile = sprites.createProjectileFromSprite(assets.image`playerBullet`, this, 200 * directionX, 0);
                        projectile.flags |= SpriteFlag.GhostThroughWalls;
                    }
                })
                
            })
            */

            

        }

        private wasOnGround = false;
        update(deltaTimeMillis: number) {

            if(this.flags &= sprites.Flag.Destroyed) {
                return;
            }

            const rightPressed = controller.right.isPressed();
            const leftPressed = controller.left.isPressed();
            const upPressed = controller.up.isPressed();
            const downPressed = controller.down.isPressed();

/*
            let xAxis = controller.getXAxis(this.playerNum)
            const acceleration = (
                (this.isHittingTile(CollisionDirection.Bottom) 
                    ? playerGroundAcceleration
                    : playerAirAcceleration)
                * (xAxis
                    ? 1
                    : playerDecelerationScale)
            )
            this.vx = Math.lerp(this.vx, xAxis * playerSpeed, deltaTimeMillis * acceleration * .001, false);
*/
            if ((upPressed && downPressed) || (!upPressed && !downPressed))
                characterAnimations.setDirection(this, characterAnimations.LookingDirection.Forward)
            else if (upPressed)
                characterAnimations.setDirection(this, characterAnimations.LookingDirection.Up)
            else if (downPressed)
                characterAnimations.setDirection(this, characterAnimations.LookingDirection.Down)

            let isOnGround = this.isHittingTile(CollisionDirection.Bottom);
            if(this.wasOnGround && !isOnGround) {
                this.coyoteTime = true;

                timer.debounce("startCoyoteTime", 100, () => {
                    this.coyoteTime = false;
                })
            }

            this.wasOnGround = isOnGround;

            if (this.bottom >= scene.cameraProperty(CameraProperty.Bottom) - 4) {
                this.vy = -200;
                characterAnimations.setCharacterAnimationsEnabled(this, false);
                this.setImage(assets.image`playerDead`)
                this.destroy(effects.ashes, 1000)
            }

            if(controller.B.isPressed()) {
                timer.throttle("shoot", shootInterval, () => {
                    let directionY = 0;
                    if (characterAnimations.matchesRule(this, Predicate.LookingUp)) directionY = -1;
                    if (characterAnimations.matchesRule(this, Predicate.LookingDown)) directionY = 1;
                    let projectile;
                    if (directionY) {
                        projectile = sprites.createProjectileFromSprite(assets.image`playerBullet`, this, 0, 200 * directionY);
                    } else {
                        let directionX = (characterAnimations.matchesRule(this, Predicate.FacingRight) ? 1 : -1);
                        projectile = sprites.createProjectileFromSprite(assets.image`playerBullet`, this, 200 * directionX, 0);
                        
                    }
                    projectile.flags |= SpriteFlag.GhostThroughWalls;
                    projectile.lifespan = 500;
                })
            }
            this.lastVy = this.vy;
        }
        
        setHitbox() {
            this._hitbox = new game.Hitbox(
                this, 
                this.hitboxWidth, 
                this.hitboxHeight,
                Fx.rightShift(Fx.sub(this._width,  this.hitboxWidth), 1), 
                Fx.rightShift(Fx.sub(this._height, this.hitboxHeight), 1)
            );
        }
    }
    /**
     * TODO: describe your function here
     * @param n describe parameter here, eg: 5
     * @param s describe parameter here, eg: "Hello"
     * @param e describe parameter here
     */
    //% block
    export function bar(n: number): void {

    }
    /**
     * TODO: describe your function here
     * @param n describe parameter here, eg: 5
     * @param s describe parameter here, eg: "Hello"
     * @param e describe parameter here
     */
    //% block="Tower"
    export function foo(n: number, s: string, e: MyEnum): void {
        // Add code here
    }

    /**
     * TODO: describe your function here
     * @param value describe value here, eg: 5
     */
    //% block
    export function fib(value: number): number {
        return value <= 1 ? value : fib(value - 1) + fib(value - 2);
    }
}
