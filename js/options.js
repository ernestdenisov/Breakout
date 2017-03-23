var optionsScreen = null;
var musicScale = null;
var musicSlider = null;
var dragBounds1 = null;

optionsScreen = function(game){}
optionsScreen.prototype = {
	preload: function(){
		game.load.image('starfield', 'assets/breakout/starfield.jpg');
		game.load.image('back_button', 'assets/breakout/back_arrow1.png');	
		game.load.image('music_volume_scale', 'assets/breakout/button10.png');	
		game.load.image('music_volume_slider', 'assets/breakout/button11.png');	
	},
	create: function(){
		game.add.tileSprite(0, 0, 800, 600, 'starfield');		
		
		backButton = game.add.button(50, 30, 'back_button', toMain);
		backButton.anchor.setTo(0.5, 0.5);
		musicScale = game.add.image(game.world.width/2, game.world.height/2 - 50,'music_volume_scale');
		musicScale.anchor.setTo(0.5);
		musicScale.scale.set(1, 0.5);
		
		dragBounds1 = new Phaser.Rectangle(musicScale.x - musicScale.width/2,
			musicScale.y - musicScale.height, musicScale.width, 24);
		musicSlider = game.add.image(game.world.width/2, game.world.height/2 - 38,'music_volume_slider');
		musicSlider.anchor.setTo(1);
		musicSlider.inputEnabled = true;
		musicSlider.input.enableDrag(false, false, false, 255, dragBounds1, null);
		musicSlider.events.onDragUpdate.add(onDragUpdate, this);
		//musicSlider.events.onDragStop.add(onDragStop, this);
		game.add.text(game.world.width/2 - musicScale.width/2 - 15, game.world.height/2 - 55, '0', 
			{ font: "bold 20px Arial", fill: "#ffffff", align: "left" }).anchor.setTo(0.5, 0.5);
			game.add.text(game.world.width/2 + musicScale.width/2 + 25, game.world.height/2 - 55, '100', 
			{ font: "bold 20px Arial", fill: "#ffffff", align: "left" }).anchor.setTo(0.5, 0.5);
	},
	update: function(){
		
	},
}
function onDragUpdate(_musicSlider){
	bgMusic.volume = (_musicSlider.x - game.world.width/2 + musicScale.width/2)/240;
}
function onDragStop(_musicSlider){
	
}
function toMain(){
	game.state.start('mainScreen');
}