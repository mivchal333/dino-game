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
    this.load.audio('jump', 'src/assets/audio/jump.mp3');
    this.load.audio('star', 'src/assets/audio/coin.mp3');
    this.load.audio('collision', 'src/assets/audio/kick.mp3');
    this.load.audio('powerup', 'src/assets/audio/powerup.mp3');
    this.load.audio('die', 'src/assets/audio/die.mp3');
}

var mario;
var star;
var browser;
var browser2;
var goomba;
var paratroopa;
var fire;
var marioStar;
var ground;
var sky;
var gameSpeed = 3;
var running = true;
var spawnTime = 0;
var spawnPeriod;
var obsticles;
var jumpSound;
var stars;
var starSound;
var lives = 3;
var livesText;
var collisionSound;
var powerUpSound;
var dieSound;

function create() {
    sky = this.add.tileSprite(0, 400, 2000, 800, 'sky');
    ground = this.add.tileSprite(0, 400, 2400, 50, 'ground')
    this.physics.add.existing(ground, true);
    livesText = this.add.text(16, 16, 'Lives: 3', { fontSize: '32px', fill: '#fff' });
    jumpSound = this.sound.add('jump', {volume: 1});
    starSound = this.sound.add('star', {volume: 1})
    collisionSound = this.sound.add('collision', {volume: 1});
    powerUpSound = this.sound.add('powerup', {volume: 1});
    dieSound = this.sound.add('die', {volume: 1});
    ground.immovable = true;
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
    // game.physics.enable(mario, Phaser.Physics.ARCADE)


    this.input.keyboard.on('keydown-SPACE', () => {
        if (mario.body.onFloor()) {
            mario.setVelocityY(-1300);
            jumpSound.play();
        }
    });
    this.input.keyboard.on('keydown-UP', () => {
        if (mario.body.onFloor()) {
            mario.setVelocityY(-1000);
            jumpSound.play();
        }
    });

    this.input.keyboard.on('keydown-DOWN', () => {
        if (mario.body.onFloor()) {
            //
        }
    });
    stars = this.physics.add.group();
    obsticles = this.physics.add.group();
    this.physics.add.collider(obsticles, ground);

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
    marioStar = this.add.sprite(350, 300);
    marioStar.setScale(1);
    marioStar.play('mario_star');

    this.physics.add.collider(stars, ground);
    this.physics.add.overlap(mario, stars, collectStar, null, this);
    this.physics.add.overlap(mario, obsticles, enemyCollision, null, this);
}

function enemyCollision(mario, enemy){
    enemy.destroy();
    if(lives > 1){
        lives--;
        collisionSound.play();
        livesText.setText('Lives: ' + lives);
    }else{
        running = false;
        dieSound.play();
    }
}
  
function collectStar (mario, star)
{
    console.log("catch");
    lives++;
    star.destroy();
    starSound.play();
    livesText.setText('Lives: ' + lives);
}

function update(time, delta) {
    if(!running){
        return;
    }
    spawnTime += delta * gameSpeed * 0.05;
    if(spawnTime > 500){
        spawnTime = 0;
        
        let number = Math.floor(Math.random()* 3) + 1;
        let distance = Phaser.Math.Between(600, 900);
        let obsticle;
        console.log(number);
        switch (number){
            case 1:
                obsticle = obsticles.create(1000, 350, 'browser_run', 0, true, true)
                obsticle.play('browser_run');
                break;
            case 2:
                obsticle = obsticles.create(1000, 350, 'browser_run', 0, true, true)
                obsticle.play('goomba_run');
                break;
            case 3:
                obsticle = stars.create(1000, 350, 'star_round', 0, true, true)
                obsticle.play('star_round');
                break;
        }
        obsticle.setVelocityX(gameSpeed * -100);
        
    }
    ground.tilePositionX += gameSpeed;
    sky.tilePositionX += gameSpeed;
    if (mario.body.onFloor()) {
        mario.play('walk', true);
    } else {
        mario.play('jump');
    }
}