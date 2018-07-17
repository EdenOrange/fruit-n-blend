Game.Load = function(game) {

}

Game.Load.prototype = {
    preload: function() {
        var loadingLabel = game.add.text(80, 150, 'loading...', {font: '30px Courier', fill: '#ffffff'});

        // Title
        game.load.image('title_background', 'Assets/Title/background.png');
        game.load.image('title_logo', 'Assets/Title/title.png');
        game.load.image('title_play', 'Assets/Title/play button.png');

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
        game.load.image('puzzle_apple_red_h', 'Assets/Game/Puzzle/apple1.png');
        game.load.image('puzzle_apple_red_v', 'Assets/Game/Puzzle/apple2.png');
        game.load.image('puzzle_apple_red_h_drop', 'Assets/Game/Puzzle/apple3.png');
        game.load.image('puzzle_apple_red_v_drop', 'Assets/Game/Puzzle/apple4.png');
        game.load.image('puzzle_grape_red_h', 'Assets/Game/Puzzle/grape1.png');
        game.load.image('puzzle_grape_red_v', 'Assets/Game/Puzzle/grape2.png');
        game.load.image('puzzle_grape_red_h_drop', 'Assets/Game/Puzzle/grape3.png');
        game.load.image('puzzle_grape_red_v_drop', 'Assets/Game/Puzzle/grape4.png');
        game.load.image('puzzle_pineapple_red_h', 'Assets/Game/Puzzle/pineapple1.png');
        game.load.image('puzzle_pineapple_red_v', 'Assets/Game/Puzzle/pineapple2.png');
        game.load.image('puzzle_pineapple_red_h_drop', 'Assets/Game/Puzzle/pineapple3.png');
        game.load.image('puzzle_pineapple_red_v_drop', 'Assets/Game/Puzzle/pineapple4.png');
        game.load.image('puzzle_empty_h', 'Assets/Game/Puzzle/puzzle2.png');
        game.load.image('puzzle_empty_v', 'Assets/Game/Puzzle/puzzle1.png');

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
        game.load.image('result_level', 'Assets/Game/Result/level.png');
        game.load.image('result_continue', 'Assets/Game/Result/continue.png');
        game.load.image('result_restart', 'Assets/Game/Result/restart.png');
    },

    create: function() {
        game.state.start('title');
    }
}