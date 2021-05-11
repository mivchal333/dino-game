import Phaser from 'phaser';

class PlayScene extends Phaser.Scene {
    constructor() {
        super('PlayScene');
        this.gameSpeed = 3;
        this.running = true;
        this.spawnTime = 0;
        this.lives = 3;
    }

    create() {
        this.sky = this.add.tileSprite(0, 400, 2000, 800, 'sky');
        this.ground = this.add.tileSprite(0, 400, 2400, 50, 'ground')
        this.physics.add.existing(this.ground, true);
        this.livesText = this.add.text(16, 16, 'Lives: 3', {fontSize: '32px', fill: '#fff'});
        this.jumpSound = this.sound.add('jump', {volume: 1});
        this.starSound = this.sound.add('star', {volume: 1})
        this.collisionSound = this.sound.add('collision', {volume: 1});
        this.powerUpSound = this.sound.add('powerup', {volume: 1});
        this.dieSound = this.sound.add('die', {volume: 1});
        this.ground.immovable = true;
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('mario', {frames: [0, 1, 2, 3, 4]}),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('mario', {frames: [6]}),
            frameRate: 1,
            repeat: -1
        });
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('mario', {frames: [7, 8, 9, 10, 11]}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'browser_run',
            frames: this.anims.generateFrameNumbers('browser', {frames: [0, 1, 2, 3, 4, 5]}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'browser_fire',
            frames: this.anims.generateFrameNumbers('browser', {frames: [6, 7, 8]}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'fire',
            frames: this.anims.generateFrameNumbers('browser', {frames: [11, 10, 9]}),
            frameRate: 2,
            repeat: -1
        });
        this.anims.create({
            key: 'goomba_run',
            frames: this.anims.generateFrameNumbers('goomba', {frames: [0, 1, 2, 3]}),
            frameRate: 7,
            repeat: -1
        });
        this.anims.create({
            key: 'star_round',
            frames: this.anims.generateFrameNumbers('star', {frames: [0, 1, 2, 3, 4, 5, 6, 7, 8]}),
            frameRate: 7,
            repeat: -1
        });

        this.anims.create({
            key: 'paratroopa_fly',
            frames: this.anims.generateFrameNumbers('paratroopa', {frames: [0, 1, 2, 3]}),
            frameRate: 7,
            repeat: -1
        });
        this.anims.create({
            key: 'mario_star',
            frames: this.anims.generateFrameNumbers('mario_star', {frames: [0, 1, 2, 3, 4, 5, 6, 7, 8]}),
            frameRate: 7,
            repeat: -1
        });


        this.mario = this.physics.add.sprite(30, 100)
            .setCollideWorldBounds(true)
            .setGravityY(5000)
        this.mario.setScale(1);
        this.mario.play('walk');
        this.physics.add.collider(this.mario, this.ground);
        // game.physics.enable(mario, Phaser.Physics.ARCADE)


        this.input.keyboard.on('keydown-SPACE', () => {
            if (this.mario.body.onFloor()) {
                this.mario.setVelocityY(-1300);
                this.jumpSound.play();
            }
        });
        this.input.keyboard.on('keydown-UP', () => {
            if (this.mario.body.onFloor()) {
                this.mario.setVelocityY(-1000);
                this.jumpSound.play();
            }
        });

        this.input.keyboard.on('keydown-DOWN', () => {
            if (this.mario.body.onFloor()) {
                //
            }
        });
        this.stars = this.physics.add.group();
        this.obsticles = this.physics.add.group();
        this.physics.add.collider(this.obsticles, this.ground);

        this.star = this.add.sprite(100, 300);
        this.star.setScale(1);
        this.star.play('star_round');
        this.browser = this.add.sprite(160, 300);
        this.browser.setScale(1);
        this.browser.play('browser_run');
        this.browser = this.add.sprite(200, 300);
        this.browser.setScale(1);
        this.browser.play('browser_fire');
        this.goomba = this.add.sprite(240, 300);
        this.goomba.setScale(1);
        this.goomba.play('goomba_run');
        this.paratroopa = this.add.sprite(280, 300);
        this.paratroopa.setScale(1);
        this.paratroopa.play('paratroopa_fly');
        this.fire = this.add.sprite(310, 300);
        this.fire.setScale(1);
        this.fire.play('fire');
        this.marioStar = this.add.sprite(350, 300);
        this.marioStar.setScale(1);
        this.marioStar.play('mario_star');

        this.physics.add.collider(this.stars, this.ground);
        this.physics.add.overlap(this.mario, this.stars, this.collectStar, null, this);
        this.physics.add.overlap(this.mario, this.obsticles, this.enemyCollision, null, this);

    }

    enemyCollision(mario, enemy) {
        enemy.destroy();
        if (this.lives > 1) {
            this.lives--;
            this.collisionSound.play();
            this.livesText.setText('Lives: ' + this.lives);
        } else {
            this.running = false;
            this.dieSound.play();
        }
    }

    collectStar(mario, star) {
        console.log("catch");
        this.lives++;
        star.destroy();
        this.starSound.play();
        this.livesText.setText('Lives: ' + this.lives);
    }

    update(time, delta) {
        if (!this.running) {
            return;
        }
        this.spawnTime += delta * this.gameSpeed * 0.05;
        if (this.spawnTime > 500) {
            this.spawnTime = 0;

            let number = Math.floor(Math.random() * 3) + 1;
            Phaser.Math.Between(600, 900);
            let obsticle;
            switch (number) {
                case 1:
                    obsticle = this.obsticles.create(1000, 350, 'browser_run', 0, true, true)
                    obsticle.play('browser_run');
                    break;
                case 2:
                    obsticle = this.obsticles.create(1000, 350, 'browser_run', 0, true, true)
                    obsticle.play('goomba_run');
                    break;
                case 3:
                    obsticle = this.stars.create(1000, 350, 'star_round', 0, true, true)
                    obsticle.play('star_round');
                    break;
            }
            obsticle.setVelocityX(this.gameSpeed * -100);

        }
        this.ground.tilePositionX += this.gameSpeed;
        this.sky.tilePositionX += this.gameSpeed;
        if (this.mario.body.onFloor()) {
            this.mario.play('walk', true);
        } else {
            this.mario.play('jump');
        }
    }
}

export default PlayScene
