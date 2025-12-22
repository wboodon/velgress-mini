# Velgress Mini 
> A recreation of Velgress from UFO 50 for MakeCode Arcade!
> Open this page at [https://wboodon.github.io/velgress-mini/](https://wboodon.github.io/velgress-mini/)

## Milestones for 1.0.0
Once all these changes are made, it'll be version 1.0.0

### Major Additions
- Combat
    - Enemy behavior
    - Enemy spawning
    - Stun animation
    - Enemy animations
    - Bounce on enemy's head
    - Enemies destroyed by spike
- Score
    - Coin spawning
    - Coin animation
    - Score system
    - Coin tiles
- Add random tiles
    - Hold jump on jump tile to blitz through level
    - ~~Stone, coin, and jump tiles can replace cloud tiles randomly~~
- Sound effects
    - Shoot
    - Double jump
    - Tiles destroyed by spike
    - Enemy destroyed
    - Coin collected
    - Jump tile
    - Bouncing on enemy's head
- UI/UX Overhaul
    - Start menu
    - Optional tutorial/instructions
    - Better game over screen

### Minor Additions
- Double jump animation
- Hold jump
- Cloud animations
- High score mechanic
- Spike sprite/animation
- Particles for tile destruction
- Better looking floor markers

### Fixes
- Clouds are sometimes destroyed when you jump off the tile below them
- Tile destruction isn't started if you're standing on its edge
- Adjust random tile generation to better match the game
- Z-sorting issues
    - Tile sprites render in front of player
    - Tile sprites render in front of floor markers
- The tiles at the start of the level are ugly


## Use as Extension

This repository can be added as an **extension** in MakeCode.

* open [https://arcade.makecode.com/](https://arcade.makecode.com/)
* click on **New Project**
* click on **Extensions** under the gearwheel menu
* search for **https://github.com/wboodon/velgress-mini** and import

## Edit this project

To edit this repository in MakeCode.

* open [https://arcade.makecode.com/](https://arcade.makecode.com/)
* click on **Import** then click on **Import URL**
* paste **https://github.com/wboodon/velgress-mini** and click import

#### Metadata (used for search, rendering)

* for PXT/arcade
<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>
