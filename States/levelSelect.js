Game.LevelSelect = function(game) {

}

var levelsUnlocked;

var juiceStartX = 165;
var juiceStartY = 420;
var juiceMarginX = 130;
var juiceMarginY = 215;

Game.LevelSelect.prototype = {
    create: function() {
        var background = game.add.image(-3, 0, 'level_background');
        var title = game.add.image(game.world.width / 2, 100, 'level_title');
        var page = game.add.image(game.world.width / 2, 600, 'level_page');
        var highScoreButton = game.add.image(game.world.width / 2, 880, 'level_highscore');

        title.anchor.set(0.5);

        page.anchor.set(0.5);

        highScoreButton.anchor.set(0.5);
        highScoreButton.inputEnabled = true;
        highScoreButton.events.onInputDown.add(this.highScore);

        // Get levels unlocked from local storage
        levelsUnlocked = localStorage.getItem('levelsUnlocked');
        if (levelsUnlocked == null) {
            localStorage.setItem('levelsUnlocked', 1);
            levelsUnlocked = 1;
        }

        // Add juices
        for (let i = 0; i < 8; i++) {
            var juiceX = juiceStartX + juiceMarginX * (i % 4);
            var juiceY = juiceStartY + juiceMarginY * Math.floor(i / 4);
            var juice;
            if (i < levelsUnlocked) {
                juice = game.add.image(juiceX, juiceY, 'level_juice');
                juice.scale.set(1.05);
                juice.inputEnabled = true;
                juice.events.onInputDown.addOnce(function(){this.loadLevel(i+1)}, this);
                // Level text on juice
                var text = game.add.text(juiceX, juiceY, (i+1).toString(), {font: 'bold 50px Poplar', fill: '#ffffff', stroke: '#000000', strokeThickness: 5});
                text.anchor.set(0.5, -0.1);
            }
            else {
                juice = game.add.image(juiceX, juiceY, 'level_juice_empty');
            }
            juice.anchor.set(0.5);
        }
    },

    loadLevel: function(level) {
        game.state.start('game', true, false, level);
    },

    highScore: function() {
        game.state.start('highScore');
    }
}