export class arania {
    constructor(scene) {
        this.myScene = scene;
    }

    preload() {
        this.myScene.load.spritesheet('spider', '../../images/enemigos/SpiderCone.png', { frameWidth: 128, frameHeight: 128 });
        this.myScene.load.tilemapTiledJSON('enemyJSON', '../../json/Level1.json'); 
    }

    create(pPlayer) {
        this.myScene.anims.create({
            key: 'arania-caminar',
            frames: this.myScene.anims.generateFrameNumbers('spider', { start: 10, end: 15 }),
            frameRate: 10,
            repeat: -1
        });
        this.myScene.anims.create({
            key: 'arania-danio',
            frames: [{ key: 'spider', frame: 0 }],
            frameRate: 10,
            repeat: 0
        });
        this.myScene.anims.create({
            key: 'arania-descanso',
            frames: [
                { key: 'spider', frame: 1 },
                { key: 'spider', frame: 2 },
                { key: 'spider', frame: 3 },
                { key: 'spider', frame: 4 },
                { key: 'spider', frame: 3 },
                { key: 'spider', frame: 2 },
                { key: 'spider', frame: 1 },
            ],
            frameRate: 3,
            repeat: -1
        });

        this.map = this.myScene.make.tilemap({ key: 'enemyJSON' });

        // Capa de enemigos
        this.enemiesObj = this.map.getObjectLayer('Enemigos').objects;
        // Creamos grupo de enemigos
        this.enemies = this.myScene.physics.add.group();

        // Agregamos enemigos al grupo
        this.enemiesObj.forEach(element => {
            this.enemy = this.enemies.create(element.x, element.y - element.height, 'spider').play('arania-caminar', true);
            this.enemy.setScale(0.4); // Reducción del tamaño del sprite al 50%
            this.enemy.body.setSize(47, 39.5); // Ajustar el tamaño del cuerpo físico (la hitbox)
            this.enemy.body.setOffset(50, 80); // Ajustar la posición del cuerpo físico dentro del sprite
            this.enemy.setCollideWorldBounds(true);
        });

        this.myScene.physics.add.collider(pPlayer, this.enemies, this.hitEnemy, null, this);
    }

    update(pPlayer) {
        this.data(pPlayer, this.enemies);
    }

    data(player, enemies) {
        enemies.children.iterate(function(child) {
            let distance = player.x - child.x;

            if (child.body.velocity.x > 0 || child.body.velocity.x < 0) {
                child.play('arania-caminar', true);
            } else {
                child.play('arania-descanso', true);
            }

            if (Phaser.Math.Distance.BetweenPoints(player, child) < 180) {
                if (distance > 20) {
                    child.setVelocityX(50);
                    child.flipX = true;
                } else if (distance < -20) {
                    child.setVelocityX(-50);
                    child.flipX = false;
                } else {
                    child.setVelocityX(0);
                }
            } else {
                child.setVelocityX(0);
            }
        });
    }

    hitEnemy(player, enemy) {
        if (player.body.velocity.y > 0 && enemy.body.touching.up) {
            enemy.disableBody(true, true); // Elimina al enemigo
            player.setVelocityY(-200); // Rebota el jugador hacia arriba
        } else {
            // Aquí puedes manejar lo que sucede si el enemigo golpea al jugador
            player.disableBody(true, true);
        }
    }
}
