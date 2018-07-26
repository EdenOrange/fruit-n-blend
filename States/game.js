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
var loseScreen;
var winScreen;
// Win screen object reference
var winStar1;
var winStar2;
var winStar3;
var progress;
// Input enabled Game UI array
var gameInputEnabledUI;

Game.Game.prototype = {
    init: function(levelNumber) {
        if (levelNumber != null) {
            level = levelNumber;
        }
    },

    preload: function() {
        board = game.cache.getJSON('board');
        levelData = game.cache.getJSON('levelData');
    },

    create: function() {
        this.applyLevelSettings(level - 1);
        this.createGameUI();
        this.createPauseMenu();
        this.createLoseScreen();
        this.createWinScreen();
        this.setupPieces();
        this.createNewGame();
    },

    update: function() {
        var timeLeft = timeLimit - timer.seconds - timePenalty;
        if (timeLeft <= 0) {
            timer.pause();
            this.checkWin();
        }

        var minutes;
        var seconds;
        
        if (timer.running) {
            minutes = "0" + Math.floor(Math.ceil(timeLeft) / 60);
            seconds = "0" + (Math.ceil(timeLeft) - minutes * 60);
        } else {
            minutes = "0" + Math.floor(Math.ceil(timeLimit) / 60);
            seconds = "0" + (Math.ceil(timeLimit) - minutes * 60);
        }
        timeText.text = minutes.substr(-1) + ":" + seconds.substr(-2);
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

        var background = game.add.image(-1.5, 0.5, 'game_background');
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

    createLoseScreen: function() {
        loseScreen = game.add.group();

        var background = game.add.image(game.world.width / 2, 600, 'result_lose');
        var levelText = game.add.text(game.world.width / 2, 420, "LEVEL " + level.toString());
        var starEmpty = game.add.image(230, 550, 'result_star_empty');
        var starEmpty2 = game.add.image(360, 550, 'result_star_empty');
        var starEmpty3 = game.add.image(490, 550, 'result_star_empty');
        var commentText = game.add.text(game.world.width / 2, 670, "LEVEL NOT PASSED");
        var restartButton = game.add.image(260, 780, 'result_restart');
        var levelButton = game.add.image(460, 780, 'result_level');

        background.anchor.set(0.5);

        levelText.anchor.set(0.5);
        levelText.font = "Poplar";
        levelText.fontSize = "35px";
        levelText.fontWeight = "Bold";
        levelText.fill = "#ffff00";
        levelText.stroke = "#cc6600";
        levelText.strokeThickness = 3;
        levelText.align = "center";

        starEmpty.anchor.set(0.5);
        starEmpty2.anchor.set(0.5);
        starEmpty3.anchor.set(0.5);

        commentText.anchor.set(0.5);
        commentText.font = "Poplar";
        commentText.fontSize = "35px";
        commentText.fontWeight = "Bold";
        commentText.fill = "#ffffff";
        commentText.stroke = "#0000ff";
        commentText.strokeThickness = 3;
        commentText.align = "center";

        restartButton.anchor.set(0.5);
        restartButton.inputEnabled = true;
        restartButton.events.onInputDown.add(this.restart, this);

        levelButton.anchor.set(0.5);
        levelButton.inputEnabled = true;
        levelButton.events.onInputDown.add(this.levelSelect, this);

        loseScreen.addMultiple([background, levelText, starEmpty, starEmpty2, starEmpty3, commentText, restartButton, levelButton]);
        loseScreen.visible = false;
    },

    createWinScreen: function() {
        winScreen = game.add.group();

        var background = game.add.image(game.world.width / 2, 600, 'result_win');
        var levelText = game.add.text(game.world.width / 2, 430, "LEVEL " + level.toString());
        var starEmpty = game.add.image(230, 550, 'result_star_empty');
        var starEmpty2 = game.add.image(360, 550, 'result_star_empty');
        var starEmpty3 = game.add.image(490, 550, 'result_star_empty');
        winStar1 = game.add.image(230, 550, 'result_star');
        winStar2 = game.add.image(360, 550, 'result_star');
        winStar3 = game.add.image(490, 550, 'result_star');
        progress = game.add.sprite(game.world.width / 2, 690, 'result_progress_1to2');
        var restartButton = game.add.image(220, 800, 'result_restart');
        var nextLevelButton = game.add.image(360, 800, 'result_continue');
        var levelButton = game.add.image(500, 800, 'result_level');

        background.anchor.set(0.5);

        levelText.anchor.set(0.5);
        levelText.font = "Poplar";
        levelText.fontSize = "35px";
        levelText.fontWeight = "Bold";
        levelText.fill = "#ffff00";
        levelText.stroke = "#cc6600";
        levelText.strokeThickness = 3;
        levelText.align = "center";

        starEmpty.anchor.set(0.5);
        starEmpty2.anchor.set(0.5);
        starEmpty3.anchor.set(0.5);
        winStar1.anchor.set(0.5);
        winStar1.visible = false;
        winStar2.anchor.set(0.5);
        winStar2.visible = false;
        winStar3.anchor.set(0.5);
        winStar3.visible = false;

        progress.anchor.set(0.5);

        restartButton.anchor.set(0.5);
        restartButton.inputEnabled = true;
        restartButton.events.onInputDown.add(this.restart, this);

        nextLevelButton.anchor.set(0.5);
        nextLevelButton.inputEnabled = true;
        nextLevelButton.events.onInputDown.add(this.nextLevel, this);

        levelButton.anchor.set(0.5);
        levelButton.inputEnabled = true;
        levelButton.events.onInputDown.add(this.levelSelect, this);

        winScreen.addMultiple([background, levelText, starEmpty, starEmpty2, starEmpty3, winStar1, winStar2, winStar3, progress, restartButton, nextLevelButton, levelButton]);
        winScreen.visible = false;
    },

    createNewGame: function() {
        this.resetJuice();
        this.createBoard();
        this.createAskPiece();
        timer = game.time.create(false);
        timePenalty = 0;
        this.createCountdown();
    },

    createCountdown: function() {
        this.freezeGame();
        var countdown = 3;
        var style = {font: "110px Poplar", fontWeight: "Bold", fill: "#ffffff", stroke: "#000000", strokeThickness: 5, align: "center"};
        var countdownText = game.add.text(game.world.centerX, game.world.centerY, countdown.toString(), style);
        countdownText.anchor.set(0.5);
        var countdownTween = game.add.tween(countdownText).to({alpha: 0, fontSize: "140px"}, 1000, Phaser.Easing.Linear.None, true, 0, 2);
        countdownTween.onRepeat.add(function() {
            countdown--;
            countdownText.text = countdown.toString();
            countdownText.alpha = 1;
            countdownText.fontSize = "110px";
        })
        countdownTween.onComplete.add(function() {
            timer.start();
            this.unfreezeGame();
        }, this);
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
                    this.fadeOutAndDestroy(boardPieces[i][j]);
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
            this.fadeIn(piece);

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
        this.fadeIn(askPiece);

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
                    // gameUI.removeChild(askSlots[i][j]);
                    this.fadeOutAndDestroy(askSlots[i][j]);
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
                        this.fadeIn(askSlot);

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

        // Place ask piece
        askSlots[x][y].loadTexture("puzzle_" + askPiece.shape + '_' + askPiece.color + '_' + askPiece.orientation);

        // Destroy surrounding board pieces
        for (var i = 0; i < checkPos.length; i++) {
            var xCheck = checkPos[i].x;
            var yCheck = checkPos[i].y;
            // Board boundaries check
            if (xCheck < 0 || xCheck >= board.settings[boardSetting].size || yCheck < 0 || yCheck >= board.settings[boardSetting].size) {
                continue;
            }
            
            if (boardPieces[xCheck][yCheck] != null) {
                this.fadeOutAndDestroy(boardPieces[xCheck][yCheck]);
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
        if (juiceCount < juiceTarget[0]) {
            this.loseGame();
        }
        else {
            this.winGame();
        }
    },

    loseGame: function() {
        this.freezeGame();

        // Show Lose Screen
        loseScreen.visible = true;
        game.world.bringToTop(loseScreen);
    },

    winGame: function() {
        this.freezeGame();

        // Update levels unlocked
        var levelsUnlocked = localStorage.getItem('levelsUnlocked');
        if (levelsUnlocked == level) {
            localStorage.setItem('levelsUnlocked', level + 1);
        }

        // Show Win Screen
        winScreen.visible = true;
        game.world.bringToTop(winScreen);

        // Calculate stars
        var stars = 0;
        for (var i = 0; i < juiceTarget.length; i++) {
            if (juiceCount >= juiceTarget[i]) {
                stars++;
            }
        }

        // Show stars and play animation
        if (stars == 1) {
            // Don't need to play animation
            winStar1.visible = true;
        }
        else if (stars == 2) {
            // Play animation to 2 juices
            winStar1.visible = true;
            winStar2.visible = true;
        }
        else if (stars == 3) {
            // Play animation to 3 juices
            winStar1.visible = true;
            winStar2.visible = true;
            winStar3.visible = true;
        }

        // Store highScore
        var highScore = JSON.parse(localStorage.getItem('highScore'));
        var date = new Date().toLocaleDateString('en-US');
        var newScore = {"date": date, "juice": juiceCount};
        highScore.push(newScore);
        highScore.sort(function(a, b){return b.juice - a.juice}); // Higher juice rank higher, older date rank higher
        if (highScore.length > 5) {
            highScore.pop();
        }
        var newHighScore = JSON.stringify(highScore);
        localStorage.setItem('highScore', newHighScore);
    },

    fadeIn: function(object) {
        object.alpha = 0;
        var tween = game.add.tween(object).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
    },

    fadeOutAndDestroy: function(object) {
        object.alpha = 1;
        object.inputEnabled = false;
        var tween = game.add.tween(object).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
        tween.onComplete.add(function() {
            object.destroy();
        }, this);
    },

    freezeGame: function() {
        // Add gray filter to Game UI
        var grayFilter = game.add.filter('Gray');
        gameUI.filters = [grayFilter];
        // Darken Game UI
        gameUI.setAll('tint', '0xaaaaaa');

        // Disable Game UI inputs
        gameInputEnabledUI.forEach(function (object) {
            object.inputEnabled = false;
        });
        askSlots.forEach(function(askSlotTemp) {
            askSlotTemp.forEach(function(askSlot) {
                if (askSlot != null) {
                    askSlot.inputEnabled = false;
                }
            })
        });
    },

    unfreezeGame: function() {
        // Remove gray filter from Game UI
        gameUI.filters = null;
        // Lighten back up Game UI
        gameUI.setAll('tint', '0xffffff');
        
        // Enable Game UI inputs
        gameInputEnabledUI.forEach(function (object) {
            object.inputEnabled = true;
        });
        askSlots.forEach(function(askSlotTemp) {
            askSlotTemp.forEach(function(askSlot) {
                if (askSlot != null) {
                    askSlot.inputEnabled = true;
                }
            })
        });
    },

    pause: function() {
        timer.pause();

        this.freezeGame();

        // Show Pause Menu
        pauseMenu.visible = true;
        game.world.bringToTop(pauseMenu);
    },

    resume: function() {
        timer.resume();

        this.unfreezeGame();

        // Hide Pause Menu
        pauseMenu.visible = false;
    },

    restart: function() {
        this.resume();
        this.createNewGame();

        // Hide Lose Screen
        loseScreen.visible = false;
        // Hide Win Screen
        winScreen.visible = false;
    },

    nextLevel: function() {
        game.state.start('game', true, false, level + 1);
    },

    levelSelect: function() {
        game.state.start('levelSelect');
    },

    quit: function() {
        game.state.start('title');
    }
}