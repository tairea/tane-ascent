let game;

// global object where to store game options
let gameOptions = {
  // first platform vertical position. 0 = top of the screen, 1 = bottom of the screen
  firstPlatformPosition: 2 / 10,

  // game gravity, which only affects the hero
  gameGravity: 1200,

  // hero speed, in pixels per second
  heroSpeed: 300,

  // platform speed, in pixels per second
  platformSpeed: 190,

  // platform length range, in pixels
  platformLengthRange: [50, 150],

  // platform horizontal distance range from the center of the stage, in pixels
  platformHorizontalDistanceRange: [0, 250],

  // platform vertical distance range, in pixels
  platformVerticalDistanceRange: [150, 300]
};

window.onload = function () {
  // game configuration object
  let gameConfig = {
    type: Phaser.AUTO,
    backgroundColor: 0x444444,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      parent: "thegame",
      width: 540,
      height: 720,
    },
    physics: {
      default: "arcade",
      arcade: {
        gravity: {
          y: 600
        },
        debug: false
      }
    },
    scene: [Game, GameOver, YouWin]
  };
  game = new Phaser.Game(gameConfig);
  window.focus();
};
class Game extends Phaser.Scene {
  constructor() {
    super("game");
  }

  init() {
    this.lives = 3;
    this.tokenGoal = ""
  }

