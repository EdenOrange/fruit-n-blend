Game.LevelSelect = function(game) {

}

Game.LevelSelect.prototype = {
    create: function() {
        game.stage.backgroundColor = '#ff6622';

        var nameLabel = game.add.text(80, 80, 'Disillusion', {font: '50px Arial', fill: '#ffffff'});
        var startLabel = game.add.text(80, game.world.height - 80, 'Press the "W" key to start', {font: '25px Arial', fill: '#ffffff'});

        var wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
        var eKey = game.input.keyboard.addKey(Phaser.Keyboard.E);

        wKey.onDown.addOnce(function(wKey){this.start(1)}, this);
        eKey.onDown.addOnce(function(eKey){this.start(2)}, this);
    },

    start: function(level) {
        game.state.start('game', true, false, level);
    }
}