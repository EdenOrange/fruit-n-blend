Game.Load = function(game) {

}

Game.Load.prototype = {
    preload: function() {
        var loadingLabel = game.add.text(80, 150, 'loading...', {font: '30px Courier', fill: '#ffffff'});

        // game.load.image('gear', 'Assets/gear_white.png');
    },

    create: function() {
        game.state.start('menu');
    }
}