  preload() {
    this.load.image(
      "background",
      "https://cdn.glitch.com/e46a9959-9af7-4acd-a785-ff3bc76f44d0%2Fbg_layer1.png?v=1603605919212"
    );
    this.load.image(
      "kowhaiwhai",
      "https://cdn.glitch.com/e46a9959-9af7-4acd-a785-ff3bc76f44d0%2Fkowhaiwhai.png?v=1609392792102"
    );
    this.load.image(
      "platform",
      "https://cdn.glitch.com/e46a9959-9af7-4acd-a785-ff3bc76f44d0%2Fground_grass.png?v=1603605919474"
    );
    this.load.image(
      "carrot",
      "https://cdn.glitch.com/e46a9959-9af7-4acd-a785-ff3bc76f44d0%2Fcarrot.png?v=1603605919027"
    );

    // bee enemy
    this.load.atlasXML(
      "enemies",
      "https://cdn.glitch.com/e46a9959-9af7-4acd-a785-ff3bc76f44d0%2Fenemies.png?v=1603605920558",
      "https://cdn.glitch.com/e46a9959-9af7-4acd-a785-ff3bc76f44d0%2Fenemies.xml?v=1603606013060"
    );

    // Tāne
    this.load.image(
      "tane-stand",
      "https://cdn.glitch.com/e46a9959-9af7-4acd-a785-ff3bc76f44d0%2Ftane-back-idle.png?v=1603605920848"
    );
    this.load.image(
      "tane-jump",
      "https://cdn.glitch.com/e46a9959-9af7-4acd-a785-ff3bc76f44d0%2Ftane-back-jump.png?v=1603605921264"
    );

    // this.load.audio("jump", "assets/sfx/phaseJump1.wav");
    this.load.audio(
      "jump",
      // "https://cdn.glitch.com/e46a9959-9af7-4acd-a785-ff3bc76f44d0%2Fquake-jump.ogg?v=1603606002409"
      "https://cdn.glitch.com/e46a9959-9af7-4acd-a785-ff3bc76f44d0%2Fjump.ogg?v=1609392787230"
    );
    this.load.audio(
      "die",
      // "https://cdn.glitch.com/e46a9959-9af7-4acd-a785-ff3bc76f44d0%2Fquake-die.ogg?v=1603606001864",
      "https://cdn.glitch.com/e46a9959-9af7-4acd-a785-ff3bc76f44d0%2Fdie.ogg?v=1609392786498"
    );
    this.load.audio(
      "hurt",
      // "https://cdn.glitch.com/e46a9959-9af7-4acd-a785-ff3bc76f44d0%2Fquake-hurt.ogg?v=1603606002105"
      "https://cdn.glitch.com/e46a9959-9af7-4acd-a785-ff3bc76f44d0%2Fbad.ogg?v=1609392786467"
    );
    this.load.audio(
      "good",
      "https://cdn.glitch.com/e46a9959-9af7-4acd-a785-ff3bc76f44d0%2Fgood.ogg?v=1609392786967"
    );
    this.load.audio(
      "music",
      "https://cdn.glitch.com/e46a9959-9af7-4acd-a785-ff3bc76f44d0%2Fmusic.mp3?v=1609537055594"
    );
    this.load.audio(
      "end-music",
      "https://cdn.glitch.com/e46a9959-9af7-4acd-a785-ff3bc76f44d0%2Fgameover-music.mp3?v=1609537053554"
    );
    this.load.audio(
      "cheer",
      "https://cdn.glitch.com/e46a9959-9af7-4acd-a785-ff3bc76f44d0%2Fcheer.wav?v=1609537053752"
    );

    // token types
    this.load.image(
      "bronze-token-type",
      "https://cdn.glitch.com/e46a9959-9af7-4acd-a785-ff3bc76f44d0%2Ftane-bronze-token.png?v=1609392792814"
    );
    this.load.image(
      "silver-token-type",
      "https://cdn.glitch.com/e46a9959-9af7-4acd-a785-ff3bc76f44d0%2Ftane-silver-token.png?v=1609392788103"
    );
    this.load.image(
      "gold-token-type",
      "https://cdn.glitch.com/e46a9959-9af7-4acd-a785-ff3bc76f44d0%2Ftane-gold-token.png?v=1609392793468"
    );


    this.load.image(
      "bronze-token-overlay",
      "https://cdn.glitch.com/e46a9959-9af7-4acd-a785-ff3bc76f44d0%2Fbronze-overlay.png?v=1609392788745"
    );
    this.load.image(
      "silver-token-overlay",
      "https://cdn.glitch.com/e46a9959-9af7-4acd-a785-ff3bc76f44d0%2Fsilver-overlay.png?v=1609392792801"
    );
    this.load.image(
      "gold-token-overlay",
      "https://cdn.glitch.com/e46a9959-9af7-4acd-a785-ff3bc76f44d0%2Fgold-overlay.png?v=1609392790076"
    );
    
    
    this.load.image(
      "bronze-token-mask",
      "https://cdn.glitch.com/e46a9959-9af7-4acd-a785-ff3bc76f44d0%2Fbronze-mask.png?v=1609392788136"
    );
    this.load.image(
      "silver-token-mask",
      "https://cdn.glitch.com/e46a9959-9af7-4acd-a785-ff3bc76f44d0%2Fsilver-mask.png?v=1609392790979"
    );
    this.load.image(
      "gold-token-mask",
      "https://cdn.glitch.com/e46a9959-9af7-4acd-a785-ff3bc76f44d0%2Fgold-mask.png?v=1609392789648"
    );


    this.load.image(
      "bronze-token-tab",
      "https://cdn.glitch.com/e46a9959-9af7-4acd-a785-ff3bc76f44d0%2Fbronze-tab.png?v=1609392789209"
    );
    this.load.image(
      "silver-token-tab",
      "https://cdn.glitch.com/e46a9959-9af7-4acd-a785-ff3bc76f44d0%2Fsilver-tab.png?v=1609392791700"
    );
    this.load.image(
      "gold-token-tab",
      "https://cdn.glitch.com/e46a9959-9af7-4acd-a785-ff3bc76f44d0%2Fgold-tab.png?v=1609392790755"
    );

    // hand
    this.load.image(
      "hand",
      "https://cdn.glitch.com/e46a9959-9af7-4acd-a785-ff3bc76f44d0%2Fhand.png?v=1609392786467"
    );

    // coins
    // coins
    this.load.image("blue-coin-1","https://cdn.glitch.com/ac36cc02-7b80-46b7-9cad-fe737d8b49ab%2Fblue_coin_round_diamond_1.png");
    this.load.image("blue-coin-2","https://cdn.glitch.com/ac36cc02-7b80-46b7-9cad-fe737d8b49ab%2Fblue_coin_round_diamond_2.png");
    this.load.image("blue-coin-3","https://cdn.glitch.com/ac36cc02-7b80-46b7-9cad-fe737d8b49ab%2Fblue_coin_round_diamond_3.png");
    this.load.image("blue-coin-4","https://cdn.glitch.com/ac36cc02-7b80-46b7-9cad-fe737d8b49ab%2Fblue_coin_round_diamond_4.png");
    this.load.image("blue-coin-5","https://cdn.glitch.com/ac36cc02-7b80-46b7-9cad-fe737d8b49ab%2Fblue_coin_round_diamond_5.png");
    this.load.image("blue-coin-6","https://cdn.glitch.com/ac36cc02-7b80-46b7-9cad-fe737d8b49ab%2Fblue_coin_round_diamond_6.png");
    this.load.image("bronze-coin-1","https://cdn.glitch.com/ac36cc02-7b80-46b7-9cad-fe737d8b49ab%2Fbronze_coin_round_diamond_1.png");
    this.load.image("bronze-coin-2","https://cdn.glitch.com/ac36cc02-7b80-46b7-9cad-fe737d8b49ab%2Fbronze_coin_round_diamond_2.png");
    this.load.image("bronze-coin-3","https://cdn.glitch.com/ac36cc02-7b80-46b7-9cad-fe737d8b49ab%2Fbronze_coin_round_diamond_3.png");
    this.load.image("bronze-coin-4","https://cdn.glitch.com/ac36cc02-7b80-46b7-9cad-fe737d8b49ab%2Fbronze_coin_round_diamond_4.png");
    this.load.image("bronze-coin-5","https://cdn.glitch.com/ac36cc02-7b80-46b7-9cad-fe737d8b49ab%2Fbronze_coin_round_diamond_5.png");
    this.load.image("bronze-coin-6","https://cdn.glitch.com/ac36cc02-7b80-46b7-9cad-fe737d8b49ab%2Fbronze_coin_round_diamond_6.png");
    this.load.image("gold-coin-1","https://cdn.glitch.com/ac36cc02-7b80-46b7-9cad-fe737d8b49ab%2Fgold_coin_round_diamond_1.png");
    this.load.image("gold-coin-2","https://cdn.glitch.com/ac36cc02-7b80-46b7-9cad-fe737d8b49ab%2Fgold_coin_round_diamond_2.png");
    this.load.image("gold-coin-3","https://cdn.glitch.com/ac36cc02-7b80-46b7-9cad-fe737d8b49ab%2Fgold_coin_round_diamond_3.png");
    this.load.image("gold-coin-4","https://cdn.glitch.com/ac36cc02-7b80-46b7-9cad-fe737d8b49ab%2Fgold_coin_round_diamond_4.png");
    this.load.image("gold-coin-5","https://cdn.glitch.com/ac36cc02-7b80-46b7-9cad-fe737d8b49ab%2Fgold_coin_round_diamond_5.png");
    this.load.image("gold-coin-6","https://cdn.glitch.com/ac36cc02-7b80-46b7-9cad-fe737d8b49ab%2Fgold_coin_round_diamond_6.png");
    this.load.image("silver-coin-1","https://cdn.glitch.com/ac36cc02-7b80-46b7-9cad-fe737d8b49ab%2Fsilver_coin_round_diamond_1.png");
    this.load.image("silver-coin-2","https://cdn.glitch.com/ac36cc02-7b80-46b7-9cad-fe737d8b49ab%2Fsilver_coin_round_diamond_2.png");
    this.load.image("silver-coin-3","https://cdn.glitch.com/ac36cc02-7b80-46b7-9cad-fe737d8b49ab%2Fsilver_coin_round_diamond_3.png");
    this.load.image("silver-coin-4","https://cdn.glitch.com/ac36cc02-7b80-46b7-9cad-fe737d8b49ab%2Fsilver_coin_round_diamond_4.png");
    this.load.image("silver-coin-5","https://cdn.glitch.com/ac36cc02-7b80-46b7-9cad-fe737d8b49ab%2Fsilver_coin_round_diamond_5.png");
    this.load.image("silver-coin-6","https://cdn.glitch.com/ac36cc02-7b80-46b7-9cad-fe737d8b49ab%2Fsilver_coin_round_diamond_6.png");

    this.cursors = this.input.keyboard.createCursorKeys();

    //  Load the Google WebFont Loader script
    this.load.script(
      "webfont",
      "//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js"
    );
    
    // rexUI plugin
    this.load.scenePlugin(
      "rexuiplugin",
      "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js",
      "rexUI",
      "rexUI"
    );
  }

