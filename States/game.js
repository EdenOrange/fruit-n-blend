Game.Game = function(game) {

}

var level;

Game.Game.prototype = {
    init: function(level) {
        this.level = level;
    },

    create: function() {
        if (this.level == 1) {
            game.stage.backgroundColor = '#333333';
        }
        else {
            game.stage.backgroundColor = '#888888';
        }

        var gameLabel = game.add.text(80, 80, 'Game', {font: '50px Arial', fill: '#ffffff'});

        var wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);

        wKey.onDown.addOnce(this.menu, this);
    },

    menu: function() {
        game.state.start('menu');
    }
}