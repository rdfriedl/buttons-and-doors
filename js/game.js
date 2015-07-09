var game = new Phaser.Game(640, 480, Phaser.AUTO, 'gameContainer');

game.state.add('Boot', Boot);
game.state.add('Load', Load);
game.state.add('Menu', Menu);
game.state.add('Play', Play);
game.state.add('End', End);

game.state.start('Boot');