  create() {
    this.sound.stopAll()
    // load song
    const musicConfig = {
      volume: 0.5,
      loop: true,
      delay: 3000
    }
    this.music = this.sound.add("music", musicConfig);
    this.music.play();
    
    // load google font
    WebFont.load({
      google: {
        families: ["Freckle Face", "Finger Paint", "Nosifer"]
      },
      active: () => {
        this.livesText = this.add
          .text(game.config.width / 2, 50, "Lives: " + this.lives, {
            fontFamily: "Freckle Face",
            fontSize: 50,
            color: "#ffffff"
          })
          .setShadow(2, 2, "#333333", 2, false, true);
        this.livesText.setAlign("center");
        this.livesText.setOrigin();
        this.livesText.setScrollFactor(0)

      }
    });

    this.add.image(240, 320, "background").setScrollFactor(1, 0);
    this.add.tileSprite(game.config.width/2, game.config.height/2, game.config.width, 3000, "kowhaiwhai").setScrollFactor(0, 0.25).setAlpha(0.2).setScale(1);

    // token types
  // this.add.image(game.config.width - 60, 50, "bronze-token-type").setScrollFactor(0).setScale(0.2).setDepth(100)
    // this.add.image(game.config.width - 60, 150, "silver-token-type").setScrollFactor(0).setScale(0.2).setDepth(100)
    // this.add.image(game.config.width - 60, 250, "gold-token-type").setScrollFactor(0).setScale(0.2).setDepth(100)

    // ========== TOKEN METERS
    // Bronze token type
    // the token container. A simple sprite
    let tokenBronze = this.add
      .sprite(game.config.width - 60, 50, "bronze-token-type")
      .setScrollFactor(0).setScale(0.2).setDepth(100)
    // the energy bar. Another simple sprite
    this.tokenBronzeBar = this.add
      .sprite(
        tokenBronze.x, tokenBronze.y+ 75, "bronze-token-overlay"
      )
      .setScrollFactor(0).setScale(0.2).setDepth(100)
    // a copy of the energy bar to be used as a mask. Another simple sprite but...
    //energybar width is 500px (at 0.2 scale energybar width is 100px)
    this.tokenBronzeMask = this.add
      .sprite(tokenBronze.x,  tokenBronze.y, "bronze-token-mask")
      .setScrollFactor(0).setScale(0.2).setDepth(100)
    this.tokenBronzeMask.visible = true;
    // and we assign it as energyBar's mask.
    this.tokenBronzeBar.mask = new Phaser.Display.Masks.BitmapMask(
      this,
      this.tokenBronzeMask
    );
    // create a group for the gold tab
    this.tokenBronzeTabGroup = this.add.group()
    this.tokenBronzeTab = this.add.sprite(game.config.width - 110, 50, "bronze-token-tab").setScrollFactor(0).setScale(0.2).setDepth(99)
    this.tokenBronzeHand = this.add.sprite(game.config.width - 130, 50, "hand").setScrollFactor(0).setScale(0.12).setDepth(99)
    this.tokenBronzeTabGroup.addMultiple([this.tokenBronzeTab, this.tokenBronzeHand])
    // hand animation
    this.tweens.add({
      targets: this.tokenBronzeHand,
      x: game.config.width - 125,
      duration: 500,
      ease: 'Back.easeIn ',
      yoyo: true,
      loop: -1
    });
    this.tokenBronzeTabGroup.toggleVisible()

    // Silver token type
    let tokenSilver = this.add
      .sprite(game.config.width - 60, 150, "silver-token-type")
      .setScrollFactor(0).setScale(0.2).setDepth(100)
    this.tokenSilverBar = this.add
      .sprite(
        tokenSilver.x, tokenSilver.y+ 75, "silver-token-overlay"
      )
      .setScrollFactor(0).setScale(0.2).setDepth(100)
    this.tokenSilverMask = this.add
      .sprite(tokenSilver.x,  tokenSilver.y, "silver-token-mask")
      .setScrollFactor(0).setScale(0.2).setDepth(100)
    this.tokenSilverMask.visible = true;
    this.tokenSilverBar.mask = new Phaser.Display.Masks.BitmapMask(
      this,
      this.tokenSilverMask
    );
    // create a group for the gold tab
    this.tokenSilverTabGroup = this.add.group()
    this.tokenSilverTab = this.add.sprite(game.config.width - 110, 150, "silver-token-tab").setScrollFactor(0).setScale(0.2).setDepth(99)
    this.tokenSilverHand = this.add.sprite(game.config.width - 130, 150, "hand").setScrollFactor(0).setScale(0.12).setDepth(99)
    this.tokenSilverTabGroup.addMultiple([this.tokenSilverTab, this.tokenSilverHand])
    // hand animation
    this.tweens.add({
      targets: this.tokenSilverHand,
      x: game.config.width - 125,
      duration: 500,
      ease: 'Back.easeIn ',
      yoyo: true,
      loop: -1
    });
    this.tokenSilverTabGroup.toggleVisible()

    // Gold token type
    let tokenGold = this.add
      .sprite(game.config.width - 60, 250, "gold-token-type")
      .setScrollFactor(0).setScale(0.2).setDepth(100)
    this.tokenGoldBar = this.add
      .sprite(
        tokenGold.x, tokenGold.y+ 75, "gold-token-overlay"
      )
      .setScrollFactor(0).setScale(0.2).setDepth(100)
    this.tokenGoldMask = this.add
      .sprite(tokenGold.x,  tokenGold.y, "gold-token-mask")
      .setScrollFactor(0).setScale(0.2).setDepth(100)
    this.tokenGoldMask.visible = true;
    this.tokenGoldBar.mask = new Phaser.Display.Masks.BitmapMask(
      this,
      this.tokenGoldMask
    );
    // create a group for the gold tab
    this.tokenGoldTabGroup = this.add.group()
    this.tokenGoldTab = this.add.sprite(game.config.width - 110, 250, "gold-token-tab").setScrollFactor(0).setScale(0.2).setDepth(99)
    this.tokenGoldHand = this.add.sprite(game.config.width - 130, 250, "hand").setScrollFactor(0).setScale(0.12).setDepth(99)
    this.tokenGoldTabGroup.addMultiple([this.tokenGoldTab, this.tokenGoldHand])
    // hand animation
    this.tweens.add({
      targets: this.tokenGoldHand,
      x: game.config.width - 125,
      duration: 500,
      ease: 'Back.easeIn ',
      yoyo: true,
      loop: -1
    });
    this.tokenGoldTabGroup.toggleVisible()

    // decide which token is the goal
    this.getTokenGoal = function() {
      const random = Phaser.Math.Between(1, 3);
      switch(random) {
        case 1:
          this.tokenGoal = "gold"
          this.tokenGoldTabGroup.toggleVisible()
          break;
        case 2:
          this.tokenGoal = "silver"
          this.tokenSilverTabGroup.toggleVisible()
          break;
        case 3:
          this.tokenGoal = "bronze"
          this.tokenBronzeTabGroup.toggleVisible()
          break;
        default:
          this.tokenGoal = "gold"        
          this.tokenGoldTabGroup.toggleVisible()
      }
    }
    this.getTokenGoal()
    console.log("token goal is:",this.tokenGoal)


    this.platforms = this.physics.add.staticGroup();

    let firstPlatform = true;

    // then create 5 platforms from the group
    for (let i = 0; i < 5; ++i) {
      
      let x = Phaser.Math.Between(80, 400);
      const y = 150 * i;

      // make sure first platform is below tane
      if (i == 4 && firstPlatform == true) {
        firstPlatform = false;
        // middle of screen(ish)
        x = game.config.width / 2 - 40
      }
      
      /** @type {Phaser.Physics.Arcade.Sprite} */
      const platform = this.platforms.create(x, y, "platform");
      platform.scale = 0.2;

      /** @type {Phaser.Physics.Arcade.StaticBody} */
      const body = platform.body;
      body.updateFromGameObject();
    }

    this.player = this.physics.add
      .sprite(240, 320, "tane-stand")
      .setScale(0.08);

    this.player.body.setSize(50, 1500).setOffset(850, 100);

    this.physics.add.collider(this.platforms, this.player);

    // this.startPlatform = this.platforms.create(this.player.x, this.player.y + 120, "platform").setScale(0.2);
    // const body = this.startPlatform.body;
    // body.updateFromGameObject() ;

    this.player.body.checkCollision.up = false;
    this.player.body.checkCollision.left = false;
    this.player.body.checkCollision.right = false;

    this.cameras.main.startFollow(this.player);
    this.cameras.main.setDeadzone(this.scale.width * 1.5);

    this.tokens = this.physics.add.group({
      classType: Carrot
    });

    // Animations
    this.anims.create({
      key: "bee",
      frames: [{
          key: "enemies",
          frame: "bee.png"
        },
        {
          key: "enemies",
          frame: "bee_fly.png"
        }
      ],
      frameRate: 8,
      repeat: -1
    });
    //coins anims
    this.anims.create({
      key: "blueCoin",
      frames: [
        {key:"blue-coin-1",frame:0},
        {key:"blue-coin-2",frame:0},
        {key:"blue-coin-3",frame:0},
        {key:"blue-coin-4",frame:0},
        {key:"blue-coin-5",frame:0},
        {key:"blue-coin-6",frame:0},
        ],
      frameRate: 12,
      repeat: -1
    });
    this.anims.create({
      key: "goldCoin",
      frames: [
        {key:"gold-coin-1",frame:0},
        {key:"gold-coin-2",frame:0},
        {key:"gold-coin-3",frame:0},
        {key:"gold-coin-4",frame:0},
        {key:"gold-coin-5",frame:0},
        {key:"gold-coin-6",frame:0},
        ],
      frameRate: 12,
      repeat: -1
    });
    this.anims.create({
      key: "silverCoin",
      frames: [
        {key:"silver-coin-1",frame:0},
        {key:"silver-coin-2",frame:0},
        {key:"silver-coin-3",frame:0},
        {key:"silver-coin-4",frame:0},
        {key:"silver-coin-5",frame:0},
        {key:"silver-coin-6",frame:0},
        ],
      frameRate: 12,
      repeat: -1
    });
    this.anims.create({
      key: "bronzeCoin",
      frames: [
        {key:"bronze-coin-1",frame:0},
        {key:"bronze-coin-2",frame:0},
        {key:"bronze-coin-3",frame:0},
        {key:"bronze-coin-4",frame:0},
        {key:"bronze-coin-5",frame:0},
        {key:"bronze-coin-6",frame:0},
        ],
      frameRate: 12,
      repeat: -1
    });

    this.physics.add.collider(this.platforms, this.tokens);
    this.physics.add.overlap(
      this.player,
      this.tokens,
      this.handleCollectToken,
      undefined,
      this
    );
 
  }

