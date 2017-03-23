var game = new Phaser.Game(
	800, 
	600, 
	Phaser.AUTO, 
	'phaser-example'
);
var localStorageName = 'breakout_best_results';
var highScore = 0;
var bgMusic = null;
var music = [];
var mouseOverSound = null;
var isPlaying = false;

window.onload = function(){
	var button = null;
	var text = null;
	
	var mainScreen = null;
	
	
	mainScreen = function(){}
	mainScreen.prototype = {
		preload: function(){
			game.load.image('starfield', 'assets/breakout/starfield.jpg');		
			game.load.image('button', 'assets/breakout/button9.png');		
			game.load.audio('bg_music', 'assets/breakout/bg_music1.mp3');
			game.load.audio('mouseOverSound', 'assets/breakout/button_mouse_over1.wav');			
		},
		create: function(){
			game.add.tileSprite(0, 0, 800, 600, 'starfield');
			button = game.add.button(game.world.width/2, 240, 'button', actionOnClick1);
			button.anchor.setTo(0.5, 0.5);
			button.onInputOver.add(over, this);
			button.onInputOut.add(out, this);
			text = game.add.text(0, 0, "START", 
				{ font: "25px Arial bold", fill: "#ffffff", align: "center"});
			text.anchor.setTo(0.5, 0.5);
			button.addChild(text);
				
			button = game.add.button(game.world.width/2, 300, 'button', actionOnClick2);
			button.anchor.setTo(0.5, 0.5);
			button.onInputOver.add(over, this);
			button.onInputOut.add(out, this);
			text = game.add.text(0, 0, "SCORE", 
				{ font: "25px Arial bold", fill: "#ffffff", align: "center"});
			text.anchor.setTo(0.5, 0.5);
			button.addChild(text);

			button = game.add.button(game.world.width/2, 360, 'button', actionOnClick3);
			button.anchor.setTo(0.5, 0.5);
			button.onInputOver.add(over, this);
			button.onInputOut.add(out, this);
			text = game.add.text(0, 0, "OPTIONS", 
				{ font: "25px Arial bold", fill: "#ffffff", align: "center"});
			text.anchor.setTo(0.5, 0.5);
			button.addChild(text);
			mouseOverSound = game.add.audio('mouseOverSound');	
			
			if(!isPlaying){
				bgMusic = game.add.audio('bg_music');
				//bg_music.loopFull(1);
				music = [bgMusic];
				game.sound.setDecodedCallback(music, startPlay, this);
			}
		},
		update: function(){
		},
	}
	function startPlay(){
			bgMusic.loopFull(0.6);
			bgMusic.onLoop.add(hasLooped, this);			
			bgMusic.volume = 0.5;
			isPlaying = true;
	}
	function hasLooped(){
		
	}
	function actionOnClick1(_button){
		
		_button.scale.x = 0.95;
		_button.scale.y = 0.95;
		setTimeout(function(){
			_button.scale.x = 1;
			_button.scale.y = 1;
		}, 200);
		setTimeout(function(){
			toGameOne();
		}, 200);
	}
	function actionOnClick2(_button){
		
		_button.scale.x = 0.95;
		_button.scale.y = 0.95;
		setTimeout(function(){
			_button.scale.x = 1;
			_button.scale.y = 1;
		}, 200);
		setTimeout(function(){
			toResults();
		}, 200);
	}
	function actionOnClick3(_button){
		
		_button.scale.x = 0.95;
		_button.scale.y = 0.95;
		setTimeout(function(){
			_button.scale.x = 1;
			_button.scale.y = 1;
		}, 200);
		setTimeout(function(){
			toOptions();
		}, 200);
	}
	
	function over(_button) {
		_button.scale.x = 0.95;
		_button.scale.y = 0.95;
		mouseOverSound.play();
	}

	function out(_button) {
		_button.scale.x = 1;
		_button.scale.y = 1;
	}
	
	function toGameOne(){
		game.state.start('breakoutScreen');
	}
	function toResults(){
		game.state.start('resultsScreen');
	}	
	function toOptions(){
		game.state.start('optionsScreen');
	}
	
	game.state.add('breakoutScreen', breakoutScreen);	
	game.state.add('resultsScreen', resultsScreen);
	game.state.add('optionsScreen', optionsScreen);
	game.state.add('mainScreen', mainScreen);
	
	highScore = localStorage.getItem(localStorageName) == null ? 0 :
		localStorage.getItem(localStorageName);
	game.state.start('mainScreen');
}