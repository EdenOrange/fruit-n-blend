Game.Load = function(game) {

}

Game.Load.prototype = {
    preload: function() {
        var loadingLabel = game.add.text(80, 150, 'loading...', {font: '30px Courier', fill: '#ffffff'});

        // Title
        game.load.image('title_background', 'Assets/Title/background.png');
        game.load.image('title_logo', 'Assets/Title/title.png');
        game.load.image('title_play', 'Assets/Title/play button.png');
        game.load.image('title_tutorial', 'Assets/Title/tutorial button.png');

        // Tutorial
        game.load.image('tutorial', 'Assets/Tutorial/TUTORIAL.png');
        game.load.image('tutorial_continue', 'Assets/Tutorial/continue.png');

        // Level Select
        game.load.image('level_background', 'Assets/Level Select/background.png');
        game.load.image('level_title', 'Assets/Level Select/level title.png');
        game.load.image('level_page', 'Assets/Level Select/page.png');
        game.load.image('level_juice_empty', 'Assets/Level Select/juice kosong.png');
        game.load.image('level_juice', 'Assets/Level Select/juice.png');
        game.load.image('level_continue', 'Assets/Level Select/continue.png');

        // Game
        game.load.image('game_background', 'Assets/Game/background.png');
        game.load.image('game_blender', 'Assets/Game/blender.png');
        game.load.image('game_fruit_basket', 'Assets/Game/fruit basket.png');
        game.load.image('game_juice', 'Assets/Game/juice.png');
        game.load.image('game_time', 'Assets/Game/time.png');
        game.load.image('game_pause', 'Assets/Game/pause button.png');

        // Game - Puzzle
        game.load.image('puzzle_apple_brown_h', 'Assets/Game/Puzzle/Apple/apple1.png');
        game.load.image('puzzle_apple_brown_v', 'Assets/Game/Puzzle/Apple/apple2.png');
        game.load.image('puzzle_apple_brown_h_drop', 'Assets/Game/Puzzle/Apple/apple3.png');
        game.load.image('puzzle_apple_brown_v_drop', 'Assets/Game/Puzzle/Apple/apple4.png');
        game.load.image('puzzle_apple_purple_h', 'Assets/Game/Puzzle/Apple/apple5.png');
        game.load.image('puzzle_apple_purple_v', 'Assets/Game/Puzzle/Apple/apple6.png');
        game.load.image('puzzle_apple_purple_h_drop', 'Assets/Game/Puzzle/Apple/apple7.png');
        game.load.image('puzzle_apple_purple_v_drop', 'Assets/Game/Puzzle/Apple/apple8.png');
        game.load.image('puzzle_apple_orange_h', 'Assets/Game/Puzzle/Apple/apple9.png');
        game.load.image('puzzle_apple_orange_v', 'Assets/Game/Puzzle/Apple/apple10.png');
        game.load.image('puzzle_apple_orange_h_drop', 'Assets/Game/Puzzle/Apple/apple12.png');
        game.load.image('puzzle_apple_orange_v_drop', 'Assets/Game/Puzzle/Apple/apple11.png');
        game.load.image('puzzle_grape_brown_h', 'Assets/Game/Puzzle/Grape/grape8.png');
        game.load.image('puzzle_grape_brown_v', 'Assets/Game/Puzzle/Grape/grape7.png');
        game.load.image('puzzle_grape_brown_h_drop', 'Assets/Game/Puzzle/Grape/grape5.png');
        game.load.image('puzzle_grape_brown_v_drop', 'Assets/Game/Puzzle/Grape/grape6.png');
        game.load.image('puzzle_grape_purple_h', 'Assets/Game/Puzzle/Grape/grape1.png');
        game.load.image('puzzle_grape_purple_v', 'Assets/Game/Puzzle/Grape/grape2.png');
        game.load.image('puzzle_grape_purple_h_drop', 'Assets/Game/Puzzle/Grape/grape4.png');
        game.load.image('puzzle_grape_purple_v_drop', 'Assets/Game/Puzzle/Grape/grape3.png');
        game.load.image('puzzle_grape_orange_h', 'Assets/Game/Puzzle/Grape/grape10.png');
        game.load.image('puzzle_grape_orange_v', 'Assets/Game/Puzzle/Grape/grape11.png');
        game.load.image('puzzle_grape_orange_h_drop', 'Assets/Game/Puzzle/Grape/grape9.png');
        game.load.image('puzzle_grape_orange_v_drop', 'Assets/Game/Puzzle/Grape/grape12.png');
        game.load.image('puzzle_pineapple_brown_h', 'Assets/Game/Puzzle/Pineapple/pineapple5.png');
        game.load.image('puzzle_pineapple_brown_v', 'Assets/Game/Puzzle/Pineapple/pineapple6.png');
        game.load.image('puzzle_pineapple_brown_h_drop', 'Assets/Game/Puzzle/Pineapple/pineapple7.png');
        game.load.image('puzzle_pineapple_brown_v_drop', 'Assets/Game/Puzzle/Pineapple/pineapple8.png');
        game.load.image('puzzle_pineapple_purple_h', 'Assets/Game/Puzzle/Pineapple/pineapple10.png');
        game.load.image('puzzle_pineapple_purple_v', 'Assets/Game/Puzzle/Pineapple/pineapple9.png');
        game.load.image('puzzle_pineapple_purple_h_drop', 'Assets/Game/Puzzle/Pineapple/pineapple11.png');
        game.load.image('puzzle_pineapple_purple_v_drop', 'Assets/Game/Puzzle/Pineapple/pineapple12.png');
        game.load.image('puzzle_pineapple_orange_h', 'Assets/Game/Puzzle/Pineapple/pineapple1.png');
        game.load.image('puzzle_pineapple_orange_v', 'Assets/Game/Puzzle/Pineapple/pineapple2.png');
        game.load.image('puzzle_pineapple_orange_h_drop', 'Assets/Game/Puzzle/Pineapple/pineapple3.png');
        game.load.image('puzzle_pineapple_orange_v_drop', 'Assets/Game/Puzzle/Pineapple/pineapple4.png');
        game.load.image('puzzle_empty_h', 'Assets/Game/Puzzle/puzzle2.png');
        game.load.image('puzzle_empty_v', 'Assets/Game/Puzzle/puzzle1.png');

        // Game - Board
        game.load.json('board', 'Data/board.json');

        // Game - Pause
        game.load.image('pause_background', 'Assets/Game/Pause/pause.png');
        game.load.image('pause_quit', 'Assets/Game/Pause/quit.png');
        game.load.image('pause_restart', 'Assets/Game/Pause/restart.png');
        game.load.image('pause_resume', 'Assets/Game/Pause/resume.png');
    
        // Game - Result
        game.load.image('result_win', 'Assets/Game/Result/win.png');
        game.load.image('result_lose', 'Assets/Game/Result/lose.png');
        game.load.image('result_star', 'Assets/Game/Result/star.png');
        game.load.image('result_star_empty', 'Assets/Game/Result/star kosong.png');
        game.load.spritesheet('result_progress_1to2', 'Assets/Game/Result/spritesheet1.png');
        game.load.spritesheet('result_progress_2to3', 'Assets/Game/Result/spritesheet2.png');
        game.load.image('result_level', 'Assets/Game/Result/level.png');
        game.load.image('result_continue', 'Assets/Game/Result/continue.png');
        game.load.image('result_restart', 'Assets/Game/Result/restart.png');

        // Filters
        game.load.script('filter_gray', 'Assets/Filters/gray.js');
    },

    create: function() {
        game.state.start('title');
    }
}