  update(t, dt) {
    if (!this.player) {
      return;
    }

    this.platforms.children.iterate(child => {
      /** @type {Phaser.Physics.Arcade.Sprite} */
      const platform = child;

      // add new platforms above once platforms disappear below bottom line.
      const scrollY = this.cameras.main.scrollY;
      if (platform.y >= scrollY + 750) { // if platform is 750 below current scrollY
        platform.y = scrollY - Phaser.Math.Between(50, 100); // random new y position relative to scrollY
        platform.x = Phaser.Math.Between(0, game.config.width); // random new x position
        platform.body.updateFromGameObject(); // update position
        this.addCarrotAbove(platform); // add carrot/token
      }
    });

    const touchingDown = this.player.body.touching.down;

    if (touchingDown) {
      this.player.setVelocityY(-610);
      this.player.setTexture("tane-jump");

      // testing token meters
      // this.tokenBronzeBar.y -= 5
      // this.tokenGoldBar.y -= 5
      // this.tokenSilverBar.y -= 5
      // console.log("bronze.Y:",this.tokenBronzeBar.y,"Gold.Y:",this.tokenGoldBar.y,"Silver.Y:",this.tokenSilverBar.y,)

      this.sound.play("jump"); 
    }

    const vy = this.player.body.velocity.y;
    if (vy > 0 && this.player.texture.key !== "tane-stand") {
      this.player.setTexture("tane-stand");
    }

    if (this.cursors.left.isDown && !touchingDown) {
      this.player.setVelocityX(-200);
    } else if (this.cursors.right.isDown && !touchingDown) {
      this.player.setVelocityX(200);
    } else {
      this.player.setVelocityX(0);
    }

    this.horizontalWrap(this.player);

    const bottomPlatform = this.findBottomMostPlatform();
    if (this.player.y > bottomPlatform.y + 200) {
      this.scene.start("game-over");
      this.sound.play("die");
    }
  }

