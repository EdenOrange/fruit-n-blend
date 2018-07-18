Game.Title = function(game) {

}

Game.Title.prototype = {
    create: function() {
        var background = game.add.image(0, 0, 'title_background');
        var logo = game.add.image(game.world.width / 2, 225, 'title_logo');
        var playButton = game.add.image(game.world.width / 2, 450, 'title_play');
        var tutorialButton = game.add.image(660, 135, 'title_tutorial');

        logo.anchor.set(0.5);

        playButton.anchor.set(0.5);
        playButton.inputEnabled = true;
        playButton.events.onInputDown.addOnce(this.start);

        tutorialButton.anchor.set(0.5);
        tutorialButton.inputEnabled = true;
        tutorialButton.events.onInputDown.addOnce(this.tutorial);
    },

    start: function() {
        game.state.start('levelSelect');
    },

    tutorial: function() {
        game.state.start('tutorial');
    }
}