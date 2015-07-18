var colors = ['#247BA0','#FFFFFF','#5BC191','#F25F5C','#FFE066']; //http://coolors.co/app/247ba0-ffffff-5bc191-f25f5c-ffe066
var colorsHEX = [0x247BA0,0xFFFFFF,0x5BC191,0xF25F5C,0xFFE066];
var font = {
	'fill': colors[1]
};
var debug = false;

function choose(){
	return arguments[Math.round(Math.random() * (arguments.length-1))];
}

function parseBool(val,d){
	switch(typeof val){
		case 'string':
			if(["yes","on","true"].indexOf(val.toLowerCase()) !== -1){
				return true;
			}
			else if(["no","off","false"].indexOf(val.toLowerCase()) !== -1){
				return false;
			}
			else if(!isNaN(val)){
				return !!parseFloat(val);
			}
			break;
	}

	//fallback
	return (d == undefined)? true : d;
}

function parseDirection(val){
	switch(typeof val){
		case 'string':
			switch(val.toLowerCase()){
				case 'right': return 0;
				case 'down': return 90;
				case 'left': return 180;
				case 'up': return 270;
				//down
				case 'down right': return 0+45;
				case 'down left': return 180-45;
				case 'd right': return 0+45;
				case 'd left': return 180-45;
				case 'down-right': return 0+45;
				case 'down-left': return 180-45;
				case 'd-right': return 0+45;
				case 'd-left': return 180-45;
				//up
				case 'up right': return 360-45;
				case 'up left': return 180+45;
				case 'u right': return 360-45;
				case 'u left': return 180+45;
				case 'up-right': return 360-45;
				case 'up-left': return 180+45;
				case 'u-right': return 360-45;
				case 'u-left': return 180+45;
			}

			if(!isNaN(val)){
				return parseFloat(val);
			}
			break;
	}
	
	return 90; //return down
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
		game.load.spritesheet('menuButton','assets/img/menuButton.png',32,32);
		game.load.image('playerDie','assets/img/playerDie.png');
		game.load.image('tileset','assets/img/tileset.png');
		game.load.image('title','assets/img/title.png');

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
		game.load.tilemap('level6','assets/levels/6.json',null,Phaser.Tilemap.TILED_JSON);
		game.load.tilemap('level7','assets/levels/7.json',null,Phaser.Tilemap.TILED_JSON);
		game.load.tilemap('level8','assets/levels/8.json',null,Phaser.Tilemap.TILED_JSON);
		game.load.tilemap('level9','assets/levels/9.json',null,Phaser.Tilemap.TILED_JSON);
		game.load.tilemap('level10','assets/levels/10.json',null,Phaser.Tilemap.TILED_JSON);
	},
	create: function(){
		game.state.start('Menu');
	}
}