var lvl1 = {};

lvl1.Main = function(game) {
  
  
};

lvl1.Main.prototype = {
  preload: function(){
    game.load.baseURL = 'https://diotest.github.io/Shooter/';
			game.load.crossOrigin = 'anonymous';
			
	game.load.image('starfield', 'assets/starfield.png');
			game.load.image('starfield3', 'assets/starfield3.png');
			game.load.image('ship', 'assets/ship.png');
			game.load.image('bullet', 'assets/bullets/bullet.png');
			game.load.audio('LaserBlaster',['assets/sounds/laser.mp3','assets/sounds/laser.ogg']);
			game.load.image('enemy2', 'assets/enemies/enemy2.png');
			game.load.spritesheet('explosion', '/assets/explode.png', 128, 128);
			game.load.bitmapFont('spacefont', '/assets/spacefont/spacefont1.png', '/assets/spacefont/spacefont1.xml');
			game.load.image('enemy3', '/assets/enemies/enemy3.png');
            game.load.image('secondEnemyBullet', '/assets/bullets/blue-enemy-bullet.png');
    

},
create: function(){
    LaserBlaster1 = game.add.audio('LaserBlaster',0.8);
			game.scale.pageAlignHorizontally = true;
			
			//  The scrolling starfield background
			starfield = game.add.tileSprite(0, 0, 1100, 900, 'starfield');
			
			
			
			//  Our bullet group
			bullets = game.add.group();
			bullets.enableBody = true;
			bullets.physicsBodyType = Phaser.Physics.ARCADE;
			bullets.createMultiple(30, 'bullet');
			bullets.setAll('anchor.x', 0.5);
			bullets.setAll('anchor.y', 1);
			bullets.setAll('outOfBoundsKill', true);
			bullets.setAll('checkWorldBounds', true);
			//  The hero!
			player = game.add.sprite(100, game.height / 2, 'ship');
            player.health = 100;
			player.anchor.setTo(0.5, 0.5);
			game.physics.enable(player, Phaser.Physics.ARCADE);
			player.body.maxVelocity.setTo(MAXSPEED, MAXSPEED);
			player.body.drag.setTo(DRAG, DRAG);
            player.weaponLevel = 1;
            
            // player kill
            player.events.onKilled.add(function(){
	        shipTrail.kill();
    		});
            //player revive
             player.events.onRevived.add(function(){
       		shipTrail.start(false, 5000, 10);
	    	});
            
			//  And some controls to play the game with
			cursors = game.input.keyboard.createCursorKeys();
			fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
			//  Add an emitter for the ship's trail
			shipTrail = game.add.emitter(player.x - 20, player.y, 400);
			shipTrail.height = 10;
			shipTrail.makeParticles('bullet');
			shipTrail.setYSpeed(20, -20);
			shipTrail.setXSpeed(-140, -120);
			shipTrail.setRotation(50, -50);
			shipTrail.setAlpha(1, 0.01, 800);
			shipTrail.setScale(0.05, 0.4, 0.05, 0.4, 2000,
					Phaser.Easing.Quintic.Out);
			shipTrail.start(false, 5000, 10);
			
            
                //  An explosion pool
    explosions = game.add.group();
    explosions.enableBody = true;
    explosions.physicsBodyType = Phaser.Physics.ARCADE;
    explosions.createMultiple(30, 'explosion');
    explosions.setAll('anchor.x', 0.5);
    explosions.setAll('anchor.y', 0.5);
    explosions.forEach( function(explosion) {
        explosion.animations.add('explosion');
    });
            
            
                //  Big explosion
    playerDeath = game.add.emitter(player.x, player.y);
    playerDeath.width = 50;
    playerDeath.height = 50;
    playerDeath.makeParticles('explosion', [0,1,2,3,4,5,6,7], 10);
    playerDeath.setAlpha(0.9, 0, 800);
    playerDeath.setScale(0.1, 0.6, 0.1, 0.6, 1000, Phaser.Easing.Quintic.Out);

            
            
            
                //  Shields stat
    shields = game.add.bitmapText(game.world.width - 250, 10, 'spacefont', '' + player.health +'%', 20);
   shields.render = function () {
       shields.text = 'Shields: ' + Math.max(player.health, 0)+'%';
    };
    shields.render();        
            
            
            
            
            
            
            
            
			
			    //  The baddies!
    			firstEnemy = game.add.group();
   				firstEnemy.enableBody = true;
    			firstEnemy.physicsBodyType = Phaser.Physics.ARCADE;
    			firstEnemy.createMultiple(15, 'enemy2');
    			firstEnemy.setAll('anchor.x', 0.5);
    			firstEnemy.setAll('anchor.y', 0.5);
    			firstEnemy.setAll('scale.x', 0.5);
    			firstEnemy.setAll('scale.y', 0.5);
    			firstEnemy.setAll('angle', 0);
    			//firstEnemy.setAll('outOfBoundsKill', true);
   				//firstEnemy.setAll('checkWorldBounds', true);
				
                
                firstEnemy.forEach(function(enemy){
       				addEnemyEmitterTrail(enemy);
                    enemy.damageAmount = 20;
        			enemy.events.onKilled.add(function(){
            			enemy.trail.kill();
        			});
    			});
                
                
                
                
                
                
   				game.time.events.add(1000, launchfirstEnemy);
                
                
                
                
                
             //  second enemy's bullets
    secondEnemyBullets = game.add.group();
    secondEnemyBullets.enableBody = true;
    secondEnemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
    secondEnemyBullets.createMultiple(15, 'secondEnemyBullet');
    secondEnemyBullets.callAll('crop', null, {x: 90, y: 0, width: 90, height: 70});
    secondEnemyBullets.setAll('alpha', 0.9);
    secondEnemyBullets.setAll('anchor.x', 0.5);
    secondEnemyBullets.setAll('anchor.y', 0.5);
    secondEnemyBullets.setAll('outOfBoundsKill', true);
    secondEnemyBullets.setAll('checkWorldBounds', true);
    secondEnemyBullets.forEach(function(enemy){
        enemy.body.setSize(20, 20);
    });   
                
                
                
                
                
         //more baddies       
    secondEnemy = game.add.group();
    secondEnemy.enableBody = true;
    secondEnemy.physicsBodyType = Phaser.Physics.ARCADE;
    secondEnemy.createMultiple(30, 'enemy3');
    secondEnemy.setAll('anchor.x', 0.5);
    secondEnemy.setAll('anchor.y', 0.5);
    secondEnemy.setAll('scale.x', 0.5);
    secondEnemy.setAll('scale.y', 0.5);
    secondEnemy.setAll('angle', 180);
    secondEnemy.forEach(function(enemy){
        enemy.damageAmount = 40;
    });

   // game.time.events.add(1000, launchsecondEnemy);
                
                
                
                
                
                
                
			
		
        //  Score
    scoreText = game.add.bitmapText(10, 10, 'spacefont', '', 20);
    scoreText.render = function () {
        scoreText.text = 'Score: ' + score;
    };
    scoreText.render();
        
        
        
			    //  Game over text
    gameOver = game.add.bitmapText(game.world.centerX, game.world.centerY, 'spacefont', 'GAME OVER!', 110);
    gameOver.x = gameOver.x - gameOver.textWidth / 2;
    gameOver.y = gameOver.y - gameOver.textHeight / 3;
    gameOver.visible = false;
			
			
			
			
			
		}
    
}
};
