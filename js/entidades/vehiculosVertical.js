export class VerticalVehicleManager {
    constructor(scene) {
        this.scene = scene;
        this.vehicleSpeedUp = -250; // Velocidad de los vehículos que suben
        this.vehicleSpeedDown = 250; // Velocidad de los vehículos que bajan

        // Configuraciones para vehículos que suben
        this.vehicleConfigsDown = [
            { key: 'vehicle1F', scale: 0.2, hitbox: { width: 1, height: 0.2, offsetX: 0.1, offsetY: 0.5 } },
            { key: 'vehicle2F', scale: 0.2, hitbox: { width: 1, height: 0.2, offsetX: 0.1, offsetY: 0.5 } },
            { key: 'vehicle3F', scale: 0.1, hitbox: { width: 1, height: 0.2, offsetX: 0.1, offsetY: 0.5 } }
        ];

        // Configuraciones para vehículos que bajan
        this.vehicleConfigsUp = [
            { key: 'vehicle1B', scale: 0.2, hitbox: { width: 1, height: 0.2, offsetX: 0.1, offsetY: 0.5 }},
            { key: 'vehicle2B', scale: 0.2, hitbox: { width: 1, height: 0.2, offsetX: 0.1, offsetY: 0.5 }},
            { key: 'vehicle3B', scale: 0.05, hitbox: { width: 1, height: 0.2, offsetX: 0.1, offsetY: 0.5 }}
        ];
        this.maxProjectiles = 2;
    }

    preload() {
        this.scene.load.image('vehicle1B', '../images/enemigos/vehículosF/hrvd.png');
        this.scene.load.image('vehicle2B', '../images/enemigos/vehículosF/fia.png');
        this.scene.load.image('vehicle3B', '../images/enemigos/vehículosF/corv.png');
        this.scene.load.image('vehicle1F', '../images/enemigos/frontCar.png');
        this.scene.load.image('vehicle2F', '../images/enemigos/vehículosF/bentleye.png');
        this.scene.load.image('vehicle3F', '../images/enemigos/vehículosF/for.png');
        this.scene.load.image('projectile', '../images/items/botella.png');
    }

    create() {
        this.vehiclesUp = this.scene.physics.add.group();
        this.vehiclesDown = this.scene.physics.add.group();

        // Crear vehículos que suben y bajan
        this.createVehicle(this.vehiclesUp, 600, this.scene.cameras.main.height - 100, this.vehicleSpeedUp, this.vehicleConfigsUp);
        this.createVehicle(this.vehiclesDown, 300, 130, this.vehicleSpeedDown, this.vehicleConfigsDown);
        this.createVehicle(this.vehiclesUp, 700, this.scene.cameras.main.height + 100, this.vehicleSpeedUp, this.vehicleConfigsUp);
        this.createVehicle(this.vehiclesDown, 150, 200, this.vehicleSpeedDown, this.vehicleConfigsDown);

        // Crear grupo de proyectiles con un máximo de 3
        this.projectiles = this.scene.physics.add.group({
            maxSize: this.maxProjectiles,
            allowGravity: true,
            collideWorldBounds: true
        });

        // Iniciar el evento de disparo de proyectiles
        this.scene.time.addEvent({
            delay: 1000,
            callback: this.shootProjectile,
            callbackScope: this,
            loop: true
        });

        // Configurar colisiones entre proyectiles y el jugador
        this.scene.physics.add.collider(this.projectiles, this.scene.player.Player, this.handleProjectileCollision, null, this);
    }

    createVehicle(group, x, y, speed, configs) {
        const config = Phaser.Utils.Array.GetRandom(configs);

        const vehicle = this.scene.physics.add.sprite(x, y, config.key);
        vehicle.setScale(config.scale);
        vehicle.setVelocityY(speed);
        vehicle.setCollideWorldBounds(false);
        vehicle.setImmovable(true);
        vehicle.body.setAllowGravity(true);

        vehicle.body.setSize(
            vehicle.width * config.hitbox.width,
            vehicle.height * config.hitbox.height
        );
        vehicle.body.setOffset(
            vehicle.width * config.hitbox.offsetX,
            vehicle.height * config.hitbox.offsetY
        );

        vehicle.initialY = y;
        vehicle.initialX = x;

        group.add(vehicle);
    }

    update() {
        this.vehiclesUp.children.iterate(vehicle => {
            if (vehicle.y <= 130) {
                this.resetVehicle(vehicle, vehicle.initialX, vehicle.initialY, this.vehicleSpeedUp, this.vehicleConfigsUp);
                
            } else {
                vehicle.setVelocityY(this.vehicleSpeedUp);
            }
        });

        this.vehiclesDown.children.iterate(vehicle => {
            if (vehicle.y >= 1300) {
                this.resetVehicle(vehicle, vehicle.initialX, 130, this.vehicleSpeedDown, this.vehicleConfigsDown);
            } else {
                vehicle.setVelocityY(this.vehicleSpeedDown);
            }
        });

        this.projectiles.children.iterate(projectile => {
            if (projectile.active) {
                    this.scene.time.delayedCall(3000, () => {
                    projectile.setActive(false).setVisible(false);
                }, [], this);
            }
        });
    }

    resetVehicle(vehicle, x, y, speed, configs) {
        const newConfig = Phaser.Utils.Array.GetRandom(configs);
        vehicle.setTexture(newConfig.key);
        vehicle.setScale(newConfig.scale);
        vehicle.body.setSize(
            vehicle.width * newConfig.hitbox.width,
            vehicle.height * newConfig.hitbox.height
        );
        vehicle.body.setOffset(
            vehicle.width * newConfig.hitbox.offsetX,
            vehicle.height * newConfig.hitbox.offsetY
        );
        vehicle.setPosition(x, y);
        this.scene.time.delayedCall(1500, () => {
            vehicle.setVelocityY(0);
        });
        vehicle.setVelocityY(speed);
    }

    shootProjectile() {
        const player = this.scene.player.Player;

        this.vehiclesUp.children.iterate(vehicle => {
            if (vehicle.y <= player.y + 50 && vehicle.y >= this.scene.Plataformas.layer2.y) {
                let projectile = this.projectiles.getFirstDead(false);
                if (!projectile) {
                    if (this.projectiles.getLength() < this.maxProjectiles) {
                        projectile = this.projectiles.create(vehicle.x, vehicle.y, 'projectile');
                        projectile.setScale(0.2);
                    }
                }
                if (projectile) {
                    if (this.projectileCollider) {
                        this.scene.physics.world.removeCollider(this.projectileCollider);
                    }
                    projectile.setActive(true).setVisible(true);
                    projectile.setPosition(vehicle.x, vehicle.y);
                    projectile.setVelocityY(-300); // Disparar hacia arriba
                    projectile.setVelocityX(Phaser.Math.Between(-50, 50)); // Rango de movimiento en X
                    projectile.body.setAllowGravity(true);
    
                    this.scene.time.delayedCall(1000, () => {
                        this.projectileCollider = this.scene.physics.add.collider(projectile, this.scene.Plataformas.layer2);
                    });
                }
            }
        });

        this.vehiclesDown.children.iterate(vehicle => {
            if (vehicle.y >= player.y && vehicle.y <= this.scene.cameras.main.height) {
                let projectile = this.projectiles.getFirstDead(false);
                if (!projectile) {
                    if (this.projectiles.getLength() < this.maxProjectiles) {
                        projectile = this.projectiles.create(vehicle.x, vehicle.y, 'projectile');
                        projectile.setScale(0.2);
                    }
                }
                if (projectile) {
                    if (this.projectileCollider) {
                        this.scene.physics.world.removeCollider(this.projectileCollider);
                    }
                    projectile.setActive(true).setVisible(true);
                    projectile.setPosition(vehicle.x, vehicle.y);
                    projectile.setVelocityY(-300); // Disparar hacia arriba
                    projectile.setVelocityX(Phaser.Math.Between(-50, 50)); // Rango de movimiento en X
                    projectile.body.setAllowGravity(true);
    
                    this.scene.time.delayedCall(1000, () => {
                        this.projectileCollider = this.scene.physics.add.collider(projectile, this.scene.Plataformas.layer2);
                    });
                }
            }
        });
        
    }

    handleProjectileCollision(projectile, player) {
        
    }
}