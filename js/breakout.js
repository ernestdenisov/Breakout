	var xmlhttp = new XMLHttpRequest();
	
	//debug
	//var url = 'assets/breakout/breakout_levels_debug.json';
	
	//release
	var url = 'assets/breakout/breakout_levels.json';
	var actual_JSON = null;
	var currentLevel = 0;
	var xobj = null;

	var ball = null;
	var paddle = null;
	var brick = null;
	var bricks = null;
	
	var activeBricksAmount = 0;
	var ballOnPaddle = true;

	var lives = 3;
	var score = 0;
	var level = 1;
	var bonusPoints = 0;
	var addPoints = false;

	var scoreText = null;
	var livesText = null;
	var levelText = null;
	var introText = null;
	var breakoutScreen = null;
	
	var brickTypesAmount = 5;
	var bricksArray = [];
	var sounds = [];
	var paddleBallHitSound = null;
	var brickBallHitSound = null;
	var boundBallHitSound = null;
	var levelSuccessSound = null;
	var loseBallSound = null;
	var deathBallSound = null;
	var winSound = null;
	
	breakoutScreen = function(game){}
	breakoutScreen.prototype = {
		preload: function(){
			
			loadJSON(function(response) {
				actual_JSON = JSON.parse(response);
			});
			
			game.load.image('starfield', 'assets/breakout/starfield.jpg');
			game.load.image('back_button', 'assets/breakout/back_arrow1.png');	
			game.load.image('ball', 'assets/breakout/ball.png');
			game.load.image('brick1', 'assets/breakout/brick1.png');
			game.load.image('brick2', 'assets/breakout/brick2.png');
			game.load.image('brick3', 'assets/breakout/brick3.png');
			game.load.image('brick4', 'assets/breakout/brick4.png');
			game.load.image('brick5', 'assets/breakout/brick5.png');
			game.load.image('paddle', 'assets/breakout/paddle.png');
			game.load.audio('paddle_ball_hit', 'assets/breakout/paddle_ball_hit1.wav');
			game.load.audio('brick_ball_hit', 'assets/breakout/brick_ball_hit1.wav');
			game.load.audio('bound_ball_hit', 'assets/breakout/bound_ball_hit1.wav');
			game.load.audio('level_success', 'assets/breakout/level_success1.wav');
			game.load.audio('lose_ball', 'assets/breakout/lose_ball1.wav');
			game.load.audio('death', 'assets/breakout/death1.wav');
			game.load.audio('win', 'assets/breakout/win1.wav');
		},
		
		create: function(){
			
			game.physics.startSystem(Phaser.Physics.ARCADE);
			game.physics.arcade.checkCollision.down = false;
			game.add.tileSprite(0, 0, 800, 600, 'starfield');
			
			backButton = game.add.button(50, 30, 'back_button', toMain);
			backButton.anchor.setTo(0.5, 0.5);
			bricksArray = [];
			
			bricks = game.add.group();
			bricks.enableBody = true;
			bricks.physicsBodyType = Phaser.Physics.ARCADE;
			
			activeBricksAmount = 0;
			currentLevel = 0;
			lives = 3;
			score = 0;
			level = 1;
			bonusPoints = 0;
			ballOnPaddle = true;
			
			buildBricksWall();
	
			paddle = game.add.sprite(game.world.centerX, 500, 'paddle');
			paddle.anchor.setTo(0.5);

			game.physics.enable(paddle, Phaser.Physics.ARCADE);

			paddle.body.collideWorldBounds = true;
			paddle.body.bounce.set(1);
			paddle.body.immovable = true;

			ball = game.add.sprite(paddle.x, paddle.y - 32, 'ball');
			ball.anchor.setTo(0.5);
			ball.scale.x = 1;
			ball.scale.y = 1;
			ball.checkWorldBounds = true;
			ball.x = paddle.x - 32;

			game.physics.enable(ball, Phaser.Physics.ARCADE);

			ball.body.collideWorldBounds = true;
			ball.body.bounce.set(1);

			ball.events.onOutOfBounds.add(ballLost, this);

			scoreText = game.add.text(64, 550, 'score: ' + score, 
				{ font: "bold 20px Arial", fill: "#ffffff", align: "left" });
			scoreText.anchor.setTo(0.5, 0.5);
			
			livesText = game.add.text(720, 550, 'lives: ' + lives, 
				{ font: "bold 20px Arial", fill: "#ffffff", align: "left" });
			livesText.anchor.setTo(0.5, 0.5);
			
			levelText = game.add.text(720 - livesText.width - 30, 550, 'level: ' + level, 
				{ font: "bold 20px Arial", fill: "#ffffff", align: "left" });
			levelText.anchor.setTo(0.5, 0.5);
			
			introText = game.add.text(game.world.centerX, 400, '- click to start -', 
				{ font: "bold 40px Arial", fill: "#ffffff", align: "center" });
			introText.anchor.setTo(0.5, 0.5);

			game.input.onDown.add(releaseBall, this);
			
			paddleBallHitSound = game.add.audio('paddle_ball_hit');
			brickBallHitSound = game.add.audio('brick_ball_hit');
			boundBallHitSound = game.add.audio('bound_ball_hit');
			levelSuccessSound = game.add.audio('level_success');
			loseBallSound = game.add.audio('lose_ball');
			deathBallSound = game.add.audio('death');			
			winSound = game.add.audio('win');			
		},
		
		update: function(){
			paddle.x = game.input.x;

			if (paddle.x < 48){
				paddle.x = 48;
			}else if (paddle.x > game.width - 48){
				paddle.x = game.width - 48;
			}

			if (ballOnPaddle){
				ball.body.x = paddle.x-16;
			}else{
				if(ball.body.x <= 0 || ball.body.x >= 800 || ball.body.y <=0){boundBallHitSound.play()}
				game.physics.arcade.collide(ball, paddle, ballHitPaddle, null, this);
				game.physics.arcade.collide(ball, bricks, ballHitBrick, null, this);
			}
	
			if((currentLevel >= actual_JSON.levels.length)&& (scoreText.x < game.world.width/2)){
				scoreText.x += 10;
				scoreText.y -= 10;
				scoreText.fontSize += 1;
			}
	
			if(addPoints && score < bonusPoints){
				score += 10;
				scoreText.text = 'score: ' + score;
				if(score >= bonusPoints){
					addPoints = false;
				}
			}
		},		
	}

