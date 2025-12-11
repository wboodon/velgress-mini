namespace SpriteKind {
    export const CameraTarget = SpriteKind.create()
    export const Cloud = SpriteKind.create()
    export const Spikes = SpriteKind.create()
    export const FloorLabel = SpriteKind.create()
    export const FloorDetector = SpriteKind.create()
}
scene.onHitWall(SpriteKind.Player, function (sprite, location) {
    if(!(sprite instanceof tower.PlayerSprite)) return;

    if(!controller.A.isPressed()) return;

    const playerLocation = sprite.tilemapLocation()
    // 
    if(playerLocation.row == location.row + 1
        && playerLocation.col != location.col 
        && !tiles.tileAtLocationIsWall(tiles.getTileLocation(playerLocation.col, location.row))) {
        
        tiles.placeOnTile(sprite, playerLocation)
        sprite.vy = sprite.lastVy;
    }
})
sprites.onOverlap(SpriteKind.FloorDetector, SpriteKind.TowerTile, function (sprite, otherSprite) {
    if (sprite instanceof tower.FloorDetectorSprite && otherSprite instanceof tower.TileSprite) {
        if (sprite.parent.isHittingTile(CollisionDirection.Bottom)) {
            otherSprite.stepOn();
        }
    }
})
function makeFloor (floorNum: number) {
    offsetY = floorNum == 1 ? 16 : (floorNum == 2 ? 8 : 0);
    layout = randint(0, 4)
    switch(layout) {
        case 0: break;
    }
    let column, row;
for (let index = 0; index < 10; index++) {
        column = randint(1, 9)
        row = randint(0, 7) + offsetY
        cloud = tower.createTileSprite(TileType.Cloud, tiles.getTileLocation(column, row))
    }
    // right side
    for (let index = 0; index < 5; index++) {
        column = randint(10, 18)
        row = randint(0, 7) + offsetY
        cloud = tower.createTileSprite(TileType.Cloud, tiles.getTileLocation(column, row))
    }
    for (let column = 10; column < 19; column++) {
        let box = tower.createTileSprite(
            TileType.Box,
            tiles.getTileLocation(column, 2 + offsetY)
        )
    }
    cloud = tower.createTileSprite(
        TileType.Cloud,
        tiles.getTileLocation(13, 5 + offsetY)
    )
    let stone = tower.createTileSprite(
        TileType.Stone,
        tiles.getTileLocation(14, 5 + offsetY)
    )
    stone = tower.createTileSprite(
        TileType.Stone,
        tiles.getTileLocation(15, 5 + offsetY)
    )
    cloud = tower.createTileSprite(
        TileType.Cloud,
        tiles.getTileLocation(16, 5 + offsetY)
    )

}
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.TowerTile, function (sprite, otherSprite) {
    if (otherSprite instanceof tower.TileSprite) {
        const ts = otherSprite as tower.TileSprite;
if (ts.shoot()) {
            sprites.destroy(sprite)
        }
    }
})
// Camera movement
scene.onHitWall(SpriteKind.Projectile, function (sprite, location) {
    if (tiles.tileAtLocationEquals(location, assets.tile`breakableTile`)) {
        tiles.setTileAt(location, assets.tile`bgTile1`)
        tiles.setWallAt(location, false)
    }
})
let cloud: tower.TileSprite = null
let layout = 0
let playerSprite: tower.PlayerSprite = null
let offsetY = 0
let textSprite = null
scene.setBackgroundColor(15)
let layoutTypes = ["sparseClouds", "boxLine"]
let tilemap1 = tileUtil.createSmallMap(tilemap`level0`)
tiles.setCurrentTilemap(tilemap1)
let floorLabel1 = textsprite.create("3", 7, 1)
floorLabel1.setMaxFontHeight(5)
// playerSprite.scale = 0.5;
tiles.placeOnTile(floorLabel1, tiles.getTileLocation(0, 0))
let floorLabel2 = textsprite.create("2", 7, 1)
floorLabel2.setMaxFontHeight(5)
// playerSprite.scale = 0.5;
tiles.placeOnTile(floorLabel2, tiles.getTileLocation(0, 8))
let floorLabel3 = textsprite.create("1", 7, 1)
floorLabel3.setMaxFontHeight(5)
// playerSprite.scale = 0.5;
tiles.placeOnTile(floorLabel3, tiles.getTileLocation(0, 16))
playerSprite = tower.createPlayer()
// playerSprite.scale = 0.5;
tiles.placeOnTile(playerSprite, tiles.getTileLocation(1, 25))
playerSprite.onDestroyed(() => {
    let gameOver = sprites.create(assets.image`gameOver`, SpriteKind.Player)
    gameOver.flags |= SpriteFlag.RelativeToCamera | SpriteFlag.Ghost;

    controller.anyButton.onEvent(ControllerButtonEvent.Pressed, function() {
        game.reset();
    })
})
let cameraTarget = sprites.create(img`
    7 7 7 7 7 
    7 7 7 7 7 
    7 7 7 7 7 
    7 7 7 7 7 
    7 7 7 7 7 
    `, SpriteKind.CameraTarget)
scene.cameraFollowSprite(cameraTarget)
cameraTarget.flags |= SpriteFlag.Ghost | SpriteFlag.Invisible;
// cameraTarget.vy = -10
tiles.placeOnTile(cameraTarget, tiles.getTileLocation(10, 57))
let currentFloor = 2
makeFloor(1)
makeFloor(2)
makeFloor(3)
let spikes = sprites.create(assets.image`spikes`, SpriteKind.Spikes)
spikes.setFlag(SpriteFlag.RelativeToCamera, true)
spikes.y = 116
game.onUpdate(function () {
    if (playerSprite.y < cameraTarget.y) {
        cameraTarget.y = playerSprite.y
    }
    if (cameraTarget.y < 64) {
        cameraTarget.y += 64
        playerSprite.y += 64
        for (let value of sprites.allOfKind(SpriteKind.TowerTile)) {
            if (value instanceof tower.TileSprite) {
                tower.shiftTileSpriteDown(value);
            }
            
        }
        currentFloor += 1
        makeFloor(currentFloor + 1)
        floorLabel1.setText((currentFloor + 1).toString())
        floorLabel2.setText(currentFloor.toString())
        floorLabel3.setText((currentFloor - 1).toString())
    }
})
