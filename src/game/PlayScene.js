import { Scene } from "phaser";
import { Capacitor } from '@capacitor/core';
import clientSocketIO from './clientSocket';
// obtener audios
// https://pixabay.com/es/sound-effects/search/shields/
export class PlayScene extends Scene {
    constructor() {
        super({ key: 'PlayScene' })
    }

    static playerO
    static socketClientGame = new clientSocketIO();
    static players = {}; // Almacenar referencias a los jugadores
    static bullets = {}; // Almacenar referencias a los jugadores
    preload() {       
        this.load.plugin('rexvirtualjoystickplugin', 'assets/joyStick/plugins/rexvirtualjoystickplugin.min.js', true);
        this.load.image('buttonAD', 'assets/joyStick/buttons/darkA.png');
        this.load.image('buttonAW', 'assets/joyStick/buttons/whiteA.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.image('shield', 'assets/shield.png');
        this.load.image('heart', 'assets/heart.png');
        this.load.image('bullet', 'assets/bullet.png');
        this.load.image('platform', 'assets/platform.png');
        this.load.image('leftArrow', 'assets/leftarrow.png');
        this.load.image('rightArrow', 'assets/rightarrow.png');

        // creando imagen del player usando el socket id
        PlayScene.playerIMG = 'player';
        this.load.spritesheet(PlayScene.playerIMG, 'assets/player.png',
            { frameWidth: 32, frameHeight: 48 }
        );

        this.load.spritesheet('imgexplosion', 'assets/explosiona.png',
            { frameWidth: 192, frameHeight: 192 }
        );
        this.load.audio('shieldsup', 'assets/sounds/shieldsup.mp3');
        this.load.audio('shieldsdown', 'assets/sounds/shieldsdown.mp3');
        this.load.audio('shieldhit', 'assets/sounds/shieldhit.mp3');
        this.load.audio('shieldrecharge', 'assets/sounds/shieldrecharge.mp3');
        this.load.audio('heart', 'assets/sounds/heart.mp3');
        this.load.audio('levelup', 'assets/sounds/levelup.mp3');
        this.load.audio('getstart', 'assets/sounds/getstart.mp3');
        this.load.audio('gameover', 'assets/sounds/gameover.ogg');
        this.load.audio('battlestars', 'assets/sounds/battlestars.ogg');
        this.load.audio('explosion', 'assets/sounds/explosion.mp3');
        this.load.audio('hit', 'assets/sounds/hit.wav');
        this.load.audio('blaster', 'assets/sounds/blaster.mp3');
    }

    create() {
        this.seedMove = 200;
        // Eventos de joystick táctil para dispositivos móviles
        // Agrega soporte para múltiples punteros táctiles
        this.input.addPointer(3);
        this.typePlataform = this.validarTipoPlataforma();
        // sets game values based on screen size        
        this.screenWidth = this.scale.width;
        this.screenHeight = this.scale.height;
        this.screenCenterX = this.screenWidth / 2;
        this.controlsAreaHeight = this.screenHeight * 0.2;
        this.gameAreaHeight = this.screenHeight - this.controlsAreaHeight;
        let altoPlatform = this.gameAreaHeight + 117;
        let altoPlayer = this.gameAreaHeight + 100;
        let altoJoyStickX = 70;
        let altoJoyStickY = this.gameAreaHeight + 68;
        this.ultimaVezDisparo = 0;
        this.frecuenciaDisparo = 500;

        ///////////////////////////////////
        /////////Start audio///////////////
        ///////////////////////////////////
        this.battlestars = this.sound.add('battlestars');
        this.battlestars.play({ loop: true });

        this.shieldsup = this.sound.add('shieldsup');
        this.shieldsdown = this.sound.add('shieldsdown');
        this.shieldhit = this.sound.add('shieldhit');
        this.shieldrecharge = this.sound.add('shieldrecharge');
        this.heart = this.sound.add('heart');
        this.levelup = this.sound.add('levelup');
        this.getstart = this.sound.add('getstart');
        this.explosion = this.sound.add('explosion');
        this.hit = this.sound.add('hit');
        this.blaster = this.sound.add('blaster');
        this.gameover = this.sound.add('gameover');
        ///////////////////////////////////
        /////////End audio////////////////
        ///////////////////////////////////

        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('imgexplosion', { start: 0, end: 9 }),
            frameRate: 7,
            repeat: 0,
            hideOnComplete: true,
        });

