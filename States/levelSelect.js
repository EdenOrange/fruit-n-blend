Game.LevelSelect = function(game) {

}

var levelsUnlocked;

var currentPage = 0;
var juicesPerPage = 8;

var juiceStartX = 165;
var juiceStartY = 420;
var juiceMarginX = 130;
var juiceMarginY = 215;

var juiceGroup;

Game.LevelSelect.prototype = {
    init: function(pageNumber) {
        currentPage = pageNumber;
    },

    create: function() {
        // Get levels unlocked from local storage
        levelsUnlocked = localStorage.getItem('levelsUnlocked');
        if (levelsUnlocked == null) {
            localStorage.setItem('levelsUnlocked', 1);
            levelsUnlocked = 1;
        }
        
        var background = game.add.image(-3, 0, 'level_background');
        var title = game.add.image(game.world.width / 2, 100, 'level_title');
        var page = game.add.image(game.world.width / 2, 600, 'level_page');
        var highScoreButton = game.add.image(game.world.width / 2, 880, 'level_highscore');
        var nextPageButton = game.add.image(550, 880, 'level_next');
        var previousPageButton = game.add.image(170, 880, 'level_previous');

        title.anchor.set(0.5);

        page.anchor.set(0.5);

        highScoreButton.anchor.set(0.5);
        highScoreButton.inputEnabled = true;
        highScoreButton.events.onInputDown.add(this.highScore);

        nextPageButton.anchor.set(0.5);
        if (levelsUnlocked > ((currentPage + 1) * juicesPerPage)) {
            nextPageButton.inputEnabled = true;
            nextPageButton.events.onInputDown.add(function(){game.state.start('levelSelect', true, false, currentPage + 1)});
        }
        else {
            nextPageButton.alpha = 0.5;
        }

        previousPageButton.anchor.set(0.5);
        if (currentPage > 0) {
            previousPageButton.inputEnabled = true;
            previousPageButton.events.onInputDown.add(function(){game.state.start('levelSelect', true, false, currentPage - 1)});
        }
        else {
            previousPageButton.alpha = 0.5;
        }
    
        this.drawJuices();
    },

    drawJuices: function() {
        if (juiceGroup != null) {
            juiceGroup.destroy();
        }
        juiceGroup = game.add.group();
        
        for (let i = 0; i < juicesPerPage; i++) {
            var juiceX = juiceStartX + juiceMarginX * (i % 4);
            var juiceY = juiceStartY + juiceMarginY * Math.floor(i / 4);
            var juice;
            var juiceLevel = currentPage * juicesPerPage + i + 1;
            if (juiceLevel - 1 < levelsUnlocked) {
                juice = game.add.image(juiceX, juiceY, 'level_juice');
                juice.scale.set(1.05);
                juice.inputEnabled = true;
                juice.events.onInputDown.add(function(){this.loadLevel(juiceLevel)}, this);
                // Level text on juice
                var text = game.add.text(juiceX, juiceY, juiceLevel.toString(), {font: 'bold 50px Poplar', fill: '#ffffff', stroke: '#000000', strokeThickness: 5});
                text.anchor.set(0.5, -0.1);
            }
            else {
                juice = game.add.image(juiceX, juiceY, 'level_juice_empty');
            }
            juice.anchor.set(0.5);
            juiceGroup.add(juice);
        }
    },

    loadLevel: function(level) {
        game.state.start('game', true, false, level);
    },

    highScore: function() {
        game.state.start('highScore');
    }
}