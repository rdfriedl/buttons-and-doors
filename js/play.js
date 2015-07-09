function Play(){}
Play.prototype = {
	create: function(){
		this.cursor = this.game.input.keyboard.createCursorKeys();

    	//finish
    	this.finish = this.game.add.sprite(0,0,'checkpoint',1);
    	this.finish.anchor.set(.5,.5);
		game.physics.arcade.enable(this.finish);

    	//spawn
    	this.respawnPoint = new Phaser.Point(0,0);

    	//sound
		this.backgroundMusic = game.add.audio('backgroundMusic',.3,true);
		this.checkpointSound = game.add.audio('checkpoint1',.5);

		//wires
		this.wires = game.add.group();

		//buttons
		this.buttons = game.add.group();

		//doors
		this.doors = game.add.group();

		//labels
		this.labels = game.add.group();

		//checkpoints
		this.checkpoints = game.add.group();

		//player
		this.player = this.game.add.sprite(0,0, 'player',1);
		game.physics.arcade.enable(this.player);
		this.player.body.setSize(16+3+3,32-6,0,3);

		game.camera.follow(this.player, Phaser.Camera.FOLLOW_PLATFORMER);
    	this.player.anchor.setTo(0.5, 0.5);

		//mute
		this.mute = game.add.button(game.scale.width-10,10,'sound',function(){
			game.sound.mute = !game.sound.mute;

			if(game.sound.mute)
				this.setFrames(2,0,2,0);
			else 
				this.setFrames(3,1,3,1);
		},undefined,3,1,3,1);

		if(game.sound.mute)
			this.mute.setFrames(2,0,2,0);
		else 
			this.mute.setFrames(3,1,3,1);

		this.mute.anchor.set(1,0);
		this.mute.fixedToCamera = true;

		//start
		this.backgroundMusic.play();
		this.loadLevel(1);
	},
	update: function(){
		this.game.physics.arcade.collide(this.layer, this.player);
		this.game.physics.arcade.collide(this.doors, this.player);
		this.game.physics.arcade.collide(this.checkpoints, this.player,undefined,function(player,checkpoint){
			if(this.respawnPoint !== checkpoint.position){
				this.respawnPoint = checkpoint.position;

				this.checkpoints.forEach(function(obj){
					obj.frame = 0;
					obj.angle = 0;
				});
				checkpoint.frame = 1;
				checkpoint.angle = 45;

				this.checkpointSound.play();
			}

			return false;
		},this);
		this.game.physics.arcade.collide(this.buttons, this.player,undefined,function(player,button){
			if(this.cursor.down.justDown){
				button.changeSate(!button.alive);
			}

			return false;
		},this);
		game.physics.arcade.collide(this.finish,this.player,function(){
			this.loadLevel(this.level+1);
		},undefined,this);

		this.movePlayer();

		if(this.player.y > game.world.height + 64)
			this.playerDie();
	},
	clearLevel: function(){
		this.wires.callAll('destroy');
		this.wires.removeAll();
		this.buttons.callAll('destroy');
		this.buttons.removeAll();
		this.doors.callAll('destroy');
		this.doors.removeAll();
		this.labels.callAll('destroy');
		this.labels.removeAll();
		this.checkpoints.callAll('destroy');
		this.checkpoints.removeAll();

		if(this.map) this.map.destroy();
		if(this.layer) this.layer.destroy();
	},
	loadLevel: function(id){
		this.level = id;
		this.clearLevel();

		if(!game.cache.checkTilemapKey('level'+id)){
			game.state.start('End');
			return;
		}

		this.map = game.add.tilemap('level'+id);
		this.map.addTilesetImage('tileset', 'tileset');
		this.map.setCollisionBetween(1,4);
		this.map.setTileIndexCallback(1, this.playerDie, this);
		this.layer = this.map.createLayer('layer');
		// this.map.createFromObjects('objects', 2, 'coin', 0, true, false, this.coins);
		// this.map.createFromObjects('objects', 4, 'enemy', 0, true, false, this.enemies);
		// this.map.createFromObjects('objects', 5, 'enemy', 0, true, false, this.enemies);
		for(var i in this.map.objects.objects){
			var object = this.map.objects.objects[i];

			switch(object.type){
				case 'spawn':
					this.respawnPoint = new Phaser.Point(object.x,object.y);
					break;
				case 'checkpoint':
					var obj = game.make.sprite(object.x,object.y,'checkpoint');
					game.physics.arcade.enable(obj);
					obj.anchor.set(.5,.5);
					this.checkpoints.add(obj);
					break;
				case 'label':
					var obj = game.make.text(object.x + ((object.width)? object.width/2 : 0),object.y + ((object.height)? object.height/2 : 0),object.properties.text,Object.create(font,{
						font: {value: 'bold 10pt Arial'}
					}));
					obj.anchor.set(.5,.5);
					this.labels.add(obj);
					break;
				case 'button':
					this.buttons.add(this.createButton(object));
					break;
				case 'wire':
					this.wires.add(this.createWire(object));
				case 'door':
					this.doors.add(this.createDoor(object));
					break;
				case 'finish':
					this.finish.x = object.x;
					this.finish.y = object.y;
					break;
			}
		}
		this.layer.resizeWorld();

		this.respawnPlayer();
	},
	movePlayer: function(){
		this.player.body.velocity.x = 0;

		if (!this.player.alive)
			return;

		//right/left
		if (this.cursor.left.isDown) {
			this.player.frame = 0;

			if (this.player.body.blocked.down)
				this.player.body.velocity.x = -150;
			else
				this.player.body.velocity.x = -120;
		}
		else if (this.cursor.right.isDown) {
			this.player.frame = 2;
			
			if (this.player.body.blocked.down)
				this.player.body.velocity.x = 150;
			else
				this.player.body.velocity.x = 120;
		}
		else
			this.player.frame = 1;

		if (this.player.body.blocked.down)
			this.player.body.gravity.y = 200;
		else
			this.player.body.gravity.y = 500;

		//jump
		if (this.cursor.up.isDown && this.player.body.blocked.down) {
			this.player.body.velocity.y = -100;
			// if (sound) this.jump_s.play();
			this.playerJumpCount = 1;
		}
        else if (this.cursor.up.isDown && this.playerJumpCount < 12 && this.playerJumpCount != 0) { 
            this.playerJumpCount += 1;
            this.player.body.velocity.y = -220;
        }
        else 
            this.playerJumpCount = 0;
	},
	playerDie: function(){
		// this.player.alive = false;

		this.respawnPlayer();
	},
	respawnPlayer: function(){
		this.player.position.copyFrom(this.respawnPoint);
	},
	createWire: function(data){
		var margin = 16;
		var wire = game.make.graphics(data.width + margin*2, data.height + margin*2);
		wire.x = data.x - margin;
		wire.y = data.y - margin;

		wire.render = function(){
			this.clear();

			this.moveTo(data.polyline[0][0] + margin, data.polyline[0][1] + margin);

			var x = data.polyline[0][0] + margin;
			var y = data.polyline[0][1] + margin;
	    	for (var i = 1; i < data.polyline.length; i++) {
	    		this.lineStyle(4, 0x000000, 1);
	    		this.lineTo(data.polyline[i][0] + margin,data.polyline[i][1] + margin);

	    		this.moveTo(x,y);

	    		this.lineStyle(2, (this.alive)? colorsHEX[3] : colorsHEX[2], 1);
	    		this.lineTo(data.polyline[i][0] + margin,data.polyline[i][1] + margin);

	    		x = data.polyline[i][0] + margin;
	    		y = data.polyline[i][1] + margin;
	    	};
		}

		wire.changeSate = function(state){
			this.alive = state;
			this.rendre();
		}

		wire.render();

    	return wire;
	},
	createDoor: function(data){
		var margin = 16;
		var door = game.make.graphics(data.width + margin*2, data.height + margin*2);
		door.x = data.x - margin;
		door.y = data.y - margin;
		// game.physics.arcade.enable(door);

		door.render = function(){
			this.clear();
			if(this.alive){
				this.lineStyle(2,colorsHEX[3], 1);
				this.beginFill(colorsHEX[3],0.5);
				this.drawRect(margin,margin,data.width, data.height);
				this.endFill()
			}
			else{
				this.lineStyle(2,colorsHEX[2], 1);
				this.drawRect(margin,margin,data.width, data.height);
			}
		}

		door.changeSate = function(state){
			this.alive = state;
			this.render();
		}

		door.render();

		return door;
	},
	createButton: function(data){
		var button = game.make.sprite(data.x,data.y,'button');
		game.physics.arcade.enable(button);
		button.anchor.set(.5,.5);

		button.changeSate = function(state){
			this.alive = state;
			this.frame = (this.alive)? 0 : 1;
		}

		return button;
	}
}