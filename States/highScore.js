Game.HighScore = function(game) {

}

Game.HighScore.prototype = {
    create: function() {
        var background = game.add.image(-3, 0, 'highscore_background');
        var title = game.add.image(game.world.width / 2, 80, 'highscore_title');
        var page = game.add.image(game.world.width / 2, 600, 'highscore_page');
        var levelButton = game.add.image(game.world.width / 2, 900, 'highscore_level');

        title.anchor.set(0.5);

        page.anchor.set(0.5);

        levelButton.anchor.set(0.5);
        levelButton.inputEnabled = true;
        levelButton.events.onInputDown.addOnce(this.level);

        var highScore = [];
        var xRank = 160;
        var xJuiceCount = 240;
        var xJuice = 300;
        var xDate = 490;
        var yStart = 330;
        var yMargin = 100;
        var highScoreString = localStorage.getItem('highScore');
        var highScore = JSON.parse(highScoreString);
        // High Score format : [{"date": date, "juice": number}, ...]
        for (var i = 0; i < highScore.length; i++) {
            var highScoreRank = [];
            var y = yStart + yMargin * i;
            highScoreRank[0] = game.add.text(xRank, y, (i + 1).toString());
            highScoreRank[1] = game.add.text(xJuiceCount, y, highScore[i].juice);
            var juice = game.add.image(xJuice, y, 'highscore_juice');
            highScoreRank[2] = game.add.text(xDate, y, highScore[i].date);

            for (var j = 0; j < highScoreRank.length; j++) {
                highScoreRank[j].anchor.set(0.5);
                highScoreRank[j].font = "Poplar";
                highScoreRank[j].fontSize = "40px";
                highScoreRank[j].fontWeight = "Bold";
                highScoreRank[j].fill = "#ffffff";
                highScoreRank[j].stroke = "#000000";
                highScoreRank[j].strokeThickness = 5;
                highScoreRank[j].align = "center";
            }

            juice.anchor.set(0.5);
            juice.scale.set(0.35);
            juice.angle = 30;
        }
    },

    level: function() {
        game.state.start('levelSelect');
    }
}