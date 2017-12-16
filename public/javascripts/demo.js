//todo 中心点 碰到 算赢
////可以改成重力

let urlPadding = "../images/";

window.onload = function() {

    //  Note that this html file is set to pull down Phaser 2.5.0 from the JS Delivr CDN.
    //  Although it will work fine with this tutorial, it's almost certainly not the most current version.
    //  Be sure to replace it with an updated version before you start experimenting with adding your own code.

    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'container', {
        preload: preload,
        create: create
    });
    var button;
    var background;
    var logo;
    var block;
    var blockStat = {
        x: [
            400 - 95 / 2,
            400 + 95 / 2
        ],
        y: [
            300 - 95 / 2,
            300 + 95 / 2
        ]
    }
    function preload() {

        game.load.image('logo', urlPadding + 'phaser.png');
        game.load.image('block', urlPadding + 'block.png');
        game.load.spritesheet('button', urlPadding + 'button_sprite_sheet.png', 193, 71);
        game.load.image('background', urlPadding + 'starfield.jpg');
    }

    function create() {

        //  sprite.anchor = { x:0.5, y:0.5 };

        game.stage.backgroundColor = '#182d3b';
        background = game.add.tileSprite(0, 0, 800, 600, 'background');

        block = game.add.sprite(400, game.world.centerY, 'block');
        block.anchor.setTo(0.5, 0.5);

        logo = game.add.sprite(100, 100, 'logo');
        logo.anchor.setTo(0.5, 0.5);
        logo.scale.setTo(0.2, 0.2)

        button = game.add.button(game.world.centerX - 95, 500, 'button', onUp, this, 1, 1, 0);

    }
    function onUp(button, pointer, isOver) {
        // console.log(arguments)

        //  In this example if the Pointer is no longer over the Button, then we'll treat it
        //  as if the user cancelled the operation and didn't want to press the Button after all

        if (isOver) {
            // logo.visible =! logo.visible;
            logo.position = {
                x: Math.random() * 800,
                y: Math.random() * 600
            }

        }

        console.log(logo.x, blockStat)
        if (logo.x >= blockStat.x[0] && logo.x <= blockStat.x[1]) {
            if (logo.y >= blockStat.y[0] && logo.y <= blockStat.y[1]) {

									alert('撞上啦~');


						}
        }
    }
};
