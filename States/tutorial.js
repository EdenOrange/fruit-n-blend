Game.Tutorial = function(game) {

}

Game.Tutorial.prototype = {
    create: function() {
        var tutorial = game.add.image(0, 0, 'tutorial');
        var continueButton = game.add.image(550, 950, 'tutorial_continue');

        continueButton.anchor.set(0.5);
        continueButton.inputEnabled = true;
        continueButton.events.onInputDown.addOnce(this.start, this);
    },

    start: function() {
        game.state.start('levelSelect');
    }
}