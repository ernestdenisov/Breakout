var resultsScreen = null;
var bestResultText = null;
var backButton = null;

resultsScreen = function(game){}
resultsScreen.prototype = {
	preload: function(){
		game.load.image('starfield', 'assets/breakout/starfield.jpg');
		game.load.image('back_button', 'assets/breakout/back_arrow1.png');	
	},
	create: function(){
		game.add.tileSprite(0, 0, 800, 600, 'starfield');		
		highScore = Math.max(score, highScore);
		localStorage.setItem(localStorageName, highScore);
		bestResultText = game.add.text(game.world.width/2, game.world.height/2, 'best: ' + highScore, 
			{ font: "bold 40px Arial", fill: "#ffffff", align: "left" });
		bestResultText.anchor.setTo(0.5, 0.5);
		
		backButton = game.add.button(50, 30, 'back_button', toMain);
		backButton.anchor.setTo(0.5, 0.5);
	},
	update: function(){
		
	},
}

function toMain(){
	game.state.start('mainScreen');
}