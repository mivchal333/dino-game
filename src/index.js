import Phaser from "phaser";
import PlayScene from './PlayScene';
import PreloadScene from './PreloadScene';

const config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 400,
    backgroundColor: "48a",
    scene: [PreloadScene, PlayScene],
    physics: {
        default: 'arcade',
    },
};
new Phaser.Game(config);
