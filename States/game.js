Game.Game = function(game) {

}

// Current level
var level = 1;

// Board settings
var board;
// Board pieces holder
var boardPieces = [];
// Board pieces
var pieceShapes = [];
var pieceColors = [];
// Current ask piece
var askPiece;

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
        this.createAskPiece();
    },

    setupPieces: function() {
        // Piece shapes
        pieceShapes.push('apple', 'grape', 'pineapple');
        // Piece colors
        pieceColors.push('brown', 'purple', 'orange');
    },

    createBoard: function() {
        // Clear board
        for (var i = 0; i < board.settings[1].size; i++) {
            boardPieces[i] = [];
            for (var j = 0; j < board.settings[1].size; j++) {
                boardPieces[i][j] = null;
            }
        }
        // Create a new board
        var arrangements = board.arrangements[1][Math.floor(Math.random() * board.arrangements[1].length)];
        for (var i = 0; i < arrangements.length; i++) {
            var x = arrangements[i].x;
            var y = arrangements[i].y;
            var boardX = board.settings[1].start.x + board.settings[1].margin.x * x;
            var boardY = board.settings[1].start.y + board.settings[1].margin.y * y;
            var piece;
            if ((x + y) % 2 == 0) {
                var randomPiece = this.generateRandomPiece('h', false);
                piece = game.add.image(boardX, boardY, randomPiece);
            }
            else {
                var randomPiece = this.generateRandomPiece('v', false);
                piece = game.add.image(boardX, boardY, randomPiece);
            }
            var pieceSplit = piece.key.split('_');
            piece.shape = pieceSplit[1];
            piece.color = pieceSplit[2];
            piece.orientation = pieceSplit[3];
            piece.xPos = x;
            piece.yPos = y;
            piece.anchor.set(0.5);
            piece.scale.set(board.settings[1].scale);

            boardPieces[x][y] = piece;

            gameUI.add(piece);
        }
    },

    createAskPiece: function() {
        var targetPiece = this.getRandomPiece();
        var askPieceString = null;
        while (askPieceString == null) {
            askPieceString = this.generateAskPiece(targetPiece.xPos, targetPiece.yPos);
        } 
        askPiece = game.add.image(board.settings[1].ask.x, board.settings[1].ask.y, askPieceString);
        var pieceSplit = askPiece.key.split('_');
        askPiece.shape = pieceSplit[1];
        askPiece.color = pieceSplit[2];
        askPiece.orientation = pieceSplit[3];
        askPiece.anchor.set(0.5);
        askPiece.scale.set(board.settings[1].scale);
        
        gameUI.add(askPiece);
    },

    generateEmptyPiece: function(orientation) {
        return "puzzle_empty_" + orientation;
    },

    generateRandomPiece: function(orientation, isDrop, shape = null, color = null) {
        // Returns a random piece name string with orientation, isDrop, shape, and color
        // Will return random shape/color if shape/color is null
        var pieceString = "puzzle";
        if (shape) {
            pieceString += '_' + shape;
        }
        else {
            pieceString += '_' + pieceShapes[Math.floor(Math.random() * pieceShapes.length)];
        }
        if (color) {
            pieceString += '_' + color;
        }
        else {
            pieceString += '_' + pieceColors[Math.floor(Math.random() * pieceColors.length)];
        }
        pieceString += '_' + orientation;
        if (isDrop) {
            pieceString += '_drop';
        }
        return pieceString;
    },

    generateAskPiece: function(x, y) {
        // Returns a random valid ask piece string for target piece at x, y
        var validPieces = [];
        var potentialPos = [
            {x: x, y: y-1},
            {x: x, y: y+1},
            {x: x-1, y: y},
            {x: x+1, y: y}
        ];
        var targetOrientation = boardPieces[x][y].orientation;
        
        // Populate validPieces with valid piece properties
        for (var i = 0; i < potentialPos.length; i++) {
            // Board occupied check
            if (boardPieces[potentialPos[i].x][potentialPos[i].y] != null) {
                continue;
            }

            var checkPos = [
                {x: potentialPos[i].x, y: potentialPos[i].y-1},
                {x: potentialPos[i].x, y: potentialPos[i].y+1},
                {x: potentialPos[i].x-1, y: potentialPos[i].y},
                {x: potentialPos[i].x+1, y: potentialPos[i].y}
            ];
            var colors = [];
            var shapes = [];
            for (var j = 0; j < checkPos.length; j++) {
                var xCheck = checkPos[j].x;
                var yCheck = checkPos[j].y;
                // Board boundaries check
                if (xCheck < 0 || xCheck >= board.settings[1].size || yCheck < 0 || yCheck >= board.settings[1].size) {
                    continue;
                }

                if (targetOrientation == 'h') {
                    // Target is horizontal, so Answer is vertical
                    // Vertical = same color
                    // Check surrounding colors
                    if (boardPieces[xCheck][yCheck] != null) {
                        colors.push(boardPieces[xCheck][yCheck].color);
                    }
                }
                else { // targetOrientation == 'v'
                    // Target is vertical, so Answer is horizontal
                    // Horizontal = same shape
                    // Check surrounding shapes
                    if (boardPieces[xCheck][yCheck] != null) {
                        shapes.push(boardPieces[xCheck][yCheck].shape);
                    }
                }
            }

            // Validity check
            if (targetOrientation == 'h') {
                // Color validity check
                if (colors.every((val, i, arr) => val == arr[0])) {
                    var askPiece = {
                        shape: null,
                        color: colors[0],
                        orientation: 'v'
                    }
                    validPieces.push(askPiece);
                }
            }
            else { // targetOrientation == 'v'
                // Shape validity check
                if (shapes.every((val, i, arr) => val == arr[0])) {
                    var askPiece = {
                        shape: shapes[0],
                        color: null,
                        orientation: 'h'
                    }
                    validPieces.push(askPiece);
                }
            }
        }
        
        // No valid ask piece
        if (validPieces.length == 0) {
            return null;
        }

        // Pick a random valid piece's properties
        var rand = Math.floor(Math.random() * validPieces.length);
        var pieceProperties = validPieces[rand];
        // Create a random piece string with specified properties. Null will be filled with random
        var returnPiece = this.generateRandomPiece(pieceProperties.orientation, true, pieceProperties.shape, pieceProperties.color);
        return returnPiece;
    },

    getRandomPiece: function() {
        // Returns a random active board piece
        var activePieces = [];
        for (var i = 0; i < board.settings[1].size; i++) {
            for (var j = 0; j < board.settings[1].size; j++) {
                if (boardPieces[i][j]) {
                    activePieces.push(boardPieces[i][j]);
                }
            }
        }
        var randomPiece = activePieces[Math.floor(Math.random() * activePieces.length)];
        return randomPiece;
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