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
  platformVerticalDistanceRange: [150, 300],
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
      width: 750,
      height: 1334,
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
    scene: [Game, GameOver],
  };
  game = new Phaser.Game(gameConfig);
  window.focus();
};
class Game extends Phaser.Scene {
  constructor() {
    super("game");
  }

  init() {
    this.carrotsCollected = 3;
  }

  preload() {
    this.load.image("background", "assets/bg_layer1.png");
    this.load.image("platform", "assets/ground_grass.png");
    this.load.image("bunny-stand", "assets/bunny1_stand.png");
    this.load.image("bunny-jump", "assets/bunny1_jump.png");
    this.load.image("carrot", "assets/carrot.png");

    // bee enemy
    this.load.atlasXML("enemies", "assets/enemies.png", "assets/enemies.xml");

    // Tāne
    this.load.image("tane-stand", "assets/tane-back-idle.png");
    this.load.image("tane-jump", "assets/tane-back-jump.png");

    // this.load.audio("jump", "assets/sfx/phaseJump1.wav");
    this.load.audio("jump", [
      "assets/sfx/quake-jump.ogg",
      "assets/sfx/quake-jump.mp3",
    ]);
    this.load.audio("die", [
      "assets/sfx/quake-die.ogg",
      "assets/sfx/quake-die.mp3",
    ]);
    this.load.audio("hurt", [
      "assets/sfx/quake-hurt.ogg",
      "assets/sfx/quake-hurt.mp3",
    ]);

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    this.add.image(240, 320, "background").setScrollFactor(1, 0);

    this.platforms = this.physics.add.staticGroup();

    // then create 5 platforms from the group
    for (let i = 0; i < 5; ++i) {
      const x = Phaser.Math.Between(80, 400);
      const y = 150 * i;

      /** @type {Phaser.Physics.Arcade.Sprite} */
      const platform = this.platforms.create(x, y, "platform");
      platform.scale = 0.2;

      /** @type {Phaser.Physics.Arcade.StaticBody} */
      const body = platform.body;
      body.updateFromGameObject();
    }

    this.player = this.physics.add.sprite(240, 320, "tane-stand").setScale(0.08);

    this.player.body.setSize(50, 1500).setOffset(850, 100);

    this.physics.add.collider(this.platforms, this.player);

    this.player.body.checkCollision.up = false;
    this.player.body.checkCollision.left = false;
    this.player.body.checkCollision.right = false;

    this.cameras.main.startFollow(this.player);
    this.cameras.main.setDeadzone(this.scale.width * 1.5);

    this.carrots = this.physics.add.group({
      classType: Carrot,
    });

    this.anims.create({
      key: 'bee',
      frames: [{ key: 'enemies', frame: 'bee.png' },{ key: 'enemies', frame: 'bee_fly.png' }],
      frameRate: 8,
      repeat: -1
    });

    this.physics.add.collider(this.platforms, this.carrots);
    this.physics.add.overlap(
      this.player,
      this.carrots,
      this.handleCollectCarrot,
      undefined,
      this
    );

    this.carrotsCollectedText = this.add
      .text(240, 10, "Lives: 3", { color: "#000", fontSize: 24 })
      .setScrollFactor(0)
      .setOrigin(0.5, 0);
  }

  update(t, dt) {
    if (!this.player) {
      return;
    }

    this.platforms.children.iterate((child) => {
      /** @type {Phaser.Physics.Arcade.Sprite} */
      const platform = child;

      const scrollY = this.cameras.main.scrollY;
      if (platform.y >= scrollY + 700) {
        platform.y = scrollY - Phaser.Math.Between(50, 100);
        platform.body.updateFromGameObject();
        this.addCarrotAbove(platform);
      }
    });

    const touchingDown = this.player.body.touching.down;

    if (touchingDown) {
      this.player.setVelocityY(-610);
      this.player.setTexture("tane-jump");

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
    const y = sprite.y - sprite.displayHeight;

    /** @type {Phaser.Physics.Arcade.Sprite} */
    const carrot = this.carrots.get(sprite.x, y, "carrot");

    carrot.setActive(true);
    carrot.setVisible(true);

    this.add.existing(carrot);

    carrot.body.setSize(carrot.width, carrot.height);

    carrot.play("bee", true)

    this.physics.world.enable(carrot);

    return carrot;
  }

  /**
   *
   * @param {Phaser.Physics.Arcade.Sprite} player
   * @param {Carrot} carrot
   */
  handleCollectCarrot(player, carrot) {

    if (this.carrotsCollected == 0) {
      this.scene.start("game-over");
      this.sound.play("die");
    }

    this.carrots.killAndHide(carrot);

    this.physics.world.disableBody(carrot.body);

    this.carrotsCollected--;

    this.sound.play("hurt");

    this.carrotsCollectedText.text = `Lives: ${this.carrotsCollected}`;
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
  constructor()
	{
		super('game-over')
	}

	create()
	{
		const width = this.scale.width
		const height = this.scale.height

		this.add.text(width * 0.5, height * 0.5, 'Game Over', {
			fontSize: 48
		})
		.setOrigin(0.5)

		this.input.keyboard.once('keydown_SPACE', () => {
			this.scene.start('game')
		})
	}
}

  class Carrot extends Phaser.Physics.Arcade.Sprite {
	/**
	 * @param {Phaser.Scene} scene 
	 * @param {number} x 
	 * @param {number} y 
	 * @param {string} texture 
	 */
	constructor(scene, x, y, texture = 'carrot')
	{
		super(scene, x, y, texture)

		this.setScale(0.5)
	}
}