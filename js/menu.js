var Menu = {
	create: function(){
		this.cursor = this.game.input.keyboard.createCursorKeys();
		this.cursor.up.onDown.add(function(){
			this.selectedIndex = 0;
		},this);
		this.cursor.down.onDown.add(function(){
			if(this.loadButton.visible){
				this.selectedIndex = 1;
			}
		},this);

		game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.addOnce(function(){
			this.play.fill = colors[4];
			this.buttonSound.onStop.addOnce(function(){
				switch(this.selectedIndex){
					case 0:
						game.state.start('Play');
						break;
					case 1:
						game.state.start('Play',true,false,parseInt(localStorage.lvl));
						break;
				}
			},this)
			this.buttonSound.play();
		},this);

		this.title = game.add.image(game.scale.width/2,game.scale.height/4,'title');
		this.title.anchor.set(.5,.5);
		
		this.play = game.add.text(game.scale.width/2,game.scale.height - (game.scale.height/3.5),'Play Game',Object.create(font));
		this.play.anchor.set(.5,.5);
		
		this.loadButton = game.add.text(game.scale.width/2,game.scale.height - (game.scale.height/5.5),'Load Game',Object.create(font));
		this.loadButton.anchor.set(.5,.5);
		this.loadButton.visible = !!localStorage.lvl;

		this.selectedIndex = 0;

		this.mute = game.add.button(game.scale.width-10,10,'sound',function(){
			game.sound.mute = !game.sound.mute;

			if(game.sound.mute)
				this.mute.setFrames(2,0,2,0);
			else 
				this.mute.setFrames(3,1,3,1);

			this.buttonSound.play();
		},this,3,1,3,1);

		this.mute.anchor.set(1,0);
		this.mute.fixedToCamera = true;

		this.buttonSound = game.add.audio('button',.5);
	},
	update: function(){
		if(this.selectedIndex == 0){
			this.loadButton.fill = colors[1];
			this.play.fill = colors[4];
		}
		else if(this.selectedIndex == 1){
			this.play.fill = colors[1];
			this.loadButton.fill = colors[4];
		}
	}
}