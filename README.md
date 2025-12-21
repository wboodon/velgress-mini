# Velgress Mini 
> A recreation of Velgress from UFO 50 for MakeCode Arcade!
> Open this page at [https://wboodon.github.io/velgress-mini/](https://wboodon.github.io/velgress-mini/)

## Milestones for 1.0.0
Once all these changes are made, it'll be version 1.0.0

### Major Additions
 - Add enemies
    - Enemy spawning
    - Stun animation
    - Enemy animations
    - Bounce on enemy's head
    - Enemies destroyed by spike
 - Add coins
    - Coin spawning
    - Score system
 - Add random jump block, coin block, stone blocks
    - Replace cloud blocks?
    - Hold jump on jump block to blitz through level
 - Sound effects
    - Shoot
    - Double jump
    - Blocks destroyed by spike
    - Enemy destroyed
    - Coin collected
    - Jump block
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
- Particles for block destruction

### Fixes
- Clouds are sometimes destroyed when you jump off the block below them
- Block destruction isn't started if you're standing on its edge
- Adjust random block generation to better match the game


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
