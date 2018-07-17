var game = new Phaser.Game(720, 1280, Phaser.AUTO, 'content');

game.state.add('boot', Game.Boot);
game.state.add('load', Game.Load);
game.state.add('title', Game.Title);
game.state.add('tutorial', Game.Tutorial);
game.state.add('levelSelect', Game.LevelSelect);
game.state.add('game', Game.Game);

game.state.start('boot');