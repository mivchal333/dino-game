import Phaser from 'phaser';

class PreloadScene extends Phaser.Scene {
    constructor() {
        super('PreloadScene');
    }

    preload() {
        this.load.spritesheet('mario', 'src/assets/mario.png', {frameWidth: 28, frameHeight: 32});
        this.load.spritesheet('browser', 'src/assets/browser.png', {frameWidth: 34, frameHeight: 32});
        this.load.spritesheet('goomba', 'src/assets/goomba.png', {frameWidth: 28, frameHeight: 32});
        this.load.spritesheet('paratroopa', 'src/assets/paratroopa.png', {frameWidth: 30, frameHeight: 32});
        this.load.spritesheet('mario_star', 'src/assets/mario_star.png', {frameWidth: 45, frameHeight: 45});
        this.load.spritesheet('star', 'src/assets/star.png', {frameWidth: 28, frameHeight: 32});
        this.load.image('sky', 'src/assets/clouds.png');
        this.load.image('ground', 'src/assets/ground.png');
        // TODO: use game over image
        this.load.image('game-over', 'src/assets/game-over.png');
        // TODO: use restart image
        this.load.image('restart', 'src/assets/restart.png');
        this.load.audio('jump', 'src/assets/audio/jump.mp3');
        this.load.audio('star', 'src/assets/audio/coin.mp3');
        this.load.audio('collision', 'src/assets/audio/kick.mp3');
        this.load.audio('powerup', 'src/assets/audio/powerup.mp3');
        this.load.audio('die', 'src/assets/audio/die.mp3');
    }

    create() {
        this.scene.start('PlayScene');
    }
}

export default PreloadScene;
