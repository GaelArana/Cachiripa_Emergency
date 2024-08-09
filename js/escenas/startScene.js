export class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
    }

    preload() {
        this.load.image('backgroundImage', '../images/ambiente/menu.png');
        this.load.image('playButton', '../images/ambiente/boton_play.png'); // Carga la imagen del botón de play
    }

    create() {
        let background = this.add.image(0, 0, 'backgroundImage').setOrigin(0, 0);
        background.displayWidth = this.sys.game.config.width;
        background.displayHeight = this.sys.game.config.height;

        // Texto principal con una fuente más llamativa
        let gameTitle = this.add.text(this.sys.game.config.width / 2, 150, 'Cachiripa Unadventures', {
            fontSize: '60px',
            fill: '#fff',
            fontFamily: 'Comic Sans MS, Comic Sans, cursive'
        }).setOrigin(0.5);

        // Botón de play
        let playButton = this.add.image(this.sys.game.config.width / 2, 300, 'playButton')
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => this.startGame());

        // Escalar el botón de play según sea necesario
        playButton.setScale(0.9);

        // Añadir efecto de cambio de escala al pasar el mouse sobre el botón
        playButton.on('pointerover', () => {
            playButton.setScale(1);
        });

        playButton.on('pointerout', () => {
            playButton.setScale(0.9);
        });
    }

    startGame() {
        this.scene.start('level1');
    }
}