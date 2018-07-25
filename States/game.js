Game.Game = function(game) {

}

// Current level
var level = 1;
var levelData;
var juiceCount = 0;
var juiceText;
var juiceTarget;
var timer;
var timeLimit = 30;
var timePenalty = 0;
var timeText;

// Board settings
var board;
var boardSize;
var boardSetting; // 0: size=4, 1: size=5
// Board pieces holder
var boardPieces = [];
var boardPiecesCount;
// Board pieces
var pieceShapes = [];
var pieceColors = [];
// Current ask piece
var askPiece = null;
// Ask slots holder
var askSlots = [];

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
        levelData = game.cache.getJSON('levelData');
    },

    create: function() {
        this.applyLevelSettings(level - 1);
        this.createGameUI();
        this.createPauseMenu();
        this.setupPieces();
        this.createNewGame();
    },

    update: function() {
        var timeLeft = timeLimit - timer.seconds - timePenalty;
        if (timeLeft <= 0) {
            timer.stop();
            this.checkWin();
        }
        if (timer.running) {
            var minutes = "0" + Math.floor(Math.round(timeLeft) / 60);
            var seconds = "0" + (Math.round(timeLeft) - minutes * 60);
            timeText.text = minutes.substr(-1) + ":" + seconds.substr(-2);
        }
    },

    applyLevelSettings: function(level) {
        boardSize = levelData.settings[level].size;
        if (boardSize == 4) {
            boardSetting = 0;
        }
        else if (boardSize == 5) {
            boardSetting = 1;
        }

        juiceTarget = levelData.settings[level].juice;
        timeLimit = levelData.settings[level].time;
    },

    createGameUI: function() {
        gameUI = game.add.group();
        gameInputEnabledUI = [];

        var background = game.add.image(0, 0, 'game_background');
        var blender = game.add.image(250, 420, 'game_blender');
        var fruitBasket = game.add.image(580, 480, 'game_fruit_basket');
        var juice = game.add.image(160, 35, 'game_juice');
        juiceText = game.add.text(150, 55, juiceCount.toString());
        var time = game.add.image(400, 50, 'game_time');
        timeText = game.add.text(380, 55, "0:00");
        var pauseButton = game.add.image(660, 50, 'game_pause');

        blender.anchor.set(0.5);

        fruitBasket.anchor.set(0.5);

        juice.anchor.set(0.5);

        time.anchor.set(0.5);

        pauseButton.anchor.set(0.5);
        pauseButton.inputEnabled = true;
        pauseButton.events.onInputDown.add(this.pause, this);

        juiceText.anchor.set(0.5);
        juiceText.font = "Poplar";
        juiceText.fontSize = "40px";
        juiceText.fontWeight = "Bold";
        juiceText.fill = "#ffffff";
        juiceText.stroke = "#000000";
        juiceText.strokeThickness = 5;
        juiceText.align = "center";

        timeText.anchor.set(0.5);
        timeText.font = "Poplar";
        timeText.fontSize = "40px";
        timeText.fontWeight = "Bold";
        timeText.fill = "#ffffff";
        timeText.stroke = "#000000";
        timeText.strokeThickness = 5;
        timeText.align = "center";
        
        gameUI.addMultiple([background, blender, fruitBasket, juice, juiceText, time, timeText, pauseButton]);
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
        this.resetJuice();
        this.createBoard();
        this.createAskPiece();

        timer = game.time.create(false);
        timePenalty = 0;
        timer.start();
    },

    setupPieces: function() {
        // Piece shapes
        pieceShapes.push('apple', 'grape', 'pineapple');
        // Piece colors
        pieceColors.push('brown', 'purple', 'orange');
    },

    createBoard: function() {
        // Clear board
        for (var i = 0; i < board.settings[boardSetting].size; i++) {
            if (boardPieces[i] == null) {
                boardPieces[i] = [];
            }
            for (var j = 0; j < board.settings[boardSetting].size; j++) {
                if (boardPieces[i][j] != null) {
                    boardPieces[i][j].destroy();
                }
                boardPieces[i][j] = null;
            }
        }
        boardPiecesCount = 0;
        // Create a new board
        var arrangements = board.arrangements[boardSetting][Math.floor(Math.random() * board.arrangements[boardSetting].length)];
        for (var i = 0; i < arrangements.length; i++) {
            var x = arrangements[i].x;
            var y = arrangements[i].y;
            var boardX = board.settings[boardSetting].start.x + board.settings[boardSetting].margin.x * x;
            var boardY = board.settings[boardSetting].start.y + board.settings[boardSetting].margin.y * y;
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
            piece.scale.set(board.settings[boardSetting].scale);

            boardPieces[x][y] = piece;
            boardPiecesCount++;

            gameUI.add(piece);
        }
    },

    createAskPiece: function() {
        // Clear current askPiece if exists
        if (askPiece != null) {
            askPiece.destroy();
            askPiece = null;
        }

        var targetPiece = this.getRandomPiece();
        var askPieceString = null;
        while (askPieceString == null) {
            askPieceString = this.generateAskPiece(targetPiece.xPos, targetPiece.yPos);
        } 
        askPiece = game.add.image(board.settings[boardSetting].ask.x, board.settings[boardSetting].ask.y, askPieceString);
        var pieceSplit = askPiece.key.split('_');
        askPiece.shape = pieceSplit[1];
        askPiece.color = pieceSplit[2];
        askPiece.orientation = pieceSplit[3];
        askPiece.anchor.set(0.5);
        askPiece.scale.set(board.settings[boardSetting].scale);

        gameUI.add(askPiece);
        
        this.drawAskSlots();
    },

    drawAskSlots: function() {
        // Clear ask slots
        for (var i = 0; i < board.settings[boardSetting].size; i++) {
            if (askSlots[i] == null) {
                askSlots[i] = [];
            }
            for (var j = 0; j < board.settings[boardSetting].size; j++) {
                if (askSlots[i][j] != null) {
                    // Destroy and remove existing ask slot
                    gameUI.remove(askSlots[i][j], true);
                }
                askSlots[i][j] = null;
            }
        }

        // Draw each valid ask slots
        for (var i = 0; i < board.settings[boardSetting].size; i++) {
            for (var j = 0; j < board.settings[boardSetting].size; j++) {
                // Orientation check
                // Ask piece orientation != Board piece orientation
                if (((i + j) % 2 == 0 && askPiece.orientation == 'h') || ((i + j) % 2 != 0 && askPiece.orientation == 'v')) {
                    continue;
                }

                var checkPos = [
                    {x: i, y: j-1},
                    {x: i, y: j+1},
                    {x: i-1, y: j},
                    {x: i+1, y: j}
                ];
                if (boardPieces[i][j] != null) {
                    for (var k = 0; k < checkPos.length; k++) {
                        let xCheck = checkPos[k].x;
                        let yCheck = checkPos[k].y;
                        // Board boundaries check
                        if (xCheck < 0 || xCheck >= board.settings[boardSetting].size || yCheck < 0 || yCheck >= board.settings[boardSetting].size) {
                            continue;
                        }
                        // Ask slots and board piece occupied check
                        if (askSlots[xCheck][yCheck] != null || boardPieces[xCheck][yCheck] != null) {
                            continue;
                        }

                        // Draw ask slot on xCheck, yCheck
                        var boardX = board.settings[boardSetting].start.x + board.settings[boardSetting].margin.x * xCheck;
                        var boardY = board.settings[boardSetting].start.y + board.settings[boardSetting].margin.y * yCheck;
                        var askSlot = game.add.image(boardX, boardY, this.generateEmptyPiece(askPiece.orientation));
                        askSlot.anchor.set(0.5);
                        askSlot.scale.set(board.settings[boardSetting].scale);
                        askSlot.inputEnabled = true;
                        askSlot.events.onInputDown.add(function(){this.checkAnswer(xCheck, yCheck)}, this);

                        askSlots[xCheck][yCheck] = askSlot;

                        gameUI.add(askSlot);
                    }
                }
            }
        }
    },

    checkAnswer: function(x, y) {
        var checkPos = [
            {x: x, y: y-1},
            {x: x, y: y+1},
            {x: x-1, y: y},
            {x: x+1, y: y}
        ];
        var surroundings = [];

        // Push surroundings to array
        for (var i = 0; i < checkPos.length; i++) {
            var xCheck = checkPos[i].x;
            var yCheck = checkPos[i].y;
            // Board boundaries check
            if (xCheck < 0 || xCheck >= board.settings[boardSetting].size || yCheck < 0 || yCheck >= board.settings[boardSetting].size) {
                continue;
            }

            if (boardPieces[xCheck][yCheck] != null) {
                if (askPiece.orientation == 'h') {
                    surroundings.push(boardPieces[xCheck][yCheck].shape);
                }
                else {
                    surroundings.push(boardPieces[xCheck][yCheck].color);
                }
            }
        }

        // Checks if surroundings have the same shape/color as askPiece (correct answer)
        if (surroundings.every((val, i, arr) => val == ((askPiece.orientation == 'h') ? askPiece.shape : askPiece.color))) {
            this.correctAnswer(x, y);
        }
        else {
            this.wrongAnswer(x, y);
        }
    },

    correctAnswer: function(x, y) {
        var checkPos = [
            {x: x, y: y-1},
            {x: x, y: y+1},
            {x: x-1, y: y},
            {x: x+1, y: y}
        ];

        // Destroy surrounding board pieces
        for (var i = 0; i < checkPos.length; i++) {
            var xCheck = checkPos[i].x;
            var yCheck = checkPos[i].y;
            // Board boundaries check
            if (xCheck < 0 || xCheck >= board.settings[boardSetting].size || yCheck < 0 || yCheck >= board.settings[boardSetting].size) {
                continue;
            }
            
            if (boardPieces[xCheck][yCheck] != null) {
                boardPieces[xCheck][yCheck].destroy();
                boardPieces[xCheck][yCheck] = null;
                boardPiecesCount--;
                this.addJuice();
            }
        }

        // Check if new board needs to be created
        if (boardPiecesCount == 0) {
            this.createBoard();
        }

        this.createAskPiece();
    },

    wrongAnswer: function(x, y) {
        this.playWrongAnim(askSlots[x][y]);
        timePenalty++;
    },

    playWrongAnim: function(askSlot) {
        var startColor = "0xff0000";
        var endColor = "0xffffff";
        var duration = 2000;

        var colorBlend = {step: 0};
        var colorTween = game.add.tween(colorBlend).to({step: 100}, duration);
        colorTween.onUpdateCallback(function(){
            askSlot.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend.step);
        });

        askSlot.tint = startColor;
        colorTween.start();
    },

    resetJuice: function() {
        juiceCount = 0;
        juiceText.text = juiceCount.toString();
    },

    addJuice: function() {
        juiceCount++;
        juiceText.text = juiceCount.toString();
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
                if (xCheck < 0 || xCheck >= board.settings[boardSetting].size || yCheck < 0 || yCheck >= board.settings[boardSetting].size) {
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
        for (var i = 0; i < board.settings[boardSetting].size; i++) {
            for (var j = 0; j < board.settings[boardSetting].size; j++) {
                if (boardPieces[i][j]) {
                    activePieces.push(boardPieces[i][j]);
                }
            }
        }
        var randomPiece = activePieces[Math.floor(Math.random() * activePieces.length)];
        return randomPiece;
    },

    checkWin: function() {
        if (juiceCount < juiceTarget) {
            this.loseGame();
        }
        else {
            this.winGame();
        }
    },

    loseGame: function() {
        console.log("Lose Game");
    },

    winGame: function() {
        console.log("Win Game");
    },

    pause: function() {
        timer.pause();

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
        timer.resume();

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
        this.resume();
    },

    quit: function() {
        game.state.start('title');
    }
}