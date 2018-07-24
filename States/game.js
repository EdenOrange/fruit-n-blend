Game.Game = function(game) {

}

// Current level
var level = 1;

// Board settings
var board;
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

    preload: function() {
        board = game.cache.getJSON('board');
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
        for (var i = 0; i < board.settings[1].size; i++) {
            for (var j = 0; j < board.settings[1].size; j++) {
                var boardX = board.settings[1].start.x + board.settings[1].margin.x * j;
                var boardY = board.settings[1].start.y + board.settings[1].margin.y * i;
                var piece;
                if ((i + j) % 2 == 0) {
                    var randomPiece = this.getRandomPiece('h', false);
                    piece = game.add.image(boardX, boardY, randomPiece.piece);
                }
                else {
                    var randomPiece = this.getRandomPiece('v', false);
                    piece = game.add.image(boardX, boardY, randomPiece.piece);
                }
                piece.orientation = randomPiece.orientation;
                piece.isDrop = randomPiece.isDrop;
                piece.anchor.set(0.5);
                piece.scale.set(board.settings[1].scale);

                gameUI.add(piece);
            }
        }
    },

    createAsk: function() {
        var randomPiece = this.getRandomPiece('h', true);
        var ask = game.add.image(board.settings[1].ask.x, board.settings[1].ask.y, randomPiece.piece);
        ask.orientation = randomPiece.orientation;
        ask.isDrop = randomPiece.isDrop;
        ask.anchor.set(0.5);
        ask.scale.set(board.settings[1].scale);
        
        gameUI.add(ask);
    },

    getEmptyPiece: function(orientation) {
        var piece = {
            orientation: orientation
        };
        if (orientation == 'h') {
            piece.piece = pieceHorizontalEmpty;
        }
        else { // orientation == 'v'
            piece.piece = pieceVerticalEmpty;
        }
        return piece;
    },

    getRandomPiece: function(orientation, isDrop) {
        var rand = Math.floor(Math.random() * piecesHorizontal.length);
        var piece = {
            orientation: orientation,
            isDrop: isDrop
        };
        if (orientation == 'h') {
            if (isDrop) {
                piece.piece = piecesHorizontalDrop[rand];
            }
            else {
                piece.piece = piecesHorizontal[rand];
            }
        }
        else { // orientation == 'v'
            if (isDrop) {
                piece.piece = piecesVerticalDrop[rand];
            }
            else {
                piece.piece = piecesVertical[rand];
            }
        }
        return piece;
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