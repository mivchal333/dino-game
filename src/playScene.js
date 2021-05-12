import Phaser from 'phaser';
import {random} from 'lodash'

class PlayScene extends Phaser.Scene {
    constructor() {
        super('PlayScene');
        this.gameSpeed = 3;
        this.running = true;
        this.spawnTime = 0;
        this.lives = 3;
        this.points = 0;
    }

    create() {
        this.sky = this.add.tileSprite(0, 400, 2000, 800, 'sky');
        this.ground = this.add.tileSprite(0, 400, 2400, 50, 'ground')
        this.physics.add.existing(this.ground, true);
        this.livesText = this.add.text(16, 40, 'Lives: 3', {fontSize: '32px', fill: '#fff'});
        this.pointsText = this.add.text(16, 16, 'Points: 0', {fontSize: '32px', fill: '#fff'});
        this.jumpSound = this.sound.add('jump', {volume: 1});
        this.starSound = this.sound.add('star', {volume: 1})
        this.collisionSound = this.sound.add('collision', {volume: 1});
        this.powerUpSound = this.sound.add('powerup', {volume: 1});
        this.dieSound = this.sound.add('die', {volume: 1});
        this.gameOverScreen = this.add.container(500, innerHeight / 2 - 300).setAlpha(0)
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
            repeat: 5
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


        this.input.keyboard.on('keydown-SPACE', () => this.jumpCallback());
        this.input.keyboard.on('keydown-UP', () => this.jumpCallback());
        this.input.keyboard.on('keydown-DOWN', () => {
            if(this.mario.body.height > 30){
                this.mario.body.height = 24;
                this.mario.body.offset.y = 12;
            }
        })

        this.input.keyboard.on('keyup-DOWN', () => {
            this.mario.body.height = 48;
            this.mario.body.offset.y = 0;
            this.mario.setPosition(30, 328,)
        })


        this.restart.on('pointerdown', () => this.restartGameCallback())
        this.stars = this.physics.add.group();
        this.obsticles = this.physics.add.group();
        this.physics.add.collider(this.obsticles, this.ground);

        this.physics.add.collider(this.stars, this.ground);
        this.physics.add.overlap(this.mario, this.stars, this.collectStar, null, this);
        this.physics.add.overlap(this.mario, this.obsticles, this.enemyCollision, null, this);
        this.input.on('gameobjectdown', this.fireBlowClick)
    }

    enemyCollision(mario, enemy) {
        enemy.destroy();
        this.lives--;
        this.livesText.setText('Lives: ' + this.lives);
        if (this.lives > 0) {
            this.collisionSound.play();
        } else {
            this.mario.setTexture('marioDie')
            this.running = false;
            this.dieSound.play();
            this.gameOverScreen.setAlpha(1)
            this.mario.anims.stop();
        }
    }

    collectStar(mario, star) {
        this.lives++;
        star.destroy();
        this.starSound.play();
        this.livesText.setText('Lives: ' + this.lives);
        this.points += 50;
        this.pointsText.setText('Points: ' + this.points);
        if(this.points % 100 === 0){
            this.powerUpSound.play();
        }
    }

    restartGameCallback() {
        this.mario.setVelocityY(0);
        this.mario.setPosition(30, 100)
        this.physics.resume();
        this.obsticles.clear(true, true);
        this.running = true;
        this.gameOverScreen.setAlpha(0);
        this.anims.resumeAll();
        this.lives = 3;
        this.gameSpeed = 3;
        this.livesText.setText('Lives: ' + this.lives);
        this.points  = 0;
        this.pointsText.setText('Points: ' + this.points);
    };

    fireBlowClick(click, fireBlow){
        fireBlow.destroy();
    }

    jumpCallback() {
        if (!this.running) {
            this.restartGameCallback();
        }

        if (!this.mario.body.onFloor() || !this.running) return;
        this.mario.setVelocityY(-1300);
        this.jumpSound.play();
    };

    update(time, delta) {
        if (!this.running) {
            return;
        }
        this.gameSpeed += 0.003
        this.spawnTime += delta * this.gameSpeed * 0.05;
        if (this.spawnTime > 500) {
            this.spawnTime = 0;

            let number = random(1, 4)
            switch (number) {
                case 1:
                    this.runObstacle(this.obsticles, 'browser_run', 'browser_run')
                    break;
                case 2:
                    this.runObstacle(this.obsticles, 'browser_run', 'goomba_run')
                    break;
                case 3:
                    this.runObstacle(this.stars, 'star_round', 'star_round')
                    break;
                case 4:
                    const height = random(200, 350);
                    let ranObstacle = this.runObstacle(this.obsticles, 'paratroopa', 'paratroopa_fly', 1000, height, 0, -70);
                    setTimeout(() => {
                        let fireBall = this.runObstacle(this.obsticles, 'fire', 'fire', ranObstacle.x - 50, height, 0, -90);
                        fireBall.setInteractive();
                    }, 200)
                    break;
            }
        }

        this.obsticles.getChildren().forEach(obstacle => {
            if (obstacle.getBounds().right < 0) {
                // this.obsticles.killAndHide(obstacle);
                obstacle.destroy();
                this.points += 25;
                this.pointsText.setText('Points: ' + this.points);
                if(this.points % 100 === 0){
                    this.powerUpSound.play();
                }
            }
        })

        this.ground.tilePositionX += this.gameSpeed;
        this.sky.tilePositionX += this.gameSpeed;
        if(this.mario.body.height < 30){
            console.log("Tak")
            this.mario.play('down');
        }else if (this.mario.body.onFloor()) {
            this.mario.play('walk', true);
        } else {
            this.mario.play('jump');
        }
    }

    runObstacle(group, obstacleKey, playKey, x = 1000, y = 350, gravity = 300, deltaVelocity = -100) {
        if (!this.running) {
            return
        }
        let obstacle = group.create(x, y, obstacleKey, 0, true, true)
            .setScale(1.5)
            .setGravityY(gravity)
        obstacle.play(playKey);
        obstacle.setVelocityX(this.gameSpeed * deltaVelocity);
        return obstacle;
    }
}

export default PlayScene
