import { GameData } from '../escenas/index.js'

export class Player {
    constructor(scene) {
        this.myScene = scene;
        this.health = GameData.health;
        this.score = GameData.score;
        this.money = GameData.money;
        this.isAttacking = false;
    }

    preload() {
        this.myScene.load.spritesheet('playerRun', '../images/jugador/CachiRun.png', { frameWidth: 69, frameHeight: 74 });
        this.myScene.load.spritesheet('playerAttack', '../images/jugador/CachiAttack.png', { frameWidth: 82, frameHeight: 74 });
        this.myScene.load.spritesheet('headSprites', '../images/items/cachiripaVida.png', { frameWidth: 55, frameHeight: 63 });
    
    }

    create() {

        this.myScene.anims.create({
            key: 'headAnimation',
            frames: this.myScene.anims.generateFrameNumbers('headSprites', { start: 0, end: 11 }),
            frameRate: 10,
            repeat: -1
        });

        // Crear HUD
        this.createHUD();


        // Player Ataques
        this.myScene.anims.create({
            key: 'AttackFist',
            frames: this.myScene.anims.generateFrameNumbers('playerAttack', { start: 2, end: 4 }),
            frameRate: 5,
            repeat: 0
        });

        this.myScene.anims.create({
            key: 'AttackSlap',
            frames: this.myScene.anims.generateFrameNumbers('playerAttack', { start: 5, end: 8 }),
            frameRate: 5,
            repeat: 0
        });

        this.myScene.anims.create({
            key: 'AttackKick',
            frames: this.myScene.anims.generateFrameNumbers('playerAttack', { start: 9, end: 11 }),
            frameRate: 5,
            repeat: 0
        });


        // Player animaciones
        this.myScene.anims.create({
            key: 'Run',
            frames: this.myScene.anims.generateFrameNumbers('playerRun', { start: 7, end: 12 }),
            frameRate: 20,
            repeat: -1
        });

        this.myScene.anims.create({
            key: 'Idle',
            frames: this.myScene.anims.generateFrameNumbers('playerRun', { start: 0, end: 1 }),
            frameRate: 0.5,
            repeat: -1
        });

        this.myScene.anims.create({
            key: 'Jump',
            frames: this.myScene.anims.generateFrameNumbers('playerRun', { start: 12, end: 13 }),
            frameRate: 10,
            repeat: 1
        });

        this.myScene.anims.create({
            key: 'Fall',
            frames: [{ key: 'playerRun', frame: 14 }],
            frameRate: 10,
            repeat: 0
        });

        this.myScene.anims.create({
            key: 'Hurt',
            frames: [{ key: 'playerAttack', frame: 0 }],
            frameRate: 10,
            repeat: 0
        });

        // Physics y controles
        //Physics-------------------------------------------------
        this.Player = this.myScene.physics.add.sprite(50,50, 'playerRun').setScale(0.8)
        this.Player.body.setSize(this.Player.width * 0.4, this.Player.height * 0.6);
        this.Player.body.setOffset(this.Player.width * 0.3, this.Player.height * 0.2);
        this.Player.setBounce(0.2);
        this.Player.setCollideWorldBounds(true);

        //Controles-----------------------------------------------
        this.keyD = this.myScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        this.keyA = this.myScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        this.keyW = this.myScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
    }

    createHUD() {
        // Crear cabecitas animadas para la vida
        this.heads = [];
        for (let i = 0; i < 3; i++) { // Suponiendo que tienes 3 cabecitas
            const head = this.myScene.add.sprite(0, 0, 'headSprites');
            head.setScale(0.5); // Tamaño más pequeño
            head.setOrigin(0, 0);
            head.play('headAnimation'); // Reproducir animación
            this.heads.push(head);
        }

        // Texto de dinero
        this.moneyText = this.myScene.add.text(0, 0, `Money: ${this.money}`, {
            fontSize: '20px',
            fill: '#fff'
        });

        // Texto de puntuación
        this.scoreText = this.myScene.add.text(0, 0, `Score: ${this.score}`, {
            fontSize: '20px',
            fill: '#fff'
        });
    }

    updateHUD() {
        const player = this.myScene.player.Player;

        for (let i = 0; i < this.heads.length; i++) {
            this.heads[i].setX(player.x - 200 + (i * 20));
            this.heads[i].setY(player.y - 150);
            this.heads[i].setVisible(i < this.health);
        }

        // Actualizar texto de dinero y puntuación
        this.moneyText.setText(`Money: ${GameData.money}`);
        this.scoreText.setText(`Score: ${GameData.score}`);
        this.moneyText.setPosition(player.x - 200, player.y - 120);
        this.scoreText.setPosition(player.x + 150, player.y - 120);
    }
    

    update(){
        // Llamar a updateHUD en cada actualización
        this.updateHUD();


        if(this.keyD.isDown){
            this.Player.play('Run', true)
            this.Player.setVelocityX(160)
            this.Player.flipX = false
        }else if(this.keyA.isDown){
            this.Player.play('Run', true)
            this.Player.setVelocityX(-160)
            this.Player.flipX = true;
        }else{
            this.Player.setVelocityX(0)
            this.Player.play('Idle', true)
            this.Player.flipX = false
        }

        if(this.keyW.isDown && this.Player.body.blocked.down ){//cambiamos touching por blocked
            this.Player.setVelocityY(-400);
            this.Player.play('Jump', true)
        }
    }

    increaseScore(amount) {
        this.score += amount;
        GameData.score = this.score;
    }

    increaseMoney(amount) {
        this.money += amount;
        GameData.money = this.money;
    }
}