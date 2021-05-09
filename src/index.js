console.log("hello!")
var config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 400,
    backgroundColor: "48a",
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: true
        }
    },
};
var game = new Phaser.Game(config);
function preload() {
    this.load.spritesheet('mario', 'src/assets/mario.png', { frameWidth: 28, frameHeight: 32 });
    this.load.spritesheet('browser', 'src/assets/browser.png', { frameWidth: 34, frameHeight: 32 });
    this.load.spritesheet('goomba', 'src/assets/goomba.png', { frameWidth: 28, frameHeight: 32 });
    this.load.spritesheet('paratroopa', 'src/assets/paratroopa.png', { frameWidth: 30, frameHeight: 32 });
    this.load.spritesheet('mario_star', 'src/assets/mario_star.png', { frameWidth: 45, frameHeight: 45 });
    this.load.spritesheet('star', 'src/assets/star.png', { frameWidth: 28, frameHeight: 32 });
    this.load.image('sky', 'src/assets/clouds.png');
    this.load.image('ground', 'src/assets/ground.png');

}

var mario;
var star;
var browser;
var browser2;
var goomba;
var paratroopa;
var fire;
var mario_star;
var ground;
var sky;
var gameSpeed = 3;

function create() {
    sky = this.add.tileSprite(0, 400, 2000, 800, 'sky');
    ground = this.add.tileSprite(0, 400, 2400, 50, 'ground')
    this.physics.add.existing(ground, true);

    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNumbers('mario', { frames: [0, 1, 2, 3, 4] }),
        frameRate: 8,
        repeat: -1
    });
    this.anims.create({
        key: 'jump',
        frames: this.anims.generateFrameNumbers('mario', { frames: [6] }),
        frameRate: 1,
        repeat: -1
    });
    this.anims.create({
        key: 'down',
        frames: this.anims.generateFrameNumbers('mario', { frames: [7, 8, 9, 10, 11] }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'browser_run',
        frames: this.anims.generateFrameNumbers('browser', { frames: [0, 1, 2, 3, 4, 5] }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'browser_fire',
        frames: this.anims.generateFrameNumbers('browser', { frames: [6, 7, 8] }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'fire',
        frames: this.anims.generateFrameNumbers('browser', { frames: [11, 10, 9] }),
        frameRate: 2,
        repeat: -1
    });
    this.anims.create({
        key: 'goomba_run',
        frames: this.anims.generateFrameNumbers('goomba', { frames: [0, 1, 2, 3] }),
        frameRate: 7,
        repeat: -1
    });
    this.anims.create({
        key: 'star_round',
        frames: this.anims.generateFrameNumbers('star', { frames: [0, 1, 2, 3, 4, 5, 6, 7, 8] }),
        frameRate: 7,
        repeat: -1
    });

    this.anims.create({
        key: 'paratroopa_fly',
        frames: this.anims.generateFrameNumbers('paratroopa', { frames: [0, 1, 2, 3] }),
        frameRate: 7,
        repeat: -1
    });
    this.anims.create({
        key: 'mario_star',
        frames: this.anims.generateFrameNumbers('mario_star', { frames: [0, 1, 2, 3, 4, 5, 6, 7, 8] }),
        frameRate: 7,
        repeat: -1
    });

    mario = this.physics.add.sprite(30, 100)
        .setCollideWorldBounds(true)
        .setGravityY(5000)
    mario.setScale(1);
    mario.play('walk');
    this.physics.add.collider(mario, ground);


    this.input.keyboard.on('keydown-SPACE', () => {
        if (mario.body.onFloor()) {
            mario.setVelocityY(-1000);
        }
    });
    this.input.keyboard.on('keydown-UP', () => {
        if (mario.body.onFloor()) {
            mario.setVelocityY(-1000);
        }
    });

    this.input.keyboard.on('keydown-DOWN', () => {
        if (mario.body.onFloor()) {
            //
        }
    });

    star = this.add.sprite(100, 300);
    star.setScale(1);
    star.play('star_round');
    browser = this.add.sprite(160, 300);
    browser.setScale(1);
    browser.play('browser_run');
    browser = this.add.sprite(200, 300);
    browser.setScale(1);
    browser.play('browser_fire');
    goomba = this.add.sprite(240, 300);
    goomba.setScale(1);
    goomba.play('goomba_run');
    paratroopa = this.add.sprite(280, 300);
    paratroopa.setScale(1);
    paratroopa.play('paratroopa_fly');
    fire = this.add.sprite(310, 300);
    fire.setScale(1);
    fire.play('fire');
    mario_star = this.add.sprite(350, 300);
    mario_star.setScale(1);
    mario_star.play('mario_star');
}

function update() {
    ground.tilePositionX += gameSpeed;
    sky.tilePositionX += gameSpeed;
    if (mario.body.onFloor()) {
        mario.play('walk', true);
    } else {
        mario.play('jump');
    }
}