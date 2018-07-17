var Game = {}

Game.Boot = function(game) {

}

Game.Boot.prototype = {
    preload: function() {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
    },

    create: function() {
        game.state.start('load');
    }
}