//load JSON with levels
	function loadJSON(callback) {   
		
		xobj = new XMLHttpRequest();
		xobj.overrideMimeType("application/json");
		xobj.open('GET', url, true); 
		xobj.onreadystatechange = function () {
			if (xobj.readyState == 4 && xobj.status == "200") {
				callback(xobj.responseText);
			}
		};
		xobj.send(null);  
	}
	
	function buildBricksWall(){
		activeBricksAmount = actual_JSON.levels[currentLevel].activeBricksAmount;
		console.log(activeBricksAmount);
		for (var y = 0; y < 4; y++){
			for (var x = 0; x < 11; x++){	
				if(actual_JSON.levels[currentLevel].positions[y][x] != 0){
					for(var i = 1; i <= brickTypesAmount; i++){
						if(actual_JSON.levels[currentLevel].positions[y][x] == i){
							addBrick(x, y, i);
						}						
					}
				}
			}
		}
	}
	
	function addBrick(x, y, brickN){
		brick = bricks.create(48 + (x * 64), 100 + (y * 52), 'brick' + brickN);
		brick.body.bounce.set(1);
		brick.body.immovable = true;
		brick.type = brickN;
		bricksArray.push(brick);		
	}
	
	function nextLevel(){
		if(currentLevel < actual_JSON.levels.length){
			clearBricks();
			introText.text = '- click to start -';
			introText.anchor.setTo(0.5, 0.5);
			introText.visible = true;			
			buildBricksWall();
			levelSuccessSound.play();
		}else{
			introText.text =  'YOU WIN';
			introText.anchor.setTo(0.5, 0.5);
			introText.visible = true;
			highScore = Math.max(score, highScore);
			winSound.play();
			setTimeout(function(){
				toMain();
			}, 5000);
		}	
	}
	
	function clearBricks(){
		var bricksLength = bricksArray.length;
		for(var i = 0; i < bricksLength; i++){
			bricksArray[i].kill();
		}		
	}

	function releaseBall () {
		if (ballOnPaddle){
			ballOnPaddle = false;
			ball.body.velocity.y = -400;
			ball.body.velocity.x = -75;
			introText.visible = false;
		}
	}

	function ballLost () {
	
		lives--;
		livesText.text = 'lives: ' + lives;

		if (lives === 0){
			gameOver();
			deathBallSound.play();
		}else{
			ballOnPaddle = true;
			ball.reset(paddle.body.x + 16, paddle.y - 32);        
			ball.animations.stop();
			loseBallSound.play();
		}
	}