  /**
   *
   * @param {Phaser.GameObjects.Sprite} sprite
   */
  horizontalWrap(sprite) {
    const halfWidth = sprite.displayWidth * 0.5;
    const gameWidth = this.scale.width;
    if (sprite.x < -halfWidth) {
      sprite.x = gameWidth + halfWidth;
    } else if (sprite.x > gameWidth + halfWidth) {
      sprite.x = -halfWidth;
    }
  }

  /**
   *
   * @param {Phaser.GameObjects.Sprite} sprite
   */
  addCarrotAbove(sprite) {
    // set token y position
    // const y = sprite.y - sprite.displayHeight;
    const y = sprite.y;
    // get random number to determine which token to randomly place
    const random = Phaser.Math.Between(1, 3);

    switch(random) {
        case 1:
        const goldToken = this.tokens.get(sprite.x, y, "gold-coin-1");
        goldToken.setActive(true);
        goldToken.setVisible(true);
        this.add.existing(goldToken);
        goldToken.body.setSize(goldToken.width, goldToken.height);
        goldToken.play("goldCoin", true);
        this.physics.world.enable(goldToken);
        return goldToken;
        break;
      case 2:
        const silverToken = this.tokens.get(sprite.x, y, "silver-coin-1");
        silverToken.setActive(true);
        silverToken.setVisible(true);
        this.add.existing(silverToken);
        silverToken.body.setSize(silverToken.width, silverToken.height);
        silverToken.play("silverCoin", true);
        this.physics.world.enable(silverToken);
        return silverToken;
        break;
      case 3:
        const bronzeToken = this.tokens.get(sprite.x, y, "bronze-coin-1");
        bronzeToken.setActive(true);
        bronzeToken.setVisible(true);
        this.add.existing(bronzeToken);
        bronzeToken.body.setSize(bronzeToken.width, bronzeToken.height);
        bronzeToken.play("bronzeCoin", true);
        this.physics.world.enable(bronzeToken);
        return bronzeToken;
        break;
      default:
        return
    }
  }

