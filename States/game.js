Game.Game = function(game) {

}

// Current level
var level = 1;

// Board settings
var board = {
    /* size-4
    size: 4,        // Board maximum size
    start: {
        x: 270,     // Board starting x-coordinate
        y: 850      // Board starting y-coordinate
    },
    margin: {
        x: 105,     // Board piece margin x-axis
        y: 105,     // Board piece margin y-axis
    },
    scale: 1.3,     // Board piece scale
    ask: {
        x: 100,     // Asking piece x-coordinate
        y: 810      // Asking piece y-coordinate
    }
    */

    // /* size-5
    size: 5,        // Board maximum size
    start: {
        x: 250,     // Board starting x-coordinate
        y: 790      // Board starting y-coordinate
    },
    margin: {
        x: 95,     // Board piece margin x-axis
        y: 95,     // Board piece margin y-axis
    },
    scale: 1.2,     // Board piece scale
    ask: {
        x: 90,     // Asking piece x-coordinate
        y: 800      // Asking piece y-coordinate
    }
    // */
}
// Board pieces
var piecesHorizontal = [];
var piecesHorizontalDrop = [];
var pieceHorizontalEmpty;
var piecesVertical = [];
var piecesVerticalDrop = [];
var pieceVerticalEmpty;

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
        this.setupPieces();
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

    setupPieces: function() {
        // Horizontal pieces
        piecesHorizontal.push('puzzle_apple_brown_h');
        piecesHorizontal.push('puzzle_apple_purple_h');
        piecesHorizontal.push('puzzle_apple_orange_h');
        piecesHorizontal.push('puzzle_grape_brown_h');
        piecesHorizontal.push('puzzle_grape_purple_h');
        piecesHorizontal.push('puzzle_grape_orange_h');
        piecesHorizontal.push('puzzle_pineapple_brown_h');
        piecesHorizontal.push('puzzle_pineapple_purple_h');
        piecesHorizontal.push('puzzle_pineapple_orange_h');
        // Horizontal drop pieces
        piecesHorizontalDrop.push('puzzle_apple_brown_h_drop');
        piecesHorizontalDrop.push('puzzle_apple_purple_h_drop');
        piecesHorizontalDrop.push('puzzle_apple_orange_h_drop');
        piecesHorizontalDrop.push('puzzle_grape_brown_h_drop');
        piecesHorizontalDrop.push('puzzle_grape_purple_h_drop');
        piecesHorizontalDrop.push('puzzle_grape_orange_h_drop');
        piecesHorizontalDrop.push('puzzle_pineapple_brown_h_drop');
        piecesHorizontalDrop.push('puzzle_pineapple_purple_h_drop');
        piecesHorizontalDrop.push('puzzle_pineapple_orange_h_drop');
        // Vertical pieces
        piecesVertical.push('puzzle_apple_brown_v');
        piecesVertical.push('puzzle_apple_purple_v');
        piecesVertical.push('puzzle_apple_orange_v');
        piecesVertical.push('puzzle_grape_brown_v');
        piecesVertical.push('puzzle_grape_purple_v');
        piecesVertical.push('puzzle_grape_orange_v');
        piecesVertical.push('puzzle_pineapple_brown_v');
        piecesVertical.push('puzzle_pineapple_purple_v');
        piecesVertical.push('puzzle_pineapple_orange_v');
        // Vertical drop pieces
        piecesVerticalDrop.push('puzzle_apple_brown_v_drop');
        piecesVerticalDrop.push('puzzle_apple_purple_v_drop');
        piecesVerticalDrop.push('puzzle_apple_orange_v_drop');
        piecesVerticalDrop.push('puzzle_grape_brown_v_drop');
        piecesVerticalDrop.push('puzzle_grape_purple_v_drop');
        piecesVerticalDrop.push('puzzle_grape_orange_v_drop');
        piecesVerticalDrop.push('puzzle_pineapple_brown_v_drop');
        piecesVerticalDrop.push('puzzle_pineapple_purple_v_drop');
        piecesVerticalDrop.push('puzzle_pineapple_orange_v_drop');
        // Empty pieces
        pieceHorizontalEmpty = 'puzzle_empty_h';
        pieceVerticalEmpty = 'puzzle_empty_v';
    },

    createBoard: function() {
        // Create a new board
        for (var i = 0; i < board.size; i++) {
            for (var j = 0; j < board.size; j++) {
                var boardX = board.start.x + board.margin.x * j;
                var boardY = board.start.y + board.margin.y * i;
                var piece;
                if ((i + j) % 2 == 0) {
                    piece = game.add.image(boardX, boardY, this.getRandomPiece('h', false));
                }
                else {
                    piece = game.add.image(boardX, boardY, this.getRandomPiece('v', false));
                }
                piece.anchor.set(0.5);
                piece.scale.set(board.scale);

                gameUI.add(piece);
            }
        }
    },

    createAsk: function() {
        var ask = game.add.image(board.ask.x, board.ask.y, this.getRandomPiece('h', true));
        ask.anchor.set(0.5);
        ask.scale.set(board.scale);

        gameUI.add(ask);
    },

    getRandomPiece: function(orientation, isDrop) {
        var rand = Math.floor(Math.random() * piecesHorizontal.length);
        if (orientation == 'h') {
            if (isDrop) {
                return piecesHorizontalDrop[rand];
            }
            else {
                return piecesHorizontal[rand];
            }            
        }
        else { // orientation == 'v'
            if (isDrop) {
                return piecesVerticalDrop[rand];
            }
            else {
                return piecesVertical[rand];
            }
        }
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