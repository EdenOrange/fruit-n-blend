Game.Game = function(game) {

}

// Current level
var level;

// Board settings
var board = {
    size: 4,        // Board maximum size
    start: {
        x: 270,     // Board starting x-coordinate
        y: 850      // Board starting y-coordinate
    },
    margin: {
        x: 105,     // Board piece margin x-axis
        y: 105,     // Board piece margin y-axis
    },
    ask: {
        x: 100,     // Asking piece x-coordinate
        y: 810      // Asking piece y-coordinate
    }
}

// UI groups
var gameUI;
var pauseMenu;
// Input enabled Game UI array
var gameInputEnabledUI;

Game.Game.prototype = {
    init: function(level) {
        this.level = level;
    },

    create: function() {
        this.createGameUI();
        this.createPauseMenu();
        this.createNewGame();
    },

    createGameUI: function() {
        gameUI = game.add.group();
        gameInputEnabledUI = [];

        var background = game.add.image(0, 0, 'game_background');
        var blender = game.add.image(250, 420, 'game_blender');
        var fruitBasket = game.add.image(580, 480, 'game_fruit_basket');
        var juice = game.add.image(160, 35, 'game_juice');
        var time = game.add.image(400, 50, 'game_time');
        var pauseButton = game.add.image(660, 50, 'game_pause');

        blender.anchor.set(0.5);

        fruitBasket.anchor.set(0.5);

        juice.anchor.set(0.5);

        time.anchor.set(0.5);

        pauseButton.anchor.set(0.5);
        pauseButton.inputEnabled = true;
        pauseButton.events.onInputDown.add(this.pause, this);
        
        gameUI.addMultiple([background, blender, fruitBasket, juice, time, pauseButton]);
        gameInputEnabledUI.push(pauseButton);
    },

    createPauseMenu: function() {
        pauseMenu = game.add.group();
        
        var background = game.add.image(game.world.width / 2, 600, 'pause_background');
        var resumeButton = game.add.image(game.world.width / 2, 520, 'pause_resume');
        var restartButton = game.add.image(game.world.width / 2, 640, 'pause_restart');
        var quitButton = game.add.image(game.world.width / 2, 760, 'pause_quit');

        background.anchor.set(0.5);

        resumeButton.anchor.set(0.5);
        resumeButton.inputEnabled = true;
        resumeButton.events.onInputDown.add(this.resume, this);

        restartButton.anchor.set(0.5);
        restartButton.inputEnabled = true;
        restartButton.events.onInputDown.add(this.restart, this);
        
        quitButton.anchor.set(0.5);
        quitButton.inputEnabled = true;
        quitButton.events.onInputDown.add(this.quit, this);

        pauseMenu.addMultiple([background, resumeButton, restartButton, quitButton]);
        pauseMenu.visible = false;
    },

    createNewGame: function() {
        this.createBoard();
        this.createAsk();
    },

    createBoard: function() {
        // Create a new board
        for (var i = 0; i < board.size * board.size; i++) {
            var boardX = board.start.x + board.margin.x * (i % board.size);
            var boardY = board.start.y + board.margin.y * Math.floor(i / board.size);
            var piece;
            if ((i + Math.floor(i / board.size)) % 2 == 0) {
                piece = game.add.image(boardX, boardY, 'puzzle_empty_h');
            }
            else {
                piece = game.add.image(boardX, boardY, 'puzzle_grape_orange_v');
            }
            piece.anchor.set(0.5);
            piece.scale.set(1.3);

            gameUI.add(piece);
        }
    },

    createAsk: function() {
        var ask = game.add.image(board.ask.x, board.ask.y, 'puzzle_apple_purple_h_drop');
        ask.anchor.set(0.5);
        ask.scale.set(1.3);

        gameUI.add(ask);
    },

    pause: function() {
        // Add gray filter to Game UI
        var grayFilter = game.add.filter('Gray');
        gameUI.filters = [grayFilter];
        // Darken Game UI
        gameUI.setAll('tint', '0xaaaaaa');

        // Disable Game UI inputs
        gameInputEnabledUI.forEach(function (object) {
            object.inputEnabled = false;
        });

        // Show Pause Menu
        pauseMenu.visible = true;
        game.world.bringToTop(pauseMenu);
    },

    resume: function() {
        // Remove gray filter from Game UI
        gameUI.filters = null;
        // Lighten back up Game UI
        gameUI.setAll('tint', '0xffffff');
        
        // Enable Game UI inputs
        gameInputEnabledUI.forEach(function (object) {
            object.inputEnabled = true;
        });

        // Hide Pause Menu
        pauseMenu.visible = false;
    },

    restart: function() {
        this.createNewGame();
    },

    quit: function() {
        game.state.start('title');
    }
}