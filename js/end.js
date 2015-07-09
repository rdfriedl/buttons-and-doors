End = {
	create: function(){
		this.cursor = this.game.input.keyboard.createCursorKeys();
		
		var text = game.add.text(game.scale.width/2,game.scale.height - (game.scale.height/6),'Press the "up" arrow to start',font);
		text.anchor.set(.5,.5);

		this.mute = game.add.button(game.scale.width-10,10,'sound',function(){
			game.sound.mute = !game.sound.mute;

			if(game.sound.mute)
				this.setFrames(2,0,2,0);
			else 
				this.setFrames(3,1,3,1);
		},undefined,3,1,3,1);

		this.mute.anchor.set(1,0);
		this.mute.fixedToCamera = true;
	},
	update: function(){
		if(this.cursor.up.isDown){
			game.state.start('Play');
		}
	}
}