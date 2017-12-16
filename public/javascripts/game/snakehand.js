// var windowHeight = window.innerHeight,
//     windowWidth = window.innerWidth;
var windowHeight = 450,
    windowWidth =600;
window.onload = function() {
    var game;
    var urlPrefix = "../../images/snake/";
    game = new Phaser.Game(windowWidth, windowHeight, Phaser.AUTO, 'container');

    var Menu = {
            preload: function() {
                // 第一个参数是图像的别名
                // 第二个是文件的路径
                console.log(`${urlPrefix}menu.png`)
                game.load.image('menu', `${urlPrefix}menu.png`);

            },
            create() {
                // 添加一个精灵到你的游戏场景，这里的精灵将是游戏的标志
                // 参数为： 坐标X , 坐标Y ,图像名（见上图）
                this.add.button(0, 0, 'menu', this.startGame);
            },
            startGame() {
                game.state.start('Game');
            }
        }

        //s方向检测
        function deviceOrientationListener(event) {
            betadirection = Math.round(event.beta);
            gammadirection = Math.round(event.gamma);
        }

        if (window.DeviceOrientationEvent) {
            window.addEventListener("deviceorientation", deviceOrientationListener);
        } else {
            alert("您使用的浏览器不支持Device Orientation特性");
        }

        //e方向检测
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

        var Game = {

            preload: function() {
                // Here we load all the needed resources for the level.
                // In our case, that's just two squares - one for the snake body and one for the apple.
                game.load.image('snake', urlPrefix + 'snake.png');
                game.load.image('apple', urlPrefix + 'apple.png');

            },

            create: function() {

                // By setting up global variables in the create function, we initialise them on game start.
                // We need them to be globally available so that the update function can alter them.

                snake = []; // This will work as a stack, containing the parts of our snake
                apple = {}; // An object for the apple;
                squareSize = 15; // The length of a side of the squares. Our image is 15x15 pixels.
                score = 0; // Game score.
                speed = 0; // Game speed.
                updateDelay = 0; // A variable for control over update rates.
                direction = 'right'; // The direction of our snake.
                new_direction = null; // A buffer to store the new direction into.
                addNew = false; // A variable used when an apple has been eaten.

                // Set up a Phaser controller for keyboard input.
                // cursors = game.input.keyboard.createCursorKeys();
                game.physics.startSystem(Phaser.Physics.ARCADE);

                //  Set the world (global) gravity

                game.stage.backgroundColor = '#061f27';

                // Generate the initial snake stack. Our snake will be 10 elements long.
                for (var i = 0; i < 2; i++) {
                    snake[i] = game.add.sprite(150 + i * squareSize, 150, 'snake'); // Parameters are (X coordinate, Y coordinate, image)
                }

                game.physics.enable(snake, Phaser.Physics.ARCADE);

                // Genereate the first apple.
                this.generateApple();

                // Add Text to top of game.
                textStyle_Key = {
                    font: "bold 14px sans-serif",
                    fill: "#46c0f9",
                    align: "center"
                };
                textStyle_Value = {
                    font: "bold 18px sans-serif",
                    fill: "#fff",
                    align: "center"
                };

                // Score.
                game.add.text(30, 20, "SCORE", textStyle_Key);
                scoreTextValue = game.add.text(90, 18, score.toString(), textStyle_Value);
                // Speed.
                game.add.text(500, 20, "SPEED", textStyle_Key);
                speedTextValue = game.add.text(558, 18, speed.toString(), textStyle_Value);

            },

            update: function() {

                // Handle arrow key presses, while not allowing illegal direction changes that will kill the player.

                // if (cursors.right.isDown && direction!='left')
                // {
                //     new_direction = 'right';
                // }
                // else if (cursors.left.isDown && direction!='right')
                // {
                //     new_direction = 'left';
                // }
                // else if (cursors.up.isDown && direction!='down')
                // {
                //     new_direction = 'up';
                // }
                // else if (cursors.down.isDown && direction!='up')
                // {
                //     new_direction = 'down';
                // }

                var firstCell = snake[snake.length - 1]
                // firstCell.body.acceleration=new Phaser.Point(100,100);
                if (betadirection < 0 && gammadirection < 0 && direction!='down') {
                   new_direction = 'up';
                } else if (betadirection < 0 && gammadirection > 0 && direction!='left') {
                     new_direction = 'right';
                } else if (betadirection > 0 && gammadirection > 0 && direction!='up') {
                     new_direction = 'down';
                } else if (betadirection > 0 && gammadirection < 0 && direction!='right') {
                     new_direction = 'left';
                }
                // A formula to calculate game speed based on the score.
                // The higher the score, the higher the game speed, with a maximum of 10;
                speed = Math.min(10, Math.floor(score / 5));
                // Update speed value on game screen.
                speedTextValue.text = '' + speed;

                // Since the update function of Phaser has an update rate of around 60 FPS,
                // we need to slow that down make the game playable.

                // Increase a counter on every update call.
                updateDelay++;

                // Do game stuff only if the counter is aliquot to (10 - the game speed).
                // The higher the speed, the more frequently this is fulfilled,
                // making the snake move faster.
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
                        snake.unshift(game.add.sprite(oldLastCellx, oldLastCelly, 'snake'));
                        addNew = false;
                    }
                    game.physics.enable(snake, Phaser.Physics.ARCADE);

                    // Check for apple collision.
                    this.appleCollision();

                    // Check for collision with self. Parameter is the head of the snake.
                    this.selfCollision(firstCell);

                    // Check with collision with wall. Parameter is the head of the snake.
                    this.wallCollision(firstCell);
                }

            },

            generateApple: function() {

                // Chose a random place on the grid.
                // X is between 0 and 585 (39*15)
                // Y is between 0 and 435 (29*15)

                var randomX = Math.floor(Math.random() * (windowWidth/15)) * squareSize,
                    randomY = Math.floor(Math.random() * (windowHeight/15)) * squareSize;

                // Add a new apple.
                apple = game.add.sprite(randomX, randomY, 'apple');
            },

            appleCollision: function() {

                // Check if any part of the snake is overlapping the apple.
                // This is needed if the apple spawns inside of the snake.
                for (var i = 0; i < snake.length; i++) {
                    if (snake[i].x == apple.x && snake[i].y == apple.y) {

                        // Next time the snake moves, a new block will be added to its length.
                        addNew = true;

                        // Destroy the old apple.
                        apple.destroy();

                        // Make a new one.
                        this.generateApple();

                        // Increase score.
                        score++;

                        // Refresh scoreboard.
                        scoreTextValue.text = score.toString();

                    }
                }

            },

            selfCollision: function(head) {

                // Check if the head of the snake overlaps with any part of the snake.
                for (var i = 0; i < snake.length - 1; i++) {
                    if (head.x == snake[i].x && head.y == snake[i].y) {

                      console.error('selfCollision')
                        // If so, go to game over screen.
                        game.state.start('Game_Over');
                    }
                }

            },

            wallCollision: function(head) {

                // Check if the head of the snake is in the boundaries of the game field.

                if (head.x >= windowWidth || head.x < 0 || head.y >= windowHeight || head.y < 0) {

                    // If it's not in, we've hit a wall. Go to game over screen.
                    game.state.start('Game_Over');
                }

            }

        };

        var Game_Over = {

            preload: function() {
                // 加载所需的图像资源
                game.load.image('gameover', urlPrefix + 'gameover.png');
            },

            create: function() {

                // 创建一个按钮 和开始游戏菜单的一样。
                this.add.button(0, 0, 'gameover', this.startGame, this);

                // 添加游戏的分数等文本信息。
                game.add.text(235, 350, "LAST SCORE", {
                    font: "bold 16px sans-serif",
                    fill: "#46c0f9",
                    align: "center"
                });
                game.add.text(350, 348, score.toString(), {
                    font: "bold 20px sans-serif",
                    fill: "#fff",
                    align: "center"
                });

            },

            startGame: function() {

                // 改变状态返回游戏。
                this.state.start('Game');

            }

        };

        // 第一个参数是我们的状态将如何被调用。
        // 第二个参数是一个对象，该对象包含需要的状态函数方法
        game.state.add('Menu', Menu);
        // 增加游戏状态.
        game.state.add('Game', Game);
        game.state.add('Game_Over', Game_Over);

        game.state.start('Menu');
    }