        ///////////////////////////////////
        ////////Start Life & Shield////////
        ///////////////////////////////////
        // Crea el texto
        this.life = 100;
        this.lifeMax = 100;
        this.textLife = this.add.text(14, 14, 'Vida: ' + this.life + ' / ' + this.lifeMax, {
            fontSize: '12px',
            color: '#000',
            align: 'center',
        }).setOrigin(0, 0);

        this.activeShield = true;
        this.shield = 100;
        this.shieldMax = 100;
        this.textShield = this.add.text(14, 37, 'Escudo: ' + this.shield + ' / ' + this.shieldMax, {
            fontSize: '12px',
            color: '#fff',
            align: 'center',
        }).setOrigin(0, 0);

        this.experience = 0;
        this.experienceMax = 20;
        this.textExperience = this.add.text(14, 64, 'Exp.: ' + this.experience + ' / ' + this.experienceMax, {
            fontSize: '12px',
            // color: '#000000',
            color: '#fff',
            align: 'center',
        }).setOrigin(0, 0);

        this.score = 0;
        this.scoreText = this.add.text(14, 84, 'Score: 0', {
            fontSize: '16px', fill:
                '#fff'
        }).setOrigin(0, 0);

        this.currentLevel = 1;
        this.levelText = this.add.text(14, 104, 'Nivel: 1', {
            fontSize: '16px', fill:
                '#fff'
        }).setOrigin(0, 0);

        // Crear texto de nivel
        this.textoNivel = this.add.text(this.screenCenterX, this.screenHeight / 2, '', { fontFamily: 'Arial', fontSize: 64, color: '#ffffff' });
        this.textoNivel.setOrigin(0.5);
        // Coloca el texto por encima del rectángulo
        this.textLife.setDepth(101);
        this.textShield.setDepth(101);
        this.textExperience.setDepth(101);
        this.levelText.setDepth(101);
        this.scoreText.setDepth(101);
        this.textoNivel.setDepth(101);

        // Crea un rectángulo verde como fondo
        this.backgroundLife = this.add.rectangle(10, 10, this.calculateWidth(25), 20, 0xff0000);
        this.backgroundLife.setOrigin(0, 0); // Establece el punto de origen en la esquina superior izquierda
        // Agrega un borde verde al fondo
        this.backgroundLife.setStrokeStyle(2, 0x00ff00);
        this.backgroundLife.setDepth(100);

        // Crea un rectángulo azul como fondo
        this.backgroundShield = this.add.rectangle(10, 35, this.calculateWidth(25), 20, 0x0000ff);
        this.backgroundShield.setOrigin(0, 0);
        this.backgroundShield.setStrokeStyle(2, 0x0000ff);
        this.backgroundShield.setDepth(100);

        // Crea un rectángulo azul como fondo
        this.backgroundExperience = this.add.rectangle(10, 62, this.calculateWidth(25), 20, '');
        this.backgroundExperience.setOrigin(0, 0);
        this.backgroundExperience.setStrokeStyle(2, 0xffd200);
        this.backgroundExperience.setDepth(100);

        // Captura el evento de redimensionamiento de la ventana
        window.addEventListener('resize', this.handleResize());

        // Cambia el color de fondo inicialmente según el ancho
        this.changeBackgroundColorLife();

        // Maneja el redimensionamiento inicial de la ventana
        this.handleResize();



        // Captura el evento de tecla "Arriba" (Up)
        // this.input.keyboard.on('keydown-UP', () => {
        //     life('keydown-UP', 2);
        // });

        // // Captura el evento de tecla "Arriba" (Up)
        // this.input.keyboard.on('keydown-DOWN', () => {
        //     life('keydown-DOWN', 2);
        // });
        ///////////////////////////////////
        ////////End Life & Shield//////////
        ///////////////////////////////////

