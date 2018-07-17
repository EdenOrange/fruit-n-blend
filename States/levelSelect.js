Game.LevelSelect = function(game) {

}

var levelsUnlocked = 3;

var juiceStartX = 165;
var juiceStartY = 420;
var juiceMarginX = 130;
var juiceMarginY = 215;

Game.LevelSelect.prototype = {
    create: function() {
        var background = game.add.image(0, 0, 'level_background');

        var title = game.add.image(game.world.width / 2, 100, 'level_title');
        title.anchor.set(0.5);

        var page = game.add.image(game.world.width / 2, 600, 'level_page');
        page.anchor.set(0.5);

        for (let i = 0; i < 8; i++) {
            var juiceX = juiceStartX + juiceMarginX * (i % 4);
            var juiceY = juiceStartY + juiceMarginY * Math.floor(i / 4);
            var juice;
            if (i < levelsUnlocked) {
                juice = game.add.image(juiceX, juiceY, 'level_juice');
                juice.scale.set(1.05);
                var text = game.add.text(juiceX, juiceY, (i+1).toString(), {font: 'bold 50px Poplar', fill: '#ffffff', stroke: '#000000', strokeThickness: 5});
                text.anchor.set(0.5, -0.1);
                juice.inputEnabled = true;
                juice.events.onInputDown.addOnce(function(){this.loadLevel(i+1)}, this);
            }
            else {
                juice = game.add.image(juiceX, juiceY, 'level_juice_empty');
            }
            juice.anchor.set(0.5);
        }
    },

    loadLevel: function(level) {
        game.state.start('game', true, false, level);
    }
}