  /**
   *
   * @param {Phaser.Physics.Arcade.Sprite} player
   * @param {Carrot} carrot
   */
  handleCollectToken(player, token) {
    if (this.lives <= 1) {
      this.scene.start("game-over");
      this.sound.play("die");
    }

    // remove touched token
    this.tokens.killAndHide(token);
    this.physics.world.disableBody(token.body);

    // get token type
    const tokenGot = token.texture.key.split("-")[0]
    console.log("target:",this.tokenGoal,"got:",tokenGot)

    // take action depending on which token touched
    if (tokenGot == this.tokenGoal) {
      this.sound.play("good"); 
      if (this.tokenGoal == "gold") {
        // TODO: increase gold token type
        if (this.tokenGoldBar.y == 250) {
          console.log("YOU WIN")
          this.scene.start("you-win");
        } else {
          this.tokenGoldBar.y -= 5
        }
      } else if (this.tokenGoal == "silver") {
        if (this.tokenSilverBar.y == 150) {
          console.log("YOU WIN")
          this.scene.start("you-win");
        } else {
          this.tokenSilverBar.y -= 5
        }
      } else if (this.tokenGoal == "bronze") {
        if (this.tokenBronzeBar.y == 50) {
          console.log("YOU WIN")
          this.scene.start("you-win");
        } else {
          this.tokenBronzeBar.y -= 5
        }
      }
    } else {
      this.lives--;
      this.sound.play("hurt");
      this.livesText.setText(`Lives: ${this.lives}`);
    }


   

    
  }

