Game.Title = function(game) {

}

Game.Title.prototype = {
    create: function() {
        var background = game.add.image(0, 0, 'title_background');

        var logo = game.add.image(game.world.width / 2, 225, 'title_logo');
        logo.anchor.set(0.5);

        var playButton = game.add.image(game.world.width / 2, 450, 'title_play');
        playButton.anchor.set(0.5);
        playButton.inputEnabled = true;
        playButton.events.onInputDown.addOnce(this.start);
    },

    start: function() {
        game.state.start('levelSelect');
    }
}