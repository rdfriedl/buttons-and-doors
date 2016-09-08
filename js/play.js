var Play = {
	init: function(lvl){
		this.level = lvl || 1;
	},
	create: function(){
		this.cursor = this.game.input.keyboard.createCursorKeys();
		this.cursorAlt = {
			up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
			down: this.game.input.keyboard.addKey(Phaser.Keyboard.S),
			right: this.game.input.keyboard.addKey(Phaser.Keyboard.D),
			left: this.game.input.keyboard.addKey(Phaser.Keyboard.A)
		}

    	//finish
    	this.finish = this.game.add.sprite(0,0,'checkpoint',1);
    	this.finish.anchor.set(.5,.5);
		game.physics.arcade.enable(this.finish);

    	//spawn
    	this.respawnPoint = new Phaser.Point(0,0);

    	//sound
    	this.sounds = {
    		music: game.add.audio('backgroundMusic',.2,true),
    		button: game.add.audio('button',.5),
    		checkpoint: game.add.audio('checkpoint',.5),
    		finish: game.add.audio('finish',.5)
    	}

		//wires
		this.wires = game.add.group();

		//buttons
		this.buttons = game.add.group();

		//labels
		this.labels = game.add.group();

		//doors
		this.doors = game.add.group();

		//blocks
		this.blocks = game.add.group();

		//checkpoints
		this.checkpoints = game.add.group();

		//player
		this.player = this.game.add.sprite(0,0, 'player',1);
		game.physics.arcade.enable(this.player);
		this.player.body.setSize(16+3+3,32-6,0,3);

		this.playerDieEmitter = game.add.emitter(0, 0, 250);
		this.playerDieEmitter.makeParticles('playerDie',0,40,true,false);
		this.playerDieEmitter.particleDrag.set(20,20)
    	this.playerDieEmitter.gravity = 150;
   	 	this.playerDieEmitter.angularDrag = 100;
   	 	// for (var i = 0; i < this.playerDieEmitter.children.length; i++) {
   	 	// 	var particle = this.playerDieEmitter.children[i];
   	 	// 	particle.body.allowRotation = false;
   	 	// }

		game.camera.follow(this.player, Phaser.Camera.FOLLOW_PLATFORMER);
    	this.player.anchor.setTo(0.5, 0.5);

		//mute
		this.mute = game.add.button(game.scale.width-10,10,'sound',function(){
			game.sound.mute = !game.sound.mute;

			if(game.sound.mute)
				this.mute.setFrames(2,0,2,0);
			else
				this.mute.setFrames(3,1,3,1);

			this.sounds.button.play();
		},this,3,1,3,1);

		if(game.sound.mute)
			this.mute.setFrames(2,0,2,0);
		else
			this.mute.setFrames(3,1,3,1);

		this.mute.anchor.set(1,0);
		this.mute.fixedToCamera = true;

		//level title
		this.title = game.add.text(game.scale.width/2,10,'',Object.create(font));
		this.title.fixedToCamera = true;
		this.title.fontWeight = 'bold';
		this.title.fontSize = 50;
		this.title.anchor.set(.5,0);
		this.subTitle = game.make.text(0,60,'Getting Started',Object.create(font));
		this.subTitle.fontSize = 20;
		this.subTitle.anchor.set(.5,0);
		this.title.addChild(this.subTitle);

		//controls
		function playerAction(){
			// check for finish point
			game.physics.arcade.overlap(this.finish, this.player, function(){
				this.sounds.finish.play();
				this.player.alive = false;

				this.sounds.finish.onStop.addOnce(function(){
					this.player.alive = true;
					this.loadLevel(this.level+1);
				},this)
			},undefined,this);

			// check for checkpoints
			this.game.physics.arcade.overlap(this.checkpoints, this.player, function(player, checkpoint){
				this.respawnPoint = checkpoint.position;

				this.checkpoints.forEach(function(obj){
					obj.frame = 0;
					obj.angle = 0;
				});
				checkpoint.frame = 1;
				checkpoint.angle = 45;

				this.sounds.checkpoint.play();
			},undefined,this);

			// look for buttons
			game.physics.arcade.overlap(this.buttons, this.player, function(player, button){
				button.setState(!button.alive);
				this.sounds.button.play();
			},undefined,this)
		}
		this.cursor.down.onDown.add(playerAction, this);
		this.cursorAlt.down.onDown.add(playerAction, this);

		//start
		this.sounds.music.play();
		this.loadLevel(this.level);
	},
	update: function(){
		this.game.physics.arcade.collide(this.layer, this.player);
		this.game.physics.arcade.collide(this.doors, this.player);
		this.game.physics.arcade.collide(this.blocks, this.player);

		this.game.physics.arcade.collide(this.layer, this.blocks);
		this.game.physics.arcade.collide(this.doors, this.blocks);
		this.game.physics.arcade.collide(this.blocks, this.blocks);

		this.game.physics.arcade.collide(this.layer, this.playerDieEmitter);
		this.game.physics.arcade.collide(this.doors, this.playerDieEmitter);
		this.game.physics.arcade.collide(this.blocks, this.playerDieEmitter);
		// this.game.physics.arcade.collide(this.playerDieEmitter, this.playerDieEmitter);

		this.movePlayer();

		if(this.player.y > game.world.height + 64 && this.player.alive)
			this.playerDie();
	},
	clearLevel: function(){
		this.wires.callAll('destroy');
		this.wires.removeAll();
		this.buttons.callAll('destroy');
		this.buttons.removeAll();
		this.labels.callAll('destroy');
		this.labels.removeAll();
		this.checkpoints.callAll('destroy');
		this.checkpoints.removeAll();
		this.blocks.callAll('destroy');
		this.blocks.removeAll();
		this.doors.callAll('destroy');
		this.doors.removeAll();

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
		this.map.setTileIndexCallback(1, function(sprite,tile){
			if(sprite === this.player){
				this.playerDie();
			}
			return true;
		}, this);
		this.layer = this.map.createLayer('layer');
		for(var i in this.map.objects.objects){
			var object = this.map.objects.objects[i];

			switch(object.type){
				case 'spawn':
					this.respawnPoint = new Phaser.Point(object.x,object.y);
					break;
				case 'checkpoint':
					this.createCheckpoint(object);
					break;
				case 'label':
					var obj = game.make.text(object.x + ((object.width)? object.width/2 : 0),object.y + ((object.height)? object.height/2 : 0),object.properties.text,Object.create(inGameFont,{
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
					break;
				case 'door':
					this.doors.add(this.createDoor(object));
					break;
				case 'block':
					if(!object.width || !object.height) break;

					this.blocks.add(this.createBlock(object));
					break;
				case 'finish':
					this.finish.x = object.x;
					this.finish.y = object.y;
					break;
			}
		}
		this.layer.resizeWorld();

		this.respawnPlayer();

		this.title.alpha = 0;
		this.title.text = 'Level: '+this.level;
		this.subTitle.text = Play.map.properties.title || '';
		this.titleFade = game.add.tween(this.title);
		this.titleFade
			.to({
				alpha: 1
			},2000)
			.yoyo(true,2000)
			.start();

		game.world.bringToTop(this.title);
		game.world.bringToTop(this.subTitle);
		game.world.bringToTop(this.mute);

		//save level
		localStorage.lvl = this.level;
	},
	movePlayer: function(){
		this.player.body.velocity.x = 0;

		if (!this.player.alive)
			return;

		//right/left
		if (this.cursor.left.isDown || this.cursorAlt.left.isDown) {
			this.player.frame = 0;

			if (this.player.body.blocked.down || this.player.body.touching.down)
				this.player.body.velocity.x = -150;
			else
				this.player.body.velocity.x = -120;
		}
		else if (this.cursor.right.isDown || this.cursorAlt.right.isDown) {
			this.player.frame = 2;

			if (this.player.body.blocked.down || this.player.body.touching.down)
				this.player.body.velocity.x = 150;
			else
				this.player.body.velocity.x = 120;
		}
		else
			this.player.frame = 1;

		if (this.player.body.blocked.down || this.player.body.touching.down)
			this.player.body.gravity.y = 200;
		else
			this.player.body.gravity.y = 500;

		//jump
		if ((this.cursor.up.isDown || this.cursorAlt.up.isDown) && (this.player.body.blocked.down || this.player.body.touching.down)) {
			this.player.body.velocity.y = -100;
			// if (sound) this.jump_s.play();
			this.playerJumpCount = 1;
		}
        else if ((this.cursor.up.isDown || this.cursorAlt.up.isDown) && this.playerJumpCount < 12 && this.playerJumpCount != 0) {
            this.playerJumpCount += 1;
            this.player.body.velocity.y = -220;
        }
        else
            this.playerJumpCount = 0;
	},
	playerDie: function(){
		this.player.alive = false;
		this.player.visible = false;
		this.player.body.enable = false;
		this.playerDieEmitter.position.copyFrom(this.player.position);
		var speed = 60;
		Phaser.Point.add(this.player.body.velocity, new Phaser.Point(-speed,-speed), this.playerDieEmitter.minParticleSpeed);
		Phaser.Point.add(this.player.body.velocity, new Phaser.Point(speed,speed), this.playerDieEmitter.maxParticleSpeed);
		this.playerDieEmitter.start(true, 3 * 1000, null, 10);

		setTimeout(function(){
			this.player.alive = true;
			this.player.visible = true;
			this.player.body.enable = true;
			this.fireMapEvent('onDeath');
			this.respawnPlayer();
		}.bind(this),3000);
	},
	respawnPlayer: function(){
		this.player.body.velocity.set(0,0);
		this.player.position.copyFrom(this.respawnPoint);
	},
	fireMapEvent: function(event){
		this.buttons.forEach(function(obj){
			if(obj.properties[event]){
				 obj.mapEvent(obj.properties[event]);
			}
		},this);
		this.checkpoints.forEach(function(obj){
			if(obj.properties[event]){
				 obj.mapEvent(obj.properties[event]);
			}
		},this);
		this.doors.forEach(function(obj){
			if(obj.properties[event]){
				 obj.mapEvent(obj.properties[event]);
			}
		},this);
		this.blocks.forEach(function(obj){
			if(obj.properties[event]){
				 obj.mapEvent(obj.properties[event]);
			}
		},this);
	},

	createWire: function(data){
		var margin = 16;
		var wire = game.make.graphics(data.width + margin*2, data.height + margin*2);
		wire.properties = data.properties;
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

		wire.setState = function(state){
			this.alive = state;
			this.render();
		}

		//set state
		wire.setState(parseBool(data.properties.state));

		//set visible
		wire.visible = parseBool(data.properties.visible);

		wire.render();

    	return wire;
	},
	createDoor: function(data){
		var margin = 16;
		var door = game.make.sprite(data.x, data.y);
		var graphics = game.make.graphics(data.width + margin*2, data.height + margin*2);
		graphics.x = - margin;
		graphics.y = - margin;
		door.addChild(graphics);

		door.properties = data.properties;
		game.physics.arcade.enable(door,false);
		door.body.immovableTo = [this.player.body,this.blocks];
		door.body.setSize(data.width,data.height);

		door.render = function(){
			var lineWidth = 2;
			graphics.clear();
			if(this.alive){
				graphics.lineStyle(2,colorsHEX[3], 1);
				graphics.beginFill(colorsHEX[3],0.5);
				graphics.drawRect(margin+(lineWidth/2),margin+(lineWidth/2),data.width-lineWidth, data.height-lineWidth);
				graphics.endFill()
			}
			else{
				graphics.lineStyle(2,colorsHEX[2], 1);
				graphics.drawRect(margin+(lineWidth/2),margin+(lineWidth/2),data.width-lineWidth, data.height-lineWidth);
			}
		}

		door.setState = function(state){
			this.alive = state;
			this.body.enable = state;
			this.render();
		}

		//set state
		door.setState(parseBool(data.properties.state));

		//set visible
		door.visible = parseBool(data.properties.visible);

		door.render();

		return door;
	},
	createButton: function(data){
		var button = game.make.sprite(data.x,data.y,'button');
		button.properties = data.properties;
		button.anchor.set(.5,.5);
		game.physics.arcade.enable(button);
		button.body.setSize(16,16,0,0);

		button.setState = function(state,dontChange){
			if(this.properties.id == undefined) return;

			this.alive = state;
			this.frame = (this.alive)? 0 : 1;

			if(!dontChange){
				Play.wires.forEach(function(obj){
					if(obj.properties.id == this.properties.id){
						obj.setState(state);
					}
				},this)

				Play.doors.forEach(function(obj){
					if(obj.properties.id == this.properties.id){
						obj.setState(state);
					}
				},this)

				Play.blocks.forEach(function(obj){
					if(obj.properties.id == this.properties.id){
						obj.setState(state);
					}
				},this)

				Play.buttons.forEach(function(obj){
					if(obj.properties.id == this.properties.id && obj !== this){
						obj.setState(state,true);
					}
				},this)
			}
		}

		button.mapEvent = function(event){
			switch(event){
				case 'reset':
					this.setState(true);
					break;
				case 'turnOff':
					this.setState(false);
					break;
				case 'turnOn':
					this.setState(true);
					break;
			}
		}

		//set state
		button.setState(parseBool(data.properties.state),true);

		return button;
	},
	createBlock: function(data){
		var block = game.make.sprite(data.x,data.y);
		var graphics = game.make.graphics(data.width, data.height);
		graphics.x = 0;
		graphics.y = 0;
		block.addChild(graphics);
		block.mapData = data;
		block.properties = data.properties;

		game.physics.arcade.enable(block,false);
		block.body.setSize(data.width,data.height);

		block.render = function(){
			var lineWidth = 2;
			graphics.clear();
			if(this.alive){
				graphics.lineStyle(lineWidth, 0x000000, 1);
				graphics.beginFill(colorsHEX[3], 1);
				graphics.drawRect(lineWidth/2,lineWidth/2,data.width-lineWidth, data.height-lineWidth);
				graphics.endFill();
			}
			else{
				graphics.lineStyle(lineWidth, 0x000000, 1);
				graphics.beginFill(colorsHEX[2], 1);
				graphics.drawRect(lineWidth/2,lineWidth/2,data.width-lineWidth, data.height-lineWidth);
				graphics.endFill();
			}
		}

		block.setState = function(state){
			this.alive = state;
			this.body.immovable = state;
			this.body.velocity.set(0,0);
			this.setGravity((state)? 'none' : this.properties.fall);

			this.render();
		}

		block.setGravity = function(dir){
			if(dir == 'none'){
				block.body.gravity.set(0,0)
				return;
			}

			dir = parseDirection(dir);
			block.body.gravity.x = Math.cos(Phaser.Math.degToRad(dir)) * 500;
			block.body.gravity.y = Math.sin(Phaser.Math.degToRad(dir)) * 500;
		}

		block.mapEvent = function(event){
			switch(event){
				case 'reset':
					this.body.position.copyFrom(this.startPosition);
					break;
			}
		}

		//set movable
		// if(!parseBool(block.properties.movable,false)){
			block.body.immovableTo = [this.player.body];
			block.body.friction.set(0,0);
		// }

		//set state
		if(data.properties.id){
			block.setState(true);
		}
		else{
			block.setState(false);
		}

		//set visible
		block.visible = parseBool(data.properties.visible);

		block.startPosition = block.position.clone();

		block.render();

		return block;
	},
	createCheckpoint: function(data){
		var checkpoint = this.checkpoints.create(data.x,data.y,'checkpoint');
		checkpoint.properties = data.properties;
		checkpoint.anchor.set(.5,.5);

		game.physics.arcade.enable(checkpoint);

		//set visible
		checkpoint.visible = parseBool(data.properties.visible);

		return checkpoint;
	},

	render: function(){
		if(!debug) return;

		this.blocks.forEach(function(obj){
			game.debug.body(obj);
		})
		this.doors.forEach(function(obj){
			game.debug.body(obj);
		})
	}
}
