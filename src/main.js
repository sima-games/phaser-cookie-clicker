import Phaser from 'phaser';
import cookieImage from './assets/cookie.png';
import fullscreenImage from './assets/fullscreen.png';

const VIRTUAL_WIDTH = 540;
const VIRTUAL_HEIGHT = 960;

const config = {
  type: Phaser.AUTO,
  width: VIRTUAL_WIDTH,
  height: VIRTUAL_HEIGHT,
  banner: false,
  orientation: 'portrait',
  disableContextMenu: true,
  autoMobilePipeline: true,
  antialias: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: { preload, create, update },
  parent: 'game-container',
};

document.fonts.load('700 20px "Open Sans"').then(() => {
  const game = new Phaser.Game(config);
});

let graphics;

const initDelay = 2000;
const decreseFactor = 1.002;
let gameOverDelay = initDelay;

let scoreText;
let bestScoreText;
let score = 0;
let bestScore = 0;

let cookie;

let gameOver = false;
let gameOverText;
let clickToRestartText;

const respawnCookie = () => {
  const halfW = cookie.displayWidth / 2;
  const halfH = cookie.displayHeight / 2;
  const x = getRandomInt(halfW, config.width - halfW);
  const y = getRandomInt(halfH * 2 + 44, config.height - halfH);
  cookie.setPosition(x, y);
};

const updateScoreText = () => {
  scoreText.setText(score.toString());
  scoreText.setPosition(config.width / 2 - scoreText.displayWidth / 2, 10);
};

const getRandomInt = (min, max) => {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
};

const restart = () => {
  score = 0;
  gameOverDelay = initDelay;
  updateScoreText();
  respawnCookie();
  cookie.setVisible(true);
  gameOverText.setVisible(false);
  clickToRestartText.setVisible(false);
  gameOver = false;
};

const updateBestScore = () => {};

function preload() {
  this.load.image('cookie', cookieImage);
  this.load.image('fullscreen', fullscreenImage);
}

function create() {
  const fullscreenButton = this.add
    .image(this.scale.width - 44, 44, 'fullscreen')
    .setScale(0.1)
    .setInteractive()
    .setScrollFactor(0)
    .setDepth(100);

  fullscreenButton.on('pointerup', () => {
    if (this.scale.isFullscreen) {
      this.scale.stopFullscreen();
    } else {
      this.scale.startFullscreen();
    }
  });

  this.input.on('pointerdown', () => {
    if (gameOver) {
      restart();
    }
  });

  graphics = this.add.graphics();

  cookie = this.add.image(0, 0, 'cookie').setInteractive();
  cookie.setScale(0.1);
  cookie.on('pointerdown', () => {
    score += 1;
    gameOverDelay = initDelay / Math.pow(decreseFactor, score);
    updateScoreText();
    respawnCookie();
  });

  respawnCookie();

  scoreText = this.add.text(0, 0, score.toString(), {
    fontFamily: 'Open Sans',
    fontSize: '64px',
  });
  updateScoreText();

  gameOverText = this.add.text(0, 0, 'GAME OVER', {
    fontFamily: 'Open Sans',
    fontSize: '64px',
  });
  gameOverText.setPosition(
    config.width / 2 - gameOverText.displayWidth / 2,
    config.height / 2 - gameOverText.displayHeight
  );
  gameOverText.setVisible(false);

  clickToRestartText = this.add.text(0, 0, 'CLICK TO RESTART', {
    fontFamily: 'Open Sans',
    fontSize: '32px',
    align: 'center',
  });
  clickToRestartText.setPosition(
    config.width / 2 - clickToRestartText.displayWidth / 2,
    config.height / 2
  );
  clickToRestartText.setVisible(false);
}

function update(time, delta) {
  gameOverDelay -= delta;

  const heightFactor = Phaser.Math.Clamp(gameOverDelay / initDelay, 0, 1);
  const rectHeight = heightFactor * config.height;

  graphics.clear();

  graphics.fillStyle(0x6cbec7, 1);
  graphics.fillRect(0, 0, config.width, config.height);

  graphics.fillStyle(0x81dae3, 1);
  graphics.fillRect(0, config.height - rectHeight, config.width, rectHeight);

  if (!gameOver && gameOverDelay <= 0) {
    gameOver = true;
  }

  if (gameOver) {
    cookie.setVisible(false);
    gameOverText.setVisible(true);
    clickToRestartText.setVisible(true);
  }
}