        //////////////////////////////
        ///////Start Background //////
        //////////////////////////////
        this.graphics = this.add.graphics();

        this.shapes = new Array(15).fill(null).map(
            () => new Phaser.Geom.Circle(Phaser.Math.Between(0, 600), Phaser.Math.Between(0, 400), Phaser.Math.Between(25, 75))
        );

        this.rect = Phaser.Geom.Rectangle.Clone(this.cameras.main);
        //////////////////////////////
        ///////End Background ////////
        //////////////////////////////


        // adds the player, platform, and controls
        this.platform = this.physics.add.staticImage(0, altoPlatform, 'platform');
        this.platform.displayWidth = this.scale.width;
        this.platform.setOrigin(0, 0).refreshBody();

        // se obtiene el SocketId local
        PlayScene.playerO = PlayScene.socketClientGame.getSocketId();
        // PlayScene.players[PlayScene.playerO] = this.physics.add.sprite(this.screenCenterX, altoPlayer, PlayScene.playerIMG);
        this.createPlayer(PlayScene.playerO, this.screenCenterX, altoPlayer);
        PlayScene.socketClientGame.sendEvent('player', [{screenCenterX: this.screenCenterX, altoPlayer: altoPlayer}]);
        
        PlayScene.socketClientGame.getEvent('player').then((otherPlayer) => {
            this.createPlayer(otherPlayer.socketId, otherPlayer.screenCenterX, otherPlayer.altoPlayer);
            // PlayScene.players[otherPlayer.socketId] = this.physics.add.sprite(otherPlayer.screenCenterX, otherPlayer.altoPlayer, PlayScene.playerIMG);
        }); 
 
