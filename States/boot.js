var Game = {}

Game.Boot = function(game) {

}

Game.Boot.prototype = {
    preload: function() {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;

        // Loading screen asset load
        game.load.image('loading_background', 'Assets/Level Select/background.png');
        game.load.spritesheet('loading_blender', 'Assets/Game/spritesheet blender.png', 651 / 3, 616 / 2, 6);
    },

    create: function() {
        game.state.start('load');
    }
}