function gameOver () {

    ball.body.velocity.setTo(0, 0);
    
    introText.text = 'Game Over!';
    introText.visible = true;
	highScore = Math.max(score, highScore);
	setTimeout(function(){
		toMain();
	}, 2000);
}

function toMain(){
		game.state.start('mainScreen');
	}

function brickDeath(brick){
	if(brick.type !== 5){
	function timeout(){
		setTimeout(function(){
			brick.scale.x -= 0.1;
			brick.scale.y -= 0.1;
			
			if(brick.scale.x <= 0){
				brick.kill();
				activeBricksAmount--;				
				//if (bricks.countLiving() == 0){
				if (activeBricksAmount == 0){
        
					scoreText.text = 'score: ' + score;
					introText.text = '- Next Level -';

					//  Let's move the ball back to the paddle
					ballOnPaddle = true;
					ball.body.velocity.set(0);
					ball.x = paddle.x + 16;
					ball.y = paddle.y - 32;
					ball.animations.stop();
	
					//  And bring the bricks back from the dead :)
					//bricks.callAll('revive');
					currentLevel++;
					lives++;
					level++;
					livesText.text = 'lives: ' + lives;
					levelText.text = 'lives: ' + level;
					nextLevel();
					addPoints = true;
					bonusPoints = score + 1000;
					highScore = Math.max(bonusPoints, highScore);
				}				
					return;
			}
			timeout();
		}, 17);
	}
timeout();	}
}

function ballHitBrick (_ball, _brick) {
	brickDeath(_brick);
    //_brick.kill();
	switch(_brick.type){
		case 1:
			score += 10;
			break;
		case 2:
			score += 20;
			break;
		case 3:
			score += 30;
			break;
		case 4:
			score += 40;
			break;
		default:
			score += 0;
	}
		highScore = Math.max(score, highScore);
    scoreText.text = 'score: ' + score;
	
	brickBallHitSound.play();

    //if (bricks.countLiving() == 0){
    if (activeBricksAmount == 0){
        
      scoreText.text = 'score: ' + score;
      introText.text = '- Next Level -';

      ballOnPaddle = true;
      ball.body.velocity.set(0);
      ball.x = paddle.x + 16;
      ball.y = paddle.y - 32;
      ball.animations.stop();
		
			currentLevel++;
			lives++;
			livesText.text = 'lives: ' + lives;
			nextLevel();
			addPoints = true;
			bonusPoints = score + 1000;
			highScore = Math.max(bonusPoints, highScore);
    }
}

function ballHitPaddle (_ball, _paddle) {	
	paddleBallHitSound.play();
    var diff = 0;

    if (_ball.x < _paddle.x)
    {
        //  Ball is on the left-hand side of the paddle
        diff = _paddle.x - _ball.x;
        _ball.body.velocity.x = (-10 * diff);
    }
    else if (_ball.x > _paddle.x)
    {
        //  Ball is on the right-hand side of the paddle
        diff = _ball.x -_paddle.x;
        _ball.body.velocity.x = (10 * diff);
    }
    else
    {
        //  Ball is perfectly in the middle
        //  Add a little random X to stop it bouncing straight up!
        _ball.body.velocity.x = 2 + Math.random() * 8;
    }
}