        //////////////////////////////
        /////// Start Control ////////
        //////////////////////////////
        this.shootFire = false;
        if (this.typePlataform === 'movil') {
            this.joyStick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
                x: altoJoyStickX,
                y: altoJoyStickY,
                radius: 45,
                base: this.add.circle(0, 0, 50, 0x888888, 0.5),
                thumb: this.add.circle(0, 0, 25, 0xcccccc, 0.5),
                forceMin: 50,
            });
            this.shoot = this.add.image(this.screenWidth - 100, this.gameAreaHeight + 20, 'buttonAW').setOrigin(0, 0).setInteractive();
            this.shoot.alpha = 0.5;

            // event handlers for arrow input

            this.shoot.on('pointerdown', () => {
                this.shootFire = true;
            });
            this.shoot.on('pointerup', () => {
                this.shootFire = false;
            });
        }


        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        //////////////////////////////
        //////// End Control /////////
        //////////////////////////////

        // adds animations for player
        if (!this.anims.exists('left')) {
            this.anims.create({
                key: "left",
                frames: this.anims.generateFrameNumbers(PlayScene.playerIMG, { start: 0, end: 3 }),
                frameRate: 10,
                repeat: -1,
            });
        }

        if (!this.anims.exists('turn')) {
            this.anims.create({
                key: "turn",
                frames: [{ key: PlayScene.playerIMG, frame: 4 }],
            });
        }

        if (!this.anims.exists('right')) {
            this.anims.create({
                key: "right",
                frames: this.anims.generateFrameNumbers(PlayScene.playerIMG, { start: 5, end: 8 }),
                frameRate: 10,
                repeat: -1,
            });
        }

        // sets player physics
        PlayScene.players[PlayScene.playerO].body.setGravityY(300);
        PlayScene.players[PlayScene.playerO].setCollideWorldBounds(true);

        // crea escudo azul
        this.circle = this.add.circle(PlayScene.players[PlayScene.playerO].x, PlayScene.players[PlayScene.playerO].y, 35, 0x0000ff, 0.5); // Crea un círculo con color azul transparente
        this.circle.setDepth(1);


        // adds collider between player and platforms
        this.physics.add.collider(PlayScene.players[PlayScene.playerO], this.platform);

        // Adds generated shield
        this.shields = this.physics.add.group();

        // Adds generated heart
        this.hearts = this.physics.add.group();

        this.creeteBullets(PlayScene.playerO);

        // Adds generated stars
        this.stars = this.physics.add.group({
            gravityY: 300,
        });

        const createStar = () => {
            let x = Math.random() * this.screenWidth;
            if (x < 12) {
                x = 17;
            }
            if (x === this.screenWidth) {
                x = this.screenWidth - 17;
            }
            this.stars.create(x, 0, 'star');
        }

        const createStarLoop = this.time.addEvent({
            // random number between 1 and 1.2 seconds
            delay: Math.floor(Math.random() * (1200 - 1000 + 1)) + 1000,
            callback: createStar,
            callbackScope: this,
            loop: true,
        });

        // Adds generated bombs
        this.bombs = this.physics.add.group({
            gravityY: 900,
        });

        const createBomb = () => {
            let x = Math.random() * this.screenWidth;
            if (x < 12) {
                x = 17
            }
            if (x === this.screenWidth) {
                x = this.screenWidth - 17;
            }
            const bomb = this.bombs.create(x, 0, 'bomb');
            bomb.setScale(2).refreshBody();
        }

        const createBombLoop = this.time.addEvent({
            // random number between 4.5 and 5 seconds
            delay: Math.floor(Math.random() * (5000 - 4500 + 1)) + 500,
            // delay: Math.floor(Math.random() * (5000 - 4500 + 1)) + 4500, // controla la cantidad de bombas
            callback: createBomb,
            callbackScope: this,
            loop: true,
        });


        // Adds colliders between stars and bombs with platform
        this.physics.add.collider(this.stars, this.platform, function (object1, object2) {
            const star = (object1.key === 'star') ? object1 : object2;
            star.destroy();
        });

        this.physics.add.collider(this.bombs, this.platform, function (object1, object2) {
            const bomb = (object1.key === 'bomb') ? object1 : object2;
            bomb.destroy();
        });

        this.physics.add.collider(this.shields, this.platform, function (object1, object2) {
            const shield = (object1.key === 'shield') ? object1 : object2;
            shield.destroy();
        });

        this.physics.add.collider(this.hearts, this.platform, function (object1, object2) {
            const heart = (object1.key === 'heart') ? object1 : object2;
            heart.destroy();
        });

        // Habilitar la colisión entre las balas y la roca
        this.physics.add.collider(PlayScene.bullets[PlayScene.playerO], this.bombs, function (bombs, bullet) {
            // Destruir la bala y la roca al colisionar           
            bullet.destroy();
            getExp(bombs);
            bombs.destroy();
        });
        const getExp = (bombs) => {
            this.explosion.play();

            const imgexplosion = this.add.sprite(bombs.x, bombs.y, 'imgexplosion');
            imgexplosion.play('explode');

            this.experience += 10;
            this.textExperience.setText('Exp.: ' + this.experience + ' / ' + this.experienceMax);
            // this.experience = Phaser.Math.Clamp(this.experience, 0, 100);
            const maxWidth = this.calculateWidth(25);
            const minWidth = 0;
            const newWidth = Phaser.Math.Linear(minWidth, maxWidth, this.experience / this.experienceMax);
            this.backgroundExperience.setFillStyle(0xffd200);
            this.backgroundExperience.width = newWidth;
            if (this.backgroundExperience.width >= this.calculateWidth(12)) {
                this.textExperience.setColor('#000');
            } else {
                this.textExperience.setColor('#fff');
            }
            this.levelUp();
        }
        // Adds overlap between player and stars
        this.physics.add.overlap(PlayScene.players[PlayScene.playerO], this.stars, function (object1, object2) {
            this.getstart.play();
            const star = (object1.key === PlayScene.playerIMG) ? object1 : object2;
            star.destroy();
            this.score += 10;
            this.scoreText.setText('Score: ' + this.score);
            if (this.score >= 50 && this.score % 50 === 0) {
                this.spawnShield();
            }
            if (this.score >= 100 && this.score % 100 === 0) {
                this.spawnHeart();
            }
        }, null, this);

        this.physics.add.overlap(PlayScene.players[PlayScene.playerO], this.shields, function (object1, object2) {
            const shield = (object1.key === PlayScene.playerIMG) ? object1 : object2;
            shield.destroy();
            if (this.shield <= this.shieldMax) {
                this.lifes('keydown-UP', 2);
            }
        }, null, this);

        this.physics.add.overlap(PlayScene.players[PlayScene.playerO], this.hearts, function (object1, object2) {
            const hearts = (object1.key === PlayScene.playerIMG) ? object1 : object2;
            hearts.destroy();
            if (this.life <= this.lifeMax) {
                this.lifes('keydown-UP', 1);
            }
        }, null, this);

        // Adds overlap between player and bombs
        this.physics.add.overlap(PlayScene.players[PlayScene.playerO], this.bombs, function (object1, object2) {
            if (this.life !== 0) {
                let item = 1;
                if (this.activeShield) {
                    item = 2
                }
                this.lifes('keydown-DOWN', item);
            } else {
                this.battlestars.pause();
                this.gameover.play({ loop: true });
                const bomb = (object1.key === PlayScene.playerIMG) ? object1 : object2;
                bomb.destroy();
                createStarLoop.destroy();
                createBombLoop.destroy();
                this.shields.destroy();
                this.hearts.destroy();

                this.physics.pause();

                this.gameOverText = this.add.text(this.screenCenterX, this.screenHeight / 2, 'Game Over', { fontSize: '32px', fill: 'red' }).setOrigin(0.5, 0.5);

                this.input.on('pointerup', () => {
                    this.score = 0;
                    this.life = 100;
                    this.shield = 100;
                    this.experience = 0;
                    this.scene.restart();
                    this.gameover.pause();
                })
            }
        }, null, this);
    }

    createPlayer(socketId, screenCenterX, altoPlayer) {
        PlayScene.players[socketId] =  this.physics.add.sprite(screenCenterX, altoPlayer, PlayScene.playerIMG);
    }
    
    creeteBullets(socketId) {
        PlayScene.bullets[socketId] = this.physics.add.group();
    }
    update() {
        ///////////////////////////////////////////
        ////////Start moviemto del Player//////////
        ///////////////////////////////////////////
        let setVelocityX = 0;
        let moveRL = 'turn';
        let anims = false;
        if (this.typePlataform === 'movil') {
            let moveJoyStick = this.joyStick.createCursorKeys();
            if (this.cursors.left.isDown || moveJoyStick.left.isDown) {
                setVelocityX = -this.seedMove;
                play = 'left';
                anims = true;
            } else if (this.cursors.right.isDown || moveJoyStick.right.isDown) {
                setVelocityX = this.seedMove;
                play = 'right';
                anims = true;
            } else {
                setVelocityX = 0;
                play = 'turn';
                anims = null;
            }            
        } else {
            if (this.cursors.left.isDown) {
                setVelocityX = -this.seedMove;
                moveRL = 'left';
                anims = true;
            } else if (this.cursors.right.isDown) {
                setVelocityX = this.seedMove;
                moveRL = 'right';
                anims = true;
            } else {
                setVelocityX = 0;
                moveRL = 'turn';
                anims = false;
            }
        }
        PlayScene.players[PlayScene.playerO].setVelocityX(setVelocityX);
        if (anims) {
            PlayScene.players[PlayScene.playerO].anims.play(moveRL, true);
        } else {
            PlayScene.players[PlayScene.playerO].anims.play(moveRL);
        }
        PlayScene.socketClientGame.sendEvent('move', [{moveRL: moveRL, bool: anims, setVelocityX: setVelocityX}]);
        PlayScene.socketClientGame.getEvent('move').then((otherPlayer) => {
            if (PlayScene.players[otherPlayer.socketId] != undefined) {
                PlayScene.players[otherPlayer.socketId].setVelocityX(otherPlayer.setVelocityX);
                if (otherPlayer.bool) {
                    PlayScene.players[otherPlayer.socketId].anims.play(otherPlayer.moveRL, otherPlayer.bool);
                } else {
                    PlayScene.players[otherPlayer.socketId].anims.play(otherPlayer.moveRL);
                }
            } else {
                this.createPlayer(otherPlayer.socketId, this.screenCenterX, this.gameAreaHeight + 93);
                PlayScene.players[otherPlayer.socketId].setVelocityX(otherPlayer.setVelocityX);
                if (otherPlayer.bool) {
                    PlayScene.players[otherPlayer.socketId].anims.play(otherPlayer.moveRL, otherPlayer.bool);
                } else {
                    PlayScene.players[otherPlayer.socketId].anims.play(otherPlayer.moveRL);
                }
            }
        });
        /////////////////////////////////////////
        ////////End moviemto del Player//////////
        /////////////////////////////////////////

        ///////////////////////////////////
        ////////End Life & Shield//////////
        ///////////////////////////////////
        if (this.shield <= 0) {
            if (this.circle) {
                // this.circle.setFillStyle(0xff0000, 0.5); // Rojo transparente
                this.circle.destroy();
                this.circle = null; //Establecer a null para evitar errores si intentamos eliminarlo otra vez
            }
        }
        if (this.shield >= 100) {
            if (!this.circle) {
                this.circle = this.add.circle(PlayScene.players[PlayScene.playerO].x, PlayScene.players[PlayScene.playerO].y, 35, 0x0000ff, 0.5);
            }
        }
        if (this.circle) {
            // Actualizar la posición del círculo para que siga al jugador
            this.circle.setPosition(PlayScene.players[PlayScene.playerO].x, PlayScene.players[PlayScene.playerO].y);
        }
        ///////////////////////////////////
        ////////End Life & Shield//////////
        ///////////////////////////////////

        //////////////////////////////
        ////////Start Background /////
        //////////////////////////////
        this.shapes.forEach(function (shape, i) {
            shape.x += (1 + 0.1 * i);
            shape.y += (1 + 0.1 * i);
        });
        Phaser.Actions.WrapInRectangle(this.shapes, this.rect, 72);
        this.draw();
        //////////////////////////////
        ////////End Background ///////
        //////////////////////////////

        //////////////////////////////
        ///////// Start Fire /////////
        //////////////////////////////
        if ((this.spaceBar.isDown || this.shootFire) && this.obtenerTiempoActual() > this.ultimaVezDisparo + this.frecuenciaDisparo) {
            this.disparar();
            this.ultimaVezDisparo = this.obtenerTiempoActual();
        }
        PlayScene.socketClientGame.getEvent('disparar').then((otherPlayer) => {
            console.log(otherPlayer);
            console.log('disparar');
            if(PlayScene.bullets[otherPlayer.socketId] != undefined) {
                const balas = PlayScene.bullets[otherPlayer.socketId].create(otherPlayer.x, otherPlayer.y, 'bullet');
                this.blaster.play();
                balas.setVelocityY(-1000); // Velocidad de la bala
                balas.setAngle(-90);
                balas.setDisplaySize(40, 40);
            } else {
                this.creeteBullets(otherPlayer.socketId);
                const balas = PlayScene.bullets[otherPlayer.socketId].create(otherPlayer.x, otherPlayer.y, 'bullet');
                this.blaster.play();
                balas.setVelocityY(-1000); // Velocidad de la bala
                balas.setAngle(-90);
                balas.setDisplaySize(40, 40);
            }
        });
        //////////////////////////////
        ////////// End Fire //////////
        //////////////////////////////
    }
    // Locals methods, they are not part of Phaser.scene
    color(i) {
        if (this.esPar(i)) {
            return Math.floor(Math.random() * 16777215).toString(16);
        } else {
            return 0x001100 * (i % 15) + 0x000033 * (i % 5);
        }
    }
    draw() {
        this.graphics.clear();

        this.shapes.forEach((shape, i) => {
            this.graphics
                .fillStyle(this.color(i), 0.5)
                .fillCircleShape(shape);
        }, this);
    }
    esPar(numero) {
        if (numero % 2 === 0) {
            return true;
        } else {
            return false;
        }
    }
    spawnShield() {
        let x = Math.random() * this.screenWidth;
        if (x < 12) {
            x = 17
        }
        if (x === this.screenWidth) {
            x = this.screenWidth - 17;
        }
        const shield = this.shields.create(x, 0, 'shield');
        shield.setDisplaySize(50, 50);
        shield.setGravityY(100);
    }
    spawnHeart() {
        let x = Math.random() * this.screenWidth;
        if (x < 12) {
            x = 17
        }
        if (x === this.screenWidth) {
            x = this.screenWidth - 17;
        }
        const heart = this.hearts.create(x, 0, 'heart');
        heart.setDisplaySize(50, 50);
        heart.setGravityY(100);
    }
    validarTipoPlataforma() {
        const plataforma = Capacitor.getPlatform();
        if (plataforma === 'android' || plataforma === 'ios') {
            // console.log('La aplicación se está ejecutando en Android || iOS');
            return 'movil';
        } else if (plataforma === 'web') {
            // console.log('La aplicación se está ejecutando en la web');
            return 'web';
        } else {
            // console.log('La aplicación se está ejecutando en una plataforma desconocida');
        }
    }
    levelUp() {
        if (this.experience >= this.experienceMax) {
            this.levelup.play();
            const maxWidth = this.calculateWidth(25);
            const minWidth = 0;

            this.experience = 0;
            this.experienceMax *= 2;
            this.textExperience.setText('Exp.: ' + this.experience + ' / ' + this.experienceMax);
            const newWidthExperience = Phaser.Math.Linear(minWidth, maxWidth, this.experience / this.experienceMax);
            this.backgroundExperience.setFillStyle(0xffd200);
            this.backgroundExperience.width = newWidthExperience;
            if (this.backgroundExperience.width >= this.calculateWidth(12)) {
                this.textExperience.setColor('#000');
            } else {
                this.textExperience.setColor('#fff');
            }


            this.lifeMax += 10;
            this.life = this.lifeMax;
            this.textLife.setText('Vida: ' + this.life + ' / ' + this.lifeMax);
            const newWidthLife = Phaser.Math.Linear(minWidth, maxWidth, this.life / this.lifeMax);
            this.backgroundLife.width = newWidthLife;


            this.shieldMax += 5;
            this.shield = this.shieldMax;
            this.textShield.setText('Escudo: ' + this.shield + ' / ' + this.shieldMax);
            const newWidthShield = Phaser.Math.Linear(minWidth, maxWidth, this.shield / this.shieldMax);
            this.backgroundShield.width = newWidthShield;
            this.activeShield = true;


            this.currentLevel++;
            this.levelText.setText('Nivel: ' + this.currentLevel);


            this.textoNivel.setText('¡Nivel ' + this.currentLevel + '!');
            // Animación del texto de nivel (puedes ajustar la animación según tus preferencias)
            this.tweens.add({
                targets: this.textoNivel,
                alpha: 0,
                duration: 1000,
                ease: 'Power1',
                yoyo: true,
                onComplete: () => {
                    this.textoNivel.setText(''); // Borrar el texto después de la animación
                }
            });
        }
    }
    disparar() {
        const bala = PlayScene.bullets[PlayScene.playerO].create(PlayScene.players[PlayScene.playerO].x, PlayScene.players[PlayScene.playerO].y, 'bullet');
        this.blaster.play();
        console.log('disparar');
        bala.setVelocityY(-1000); // Velocidad de la bala
        bala.setAngle(-90);
        bala.setDisplaySize(40, 40);
        PlayScene.socketClientGame.sendEvent('disparar', [{x: PlayScene.players[PlayScene.playerO].x, y: PlayScene.players[PlayScene.playerO].y, bullet: 'bullet'}]);
    }
    obtenerTiempoActual() {
        return new Date().getTime();
    }
    // Calcula el ancho en píxeles basado en el porcentaje
    calculateWidth(percent) {
        return (this.scale.width * percent) / 100;
    }
    // Función para cambiar el color de fondo según el ancho
    changeBackgroundColorLife() {
        if (this.backgroundLife.width === this.calculateWidth(25)) {
            this.backgroundLife.setFillStyle(0x00ff00); // Cambia a verde
        } else if (this.backgroundLife.width === this.calculateWidth(18)) {
            this.backgroundLife.setFillStyle(0xffff00); // Cambia a amarillo
            this.textLife.setColor('#FF0000'); // Cambia el color del texto a rojo
        } else if (this.backgroundLife.width === this.calculateWidth(9)) {
            this.textLife.setColor('#fff'); // Cambia el color del texto a blanco
            this.backgroundLife.setFillStyle(0xff0000); // Cambia a rojo                
        }
    }
    // Función para actualizar el ancho del fondo según la vida
    updateBackgroundWidth() {
        const maxWidth = this.calculateWidth(25);
        const minWidth = 0;
        const newWidth = Phaser.Math.Linear(minWidth, maxWidth, this.life / this.lifeMax);
        this.backgroundLife.width = newWidth;
        this.changeBackgroundColorLife();
    }
    // Función para manejar el redimensionamiento de la ventana
    handleResize() {
        this.scale.resize(window.innerWidth, window.innerHeight);
        this.backgroundLife.width = this.calculateWidth(25);
        this.backgroundLife.height = 20;
        this.updateBackgroundWidth();
    }
    // suma o resta punto de vida o escudo
    lifes(life, item) {
        // item = [0: no action, 1: life, 2: shield]
        if (life === 'keydown-UP') {
            if (item === 1) {
                this.heart.play();
                if (this.life <= (this.lifeMax - 5)) {
                    this.life += 5;
                } else if (this.life >= this.lifeMax) {
                    this.life = this.lifeMax;
                }
                this.textLife.setText('Vida: ' + this.life + ' / ' + this.lifeMax);
                // Actualiza el ancho del fondo según la vida
                this.updateBackgroundWidth();
            } else if (item === 2) {
                if (this.shield <= (this.shieldMax - 5)) {
                    this.shield += 5;
                    this.shieldrecharge.play();
                } else if (this.shield >= this.shieldMax) {
                    this.shield = this.shieldMax;
                    this.shieldrecharge.play();
                }
                if (this.shield === 100) {
                    this.shieldsup.play();
                    this.activeShield = true;
                }
                this.textShield.setText('Escudo: ' + this.shield + ' / ' + this.shieldMax);
                const maxWidth = this.calculateWidth(25);
                const minWidth = 0;
                const newWidth = Phaser.Math.Linear(minWidth, maxWidth, this.shield / this.shieldMax);
                this.backgroundShield.width = newWidth;
            }
        } else {
            if (item === 1) {
                this.hit.play();
                this.life -= 5;
                this.textLife.setText('Vida: ' + this.life + ' / ' + this.lifeMax);
                // Actualiza el ancho del fondo según la vida
                this.updateBackgroundWidth();
            } else if (item === 2) {
                this.shield -= 5;
                if (this.shield === 0) {
                    this.shieldsdown.play();
                    this.activeShield = false;
                    this.shield = 0;
                    this.textShield.setText('Escudo: ' + this.shield + ' / ' + this.shieldMax);
                    this.backgroundShield.width = 0;
                }
                if (this.activeShield) {
                    this.shieldhit.play();
                    this.textShield.setText('Escudo: ' + this.shield + ' / ' + this.shieldMax);
                    const maxWidth = this.calculateWidth(25);
                    const minWidth = 0;
                    const newWidth = Phaser.Math.Linear(minWidth, maxWidth, this.shield / this.shieldMax);
                    this.backgroundShield.width = newWidth;
                }
            }
        }
    }
    // getExp() {
    //     this.experience += 10;
    //     this.textExperience.setText('Exp.: ' + this.experience + ' / ' + this.experienceMax);
    //     // this.experience = Phaser.Math.Clamp(this.experience, 0, 100);
    //     const maxWidth = this.calculateWidth(25);
    //     const minWidth = 0;
    //     const newWidth = Phaser.Math.Linear(minWidth, maxWidth, this.experience / this.experienceMax);
    //     this.backgroundExperience.setFillStyle(0xffd200);
    //     this.backgroundExperience.width = newWidth;
    //     if (this.backgroundExperience.width >= this.calculateWidth(12)) {
    //         this.textExperience.setColor('#000');
    //     } else {
    //         this.textExperience.setColor('#fff');
    //     }
    //     this.levelUp();
    // }
}