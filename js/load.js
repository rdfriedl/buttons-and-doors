var colors = ['#247BA0','#FFFFFF','#5BC191','#F25F5C','#FFE066']; //http://coolors.co/app/247ba0-ffffff-5bc191-f25f5c-ffe066
var colorsHEX = [0x247BA0,0xFFFFFF,0x5BC191,0xF25F5C,0xFFE066];
var font = {
	'fill': colors[1]
};
var debug = false;

function choose(){
	return arguments[Math.round(Math.random() * (arguments.length-1))];
}

Boot = function () {
	this.preload = function () {
    	game.physics.startSystem(Phaser.Physics.ARCADE);

		game.stage.disableVisibilityChange = true;
		game.stage.backgroundColor = colors[0];

		game.load.image('loading', 'assets/img/loading.png');
		game.load.image('loading2', 'assets/img/loading2.png');
	}
	this.create = function() {
		game.state.start('Load');
	}
};

var Load = {
	preload: function(){
	    var label2 = game.add.text(Math.floor(game.scale.width/2)+0.5, Math.floor(game.scale.height/2)-15+0.5, 'loading...', { font: '30px Arial', fill: '#fff' });
		label2.anchor.setTo(0.5, 0.5);

		preloading2 = game.add.sprite(game.scale.width/2, game.scale.height/2+15, 'loading2');
		preloading2.x -= preloading2.width/2;
		preloading = game.add.sprite(game.scale.width/2, game.scale.height/2+19, 'loading');
		preloading.x -= preloading.width/2;
		game.load.setPreloadSprite(preloading);

		game.load.spritesheet('player','assets/img/player.png',32,32);
		game.load.spritesheet('sound','assets/img/sound.png',32,32);
		game.load.spritesheet('checkpoint','assets/img/checkpoint.png',32,32);
		game.load.spritesheet('button','assets/img/button.png',32,32);
		game.load.image('tileset','assets/img/tileset.png');
		game.load.image('block','assets/img/block.png');

		//sounds
		game.load.audio('backgroundMusic',['assets/audio/espionage.mp3','assets/audio/espionage.ogg']);
		game.load.audio('checkpoint','assets/audio/checkpoint.mp3');
		game.load.audio('button','assets/audio/button.mp3');
		game.load.audio('finish','assets/audio/finish.mp3');

		//levels
		game.load.tilemap('level1','assets/levels/1.json',null,Phaser.Tilemap.TILED_JSON);
		game.load.tilemap('level2','assets/levels/2.json',null,Phaser.Tilemap.TILED_JSON);
		game.load.tilemap('level3','assets/levels/3.json',null,Phaser.Tilemap.TILED_JSON);
		game.load.tilemap('level4','assets/levels/4.json',null,Phaser.Tilemap.TILED_JSON);
		game.load.tilemap('level5','assets/levels/5.json',null,Phaser.Tilemap.TILED_JSON);
	},
	create: function(){
		game.state.start('Menu');
	}
}