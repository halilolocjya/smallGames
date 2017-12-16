var windowHeight = 450,
    windowWidth = 600;
var stage
var ticker
var urlPrefix = "../../images/snake/";
var queue,
    loader
var snake,
    apple,
    betadirection = 0,
    gammadirection = 0,
    squareSize,
    score,
    speed,
    updateDelay,
    direction,
    new_direction,
    addNew,
    cursors,
    scoreTextValue,
    speedTextValue,
    textStyle_Key,
    pad,
    stick,
    textStyle_Value;
let textScoreValue,
    textScoreKey,
    textSpeedKey,
    textSpeedValue,
		supdate=null;

window.onload = function() {

    function initStage() {
        stage = new Hilo.Stage({renderType: 'canvas', container: document.getElementById('container'), width: 600, height: 450});

        ticker = new Hilo.Ticker(60);
        ticker.addTick(stage);
        ticker.start();

        stage.enableDOMEvent(Hilo.event.POINTER_START, true);
				//舞台更新
        stage.onUpdate = onUpdate.bind(window);
        loader = new Hilo.LoadQueue();
        // queue.maxConnections = 2; //设置同时下载的最大连接数，默认为2
        loader.add([
            {
                id: 'menu',
                src: `${urlPrefix}menu.png`
            }, {
                id: 'snake',
                src: `${urlPrefix}snake.png`
            }, {
                id: 'apple',
                src: `${urlPrefix}apple.png`
            }, {
                id: 'gameover',
                src: `${urlPrefix}gameover.png`
            }
        ]);
        loader.on('load', function(e) {
            console.log('load:', e.detail);
        });
        loader.on('error', function(e) {
            console.log('error:', e.detail);
        });
        loader.on('complete', function(e) {
            console.log('complete:', loader.getLoaded());

            var bg = loader.getContent('menu');
            console.log(bg);
            new StartGame();
        });
        loader.start();

    }
		function onUpdate(){

			if(supdate!==null){
				supdate.update();
			}
		}

    var StartGame = function() {
        console.log(loader.get('menu').src)

        this.Menu()
    }
    StartGame.prototype = {

        Menu() {
            //按钮只是声明 事件需要单独绑定
            var that = this;
            var gameButton = new Hilo.Button({image: loader.get('menu').src, upState: {}, overState: {}, downState: {}, disabledState: {}})
            // .addTo(stage);
            gameButton.x = 0;
            gameButton.y = 0;
            stage.addChild(gameButton);
            //建议使用Hilo.event.POINTER_START, Hilo.event.POINTER_MOVE, Hilo.event.POINTER_END，它在pc上对应mousemove, mouseup, mousedonw, 在手机上对应touchstart, touchmove, touchend
            gameButton.on(Hilo.event.POINTER_START, function(e) {
                that.Game();
            });

        },
        Game() {
            supdate=new GameStart()

        }

    }

		var Game_Over=function(){

		}
		Game_Over.prototype={
			init(){
				let go=new Hilo.Button({image:loader.get('gameover').src})
				go.x=0;
				go.y=0;

				let text=new Hilo.Text({
					font: "bold 16px sans-serif",
					color: "#46c0f9",
					align: "center",
					text:'LAST SCORE',
					x:235,
					y:350
				})
				let text1=new Hilo.Text({
					font:"bold 20px sans-serif",
					color: "#46c0f9",
					align: "center",
					text: score.toString(),
					x:350,
					y:348
				})
				stage.addChild(go,text,text1);

				go.on(Hilo.event.POINTER_START, function(e) {
						supdate=new GameStart()
				});
			}
		}



    var GameStart = function() {
        this.initBg()
    }
    GameStart.prototype = {
        initBg: function() {

					snake = []; // This will work as a stack, containing the parts of our snake
					apple = {}; // An object for the apple;
					squareSize = 15; // The length of a side of the squares. Our image is 15x15 pixels.
					score = 0; // Game score.
					speed = 0; // Game speed.
					updateDelay = 0; // A variable for control over update rates.
					direction = 'right'; // The direction of our snake.
					new_direction = null; // A buffer to store the new direction into.
					addNew = false; // A variable used when an apple has been eaten.
            var that = this;
            let gameBg = new Hilo.View({background: '#061f27', width: windowWidth, height: windowHeight})
            stage.addChild(gameBg);

            for (var i = 0; i < 2; i++) {
                let sbody = new Hilo.Bitmap({image: loader.get('snake').src})
                    sbody.x = 150 + i * squareSize,
                    sbody.y = 150
                    snake[i] = sbody
                    stage.addChild(sbody); // Parameters are (X coordinate, Y coordinate, image)
                }
                let textStyle_Key = {
                        font: "bold 14px sans-serif",
                        color: "#46c0f9",
                        align: "center"
                    },
                    textStyle_Value = {
                        font: "bold 18px sans-serif",
                        color: "#fff",
                        align: "center"
                    };
                textScoreKey = new Hilo.Text(Object.assign(textStyle_Key, {
                    x: 30,
                    y: 20
                }))
                textScoreKey.text = 'SCORE'
                textScoreValue = new Hilo.Text(Object.assign(textStyle_Value, {
                    x: 90,
                    y: 18
                }))
                textScoreValue.text = "0"
                textSpeedKey = new Hilo.Text(Object.assign(textStyle_Key, {
                    x: 500,
                    y: 20
                }))
                textSpeedKey.text = "SPEED"

                textSpeedValue = new Hilo.Text(Object.assign(textStyle_Value, {
                    x: 558,
                    y: 18
                }))
                textSpeedValue.text = "0"

                //BitmapText（位图文本） 与text（纯文本）区别
                stage.addChild(textScoreKey, textScoreValue, textSpeedValue, textSpeedKey)

                // Genereate the first apple.
                that.generateApple();

                that.listenMoveByKeyCode();
            },

            generateApple() {
                // Chose a random place on the grid.
                // X is between 0 and 585 (39*15)
                // Y is between 0 and 435 (29*15)

                var randomX = Math.floor(Math.random() * (windowWidth / 15)) * squareSize,
                    randomY = Math.floor(Math.random() * (windowHeight / 15)) * squareSize;

                // Add a new apple.randomX, randomY, 'apple'
                apple = new Hilo.Bitmap({image: loader.get('apple').src});
                apple.x = randomX,
                apple.y = randomY;

                stage.addChild(apple)

            },
            listenMoveByKeyCode() {
                //键盘事件

                var that = this;
                document.addEventListener('keydown', function(e) {
                    switch (e.keyCode) {
                        case 37:
                            if (direction != 'right') {
                                new_direction = 'left';
                            }
                            break;
                            //左

                        case 39:
                            if (direction != 'left') {
                                new_direction = 'right';
                            }
                            break; //右
                        case 38:
                            if (direction != 'down') {
                                new_direction = 'up';
                            }
                            break;
                            //上
                        case 40:
                            if (direction != 'up') {
                                new_direction = 'down';
                            }
                            break; //下


                    }


                })

            },

            update() {
                let that = this;
                speed = Math.min(10, Math.floor(score / 5));
                // Update speed value on game screen.
                textSpeedValue.text = '' + speed;

                // Since the update function of Phaser has an update rate of around 60 FPS,
                // we need to slow that down make the game playable.

                // Increase a counter on every update call.

                // Do game stuff only if the counter is aliquot to (10 - the game speed).
                // The higher the speed, the more frequently this is fulfilled,
                // making the snake move faster.
                  updateDelay++;
                if (updateDelay % (10 - speed) == 0) {

                    // Snake movement

                    var firstCell = snake[snake.length - 1],
                        lastCell = snake.shift(),
                        oldLastCellx = lastCell.x,
                        oldLastCelly = lastCell.y;

                    // If a new direction has been chosen from the keyboard, make it the direction of the snake now.
                    if (new_direction) {
                        direction = new_direction;
                        new_direction = null;
                    }

                    // Change the last cell's coordinates relative to the head of the snake, according to the direction.

                    if (direction == 'right') {

                        lastCell.x = firstCell.x + 15;
                        lastCell.y = firstCell.y;
                    } else if (direction == 'left') {
                        lastCell.x = firstCell.x - 15;
                        lastCell.y = firstCell.y;
                    } else if (direction == 'up') {
                        lastCell.x = firstCell.x;
                        lastCell.y = firstCell.y - 15;
                    } else if (direction == 'down') {
                        lastCell.x = firstCell.x;
                        lastCell.y = firstCell.y + 15;
                    }

                    // Place the last cell in the front of the stack.
                    // Mark it as the first cell.

                    snake.push(lastCell);
                    firstCell = lastCell;

                    // End of snake movement.


                    // Increase length of snake if an apple had been eaten.
                    // Create a block in the back of the snake with the old position of the previous last block (it has moved now along with the rest of the snake).
                    if (addNew) {
                        let newOne = new Hilo.Bitmap({image: loader.get('snake').src})
                            newOne.x = oldLastCellx,
                            newOne.y = oldLastCelly
                            snake.unshift(newOne);
                            addNew = false;
															stage.addChild(newOne)
                        }

                        // game.physics.enable(snake, Phaser.Physics.ARCADE);

                        // Check for apple collision.
                        that.appleCollision();

                        // Check for collision with self. Parameter is the head of the snake.
                        that.selfCollision(firstCell);

                        // Check with collision with wall. Parameter is the head of the snake.
                        that.wallCollision(firstCell);

                    }


                },

                appleCollision: function() {

										let that=this;
                    // Check if any part of the snake is overlapping the apple.
                    // This is needed if the apple spawns inside of the snake.
                    for (var i = 0; i < snake.length; i++) {
                        if (snake[i].x == apple.x && snake[i].y == apple.y) {

                            // Next time the snake moves, a new block will be added to its length.
                            addNew = true;

                            // Destroy the old apple.
                            apple.removeFromParent();

                            // Make a new one.
                            that.generateApple();

                            // Increase score.
                            score++;

                            // Refresh scoreboard.
                            textScoreValue.text = score.toString();

                        }
                    }

                },

                selfCollision: function(head) {

                    // Check if the head of the snake overlaps with any part of the snake.
                    for (var i = 0; i < snake.length - 1; i++) {
                        if (head.x == snake[i].x && head.y == snake[i].y) {

                            console.error('selfCollision')
                            // If so, go to game over screen.
                          new Game_Over().init();
                        }
                    }

                },

                wallCollision: function(head) {

                    // Check if the head of the snake is in the boundaries of the game field.

                    if (head.x >= windowWidth || head.x < 0 || head.y >= windowHeight || head.y < 0) {

                        // If it's not in, we've hit a wall. Go to game over screen.
                          new Game_Over().init();
                    }

                }
            }

            initStage();
        }