  findBottomMostPlatform() {
    const platforms = this.platforms.getChildren();
    let bottomPlatform = platforms[0];

    for (let i = 1; i < platforms.length; ++i) {
      const platform = platforms[i];

      // discard any platforms that are above current
      if (platform.y < bottomPlatform.y) {
        continue;
      }

      bottomPlatform = platform;
    }

    return bottomPlatform;
  }
}

class GameOver extends Phaser.Scene {
  constructor() {
    super("game-over");
  }

  create() {
    this.sound.stopAll()
      // load song
      const musicConfig = {
        volume: 0.5,
        loop: true,
        delay: 3000
      }
      this.endMusic = this.sound.add("end-music", musicConfig);
      this.endMusic.play();
    
    const width = this.scale.width;
    const height = this.scale.height;

    this.add.tileSprite(game.config.width/2, game.config.height/2 + 500, game.config.width, 3000, "kowhaiwhai").setScrollFactor(0, 0.25).setAlpha(0.2).setScale(1);

    WebFont.load({
      google: {
        families: ["Freckle Face", "Finger Paint", "Nosifer"]
      },
      active: () => {

        this.gameOver = this.add
          .text(game.config.width / 2, game.config.height / 2 - 100, "Game Over", {
            fontFamily: "Freckle Face",
            fontSize:  50,
            color: "#ffffff"
          })
          .setShadow(2, 2, "#333333", 2, false, true);
        this.gameOver.setAlign("center");
        this.gameOver.setOrigin();
        this.gameOver.setScrollFactor(0)

        this.pressRestart = this.add
          .text(game.config.width / 2, game.config.height / 2, "Press Space to Restart", {
            fontFamily: "Finger Paint",
            fontSize: 20,
            color: "#ffffff"
          })
          .setShadow(2, 2, "#333333", 2, false, true);
        this.pressRestart.setAlign("center");
        this.pressRestart.setOrigin();
        this.pressRestart .setScrollFactor(0)

      }
    });
    
    this.input.keyboard.once("keydown-SPACE", () => {
      this.scene.start("game");
    });
  }
}

