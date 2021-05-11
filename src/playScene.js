import Phaser from 'phaser';
import {random} from 'lodash'

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
        this.gameOverScreen = this.add.container(innerWidth / 2, innerHeight / 2 - 300).setAlpha(0)
        this.gameOverText = this.add.image(0, 0, 'game-over');
        this.restart = this.add.image(0, 80, 'restart').setInteractive();
        this.gameOverScreen.add([
            this.gameOverText, this.restart
        ])

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
            frameRate: 7,
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
        this.mario.setScale(1.5);
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
                this.mario.setVelocityY(-1300);
                this.jumpSound.play();
            }
        });

        this.input.keyboard.on('keydown-DOWN', () => {
            if (this.mario.body.onFloor()) {
                //
            }
        });

        this.restart.on('pointerdown', () => {
            this.mario.setVelocityY(0);
            this.physics.resume();
            this.obsticles.clear(true, true);
            this.running = true;
            this.gameOverScreen.setAlpha(0);
            this.anims.resumeAll();
            this.lives = 3;
            this.livesText.setText('Lives: ' + this.lives);
        })
        this.stars = this.physics.add.group();
        this.obsticles = this.physics.add.group();
        this.physics.add.collider(this.obsticles, this.ground);

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
            this.gameOverScreen.setAlpha(1)
            this.mario.anims.stop();
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
        this.gameSpeed += 0.003
        this.spawnTime += delta * this.gameSpeed * 0.05;
        if (this.spawnTime > 500) {
            this.spawnTime = 0;

            let number = random(1, 4)
            Phaser.Math.Between(600, 900);
            switch (number) {
                case 1:
                    this.runObstacle('browser_run', 'browser_run')
                    break;
                case 2:
                    this.runObstacle('browser_run', 'goomba_run')
                    break;
                case 3:
                    this.runObstacle('star_round', 'star_round')
                    break;
                case 4:
                    const height = random(200, 350);
                    let ranObstacle = this.runObstacle('paratroopa', 'paratroopa_fly', 1000, height, 0, -70);

                    setTimeout(() => {
                        this.runObstacle('fire', 'fire', ranObstacle.x - 50, height, 0, -90)
                    }, 200)
                    break;
            }
        }
        this.ground.tilePositionX += this.gameSpeed;
        this.sky.tilePositionX += this.gameSpeed;
        if (this.mario.body.onFloor()) {
            this.mario.play('walk', true);
        } else {
            this.mario.play('jump');
        }
    }

    runObstacle(obstacleKey, playKey, x = 1000, y = 350, gravity = 300, deltaVelocity = -100) {
        let obstacle = this.obsticles.create(x, y, obstacleKey, 0, true, true)
            .setScale(1.5)
            .setGravityY(gravity)
        obstacle.play(playKey);
        obstacle.setVelocityX(this.gameSpeed * deltaVelocity);
        return obstacle;
    }
}

export default PlayScene
