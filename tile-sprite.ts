namespace SpriteKind {
    export const TowerTile = create()
}

enum TileType {
    Cloud,
    Stone,
    Box
}
//% block="Tower" weight=100 color=#0fbc11 icon=""
namespace tower {

    interface TileSpriteData {
        undamagedImage: Image;
        damagedImage: Image;
        isOneWay: boolean;
        hp: number;
        instantBreak: boolean;
    }

    interface TileSpriteDataMap {
        [key: number]: TileSpriteData;
    }

    export const tileSpriteDataMap: TileSpriteDataMap = {
        [TileType.Cloud]: {
            undamagedImage: assets.image`cloudTile`,
            damagedImage: assets.image`cloudTile`,
            isOneWay: true,
            hp: 200,
            instantBreak: true
        },
        [TileType.Stone]: {
            undamagedImage: assets.image`stoneTile`,
            damagedImage: assets.image`stoneTileDamaged`,
            isOneWay: false,
            hp: 1000,
            instantBreak: false
        },
        [TileType.Box]: {
            undamagedImage: assets.image`boxTile`,
            damagedImage: assets.image`boxTileDamaged`,
            isOneWay: false,
            hp: 333,
            instantBreak: false
        }
    }


    /**
     * Gets the image associated with a certain tile type and damaged status
     */
    //% block
    export function getTileSpriteImage(tileType: TileType, damaged: boolean = false): Image {
        return tileSpriteDataMap[tileType][damaged ? "damagedImage" : "undamagedImage"];

    }

    /**
     * Creates a tower tile sprite
     */
    //% block
    export function createTileSprite(tileType: TileType, location: tiles.Location) {
        return new TileSprite(tileType, location);
    }

    /** 
     * Moves a tile sprite to a new location
     */
    //% block
    export function moveTileSprite(sprite: TileSprite, location: tiles.Location) {
        sprite.placeOnTile(location)
    }

    /**
     * Shifts a tile sprite down a floor; used when advancing upwards
     */
    //% block
    export function shiftTileSpriteDown(sprite: TileSprite) {
        const oldLocation = sprite.tilemapLocation();
        const newLocation = tiles.getTileLocation(oldLocation.col, oldLocation.row + 8);
        moveTileSprite(sprite, newLocation);
    }

    enum TileFlags {
        Damaged = 1,
        OneWay = 1 << 1,
        Destroyed = 1 << 2,
        JustMoved = 1 << 3
    }

    export class TileSprite extends sprites.ExtendableSprite {
        tileFlags: number = 0;
        

        constructor(public tileType: TileType, location: tiles.Location) {
            super(getTileSpriteImage(tileType), SpriteKind.TowerTile);
            this.flags |= SpriteFlag.GhostThroughWalls | SpriteFlag.GhostThroughTiles;
        
            this.onDestroyed(() => {
                this.tileFlags |= TileFlags.Destroyed;
                //playerSprite.sayText("adios", 100)
                tiles.setWallAt(this.tilemapLocation(), false)
            })

            tiles.placeOnTile(this, location)

            if (tileSpriteDataMap[tileType].isOneWay) 
                this.tileFlags |= TileFlags.OneWay;
            else
                tiles.setWallAt(location, true)
            
        }


        // moves the sprite to a new tile and disables the wall at the old tile
        placeOnTile(location: tiles.Location) {
            tiles.setWallAt(this.tilemapLocation(), false)
            tiles.placeOnTile(this, location)
            this.tileFlags |= TileFlags.JustMoved;
            //if ((this.tileFlags & TileFlags.OneWay) == 0)
            //    tiles.setWallAt(location, true)
        }
        

        private startDamage() {
            if(this.tileFlags & TileFlags.Damaged) return;
            this.tileFlags |= TileFlags.Damaged;
            this.setImage(getTileSpriteImage(this.tileType, true));
            this.lifespan = tileSpriteDataMap[this.tileType].hp;
        }

        update(deltaTimeMillis: number) {
            if (this.tileFlags & TileFlags.Destroyed) return;
            if (this.bottom > scene.cameraProperty(CameraProperty.Bottom) - 4) {
                sprites.destroy(this)
                tiles.setWallAt(this.tilemapLocation(), false)
                return;
            }

            // set wall after moving
            if (this.tileFlags & TileFlags.JustMoved) {
                this.tileFlags &= ~TileFlags.JustMoved;
                if((this.tileFlags & TileFlags.OneWay) == 0)
                    tiles.setWallAt(this.tilemapLocation(), true)
            }

            // manage one way wall collisions
            if (this.tileFlags & TileFlags.OneWay){
                if (playerSprite.bottom - .5 <= this.top) {
                    tiles.setWallAt(this.tilemapLocation(), true)
                } else {
                    tiles.setWallAt(this.tilemapLocation(), false)
                }
            }
        }

        stepOn() {
            this.startDamage();
        }

        /**
         * Returns true if the bullet should be destroyed
         * @param damageAmount The amount of damage the bullet should do
         */
        shoot(damageAmount: number = 500): boolean {
            if(tileSpriteDataMap[this.tileType].instantBreak) {
                this.destroy();
                return false;
            } else if((this.tileFlags & TileFlags.Damaged) == 0) {
                this.startDamage();
            } else {
                this.lifespan -= damageAmount;
            }
            return true;
        }
    }
}