class YouWin extends Phaser.Scene {
  constructor() {
    super("you-win");
  }

  create() {
    this.cameras.main.setBackgroundColor("#533d8e");
    
    this.sound.stopAll()
    // load song
    const musicConfig = {
      volume: 0.5,
      loop: false,
      delay: 3000
    }
    this.cheer = this.sound.add("cheer", musicConfig);
    this.cheer.play();

    const width = this.scale.width;
    const height = this.scale.height;

    this.add.tileSprite(game.config.width/2, game.config.height/2 + 500, game.config.width, 3000, "kowhaiwhai").setScrollFactor(0, 0.25).setAlpha(0.2).setScale(1);

    WebFont.load({
      google: {
        families: ["Freckle Face", "Finger Paint", "Nosifer"]
      },
      active: () => {

        this.gameOver = this.add
          .text(game.config.width / 2, game.config.height / 2 - 100, "You Win!", {
            fontFamily: "Freckle Face",
            fontSize:  50,
            color: "#ffffff"
          })
          .setShadow(2, 2, "#333333", 2, false, true);
        this.gameOver.setAlign("center");
        this.gameOver.setOrigin();
        this.gameOver.setScrollFactor(0)

        this.add.text(game.config.width / 2, game.config.height / 2, "Tino pai to mahi.", {
            fontFamily: "Finger Paint",
            fontSize: 20,
            color: "#ffffff"
          })
          .setShadow(2, 2, "#333333", 2, false, true)
          .setAlign("center")
          .setOrigin()
          .setScrollFactor(0)
        this.add.text(game.config.width / 2, game.config.height / 2 + 100, "You collected all the actions\n to complete this moemoeā.", {
            fontFamily: "Finger Paint",
            fontSize: 20,
            color: "#ffffff"
          })
          .setShadow(2, 2, "#333333", 2, false, true)
          .setAlign("center")
          .setOrigin()
          .setScrollFactor(0)

      }
    });

    this.input.keyboard.once("keydown-SPACE", () => {
      this.scene.start("game");
    });
  }
}

class Carrot extends Phaser.Physics.Arcade.Sprite {
  /**
   * @param {Phaser.Scene} scene
   * @param {number} x
   * @param {number} y
   * @param {string} texture
   */
  constructor(scene, x, y, texture = "carrot") {
    super(scene, x, y, texture);

    this.setScale(0.5);
  }
}