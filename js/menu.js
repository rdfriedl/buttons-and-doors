var Menu = {
	create: function(){
		this.title = game.add.image(game.scale.width/2,game.scale.height/4,'title');
		this.title.anchor.set(.5,.5);
		
		this.play = game.add.text(game.scale.width/2,game.scale.height - (game.scale.height/3.5),'Play Game',Object.create(font));
		this.play.anchor.set(.5,.5);

		this.playButton = game.add.button(game.scale.width/2,game.scale.height - (game.scale.height/3.5),'menuButton',function(){
			this.buttonSound.onStop.addOnce(function(){
				game.state.start('Play');
			})
			this.buttonSound.play();
		},this,2,0,2,2);
		this.playButton.anchor.set(.5,.5);
		this.playButton.width = this.play.width + 32;
		this.playButton.height = this.play.height + 16;
		// this.playButton.addChild(this.play);
		
		this.load = game.add.text(game.scale.width/2,game.scale.height - (game.scale.height/6),'Load Game',Object.create(font));
		this.load.anchor.set(.5,.5);
		this.load.visible = !!localStorage.lvl;

		this.loadButton = game.add.button(game.scale.width/2,game.scale.height - (game.scale.height/6),'menuButton',function(){
			this.buttonSound.onStop.addOnce(function(){
				game.state.start('Play',true,false,parseInt(localStorage.lvl));
			})
			this.buttonSound.play();
		},this,2,0,2,2);
		this.loadButton.anchor.set(.5,.5);
		this.loadButton.width = this.load.width + 32;
		this.loadButton.height = this.load.height + 16;
		// this.loadButton.addChild(this.load);

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
	}
}