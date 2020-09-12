var SCORE = 0;
var LOOSED = false; 


var gameConfig = {
    velocity: 1,
    birdAceleration: 5,
}

const lifecycle = {
    preload(){
        game.load.image('background', 'assets/background.png');
        game.load.image('bird', 'assets/bird.png');
        game.load.image('pipe_bottom', 'assets/pipebottom.png');
        game.load.image('pipe_top', 'assets/pipetop.png');
       
    },
    create(){
        this.score = 0;
        this.bg = game.add.tileSprite(0,0,400,500,'background');
        this.bird = game.add.sprite(100, 250, 'bird');

        game.physics.enable( [this.bird], Phaser.Physics.ARCADE);
    
        this.bird.body.collideWorldBounds = true;
        this.bird.body.gravity.y = 800;


        this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        
        this.upKey.onDown.add(function(){
            this.verifyRestart();
            this.bird.body.velocity.y-=300;
        },this)
        this.obstacules=[];
        this.scoreText = game.add.text(10, 10, `Pontuação: ${SCORE}`, { font: '12px "Press Start 2P"', fill: "#f54542" });
        
    },
    update(){
        this.bg.tilePosition.x -= gameConfig.velocity;
        
        this.obstacules.forEach(obstacle => {
            if(obstacle.top.x<100){
                SCORE+=1;
                this.obstacules.splice(obstacle, 1);
            }else{
            }
        });

        if(this.obstacules.length<1){

            let height = 50 + Math.floor(100 * Math.random());

            let top = game.add.sprite(game.world.width, 300-height, 'pipe_top');
            top.anchor.setTo(0, 1);
			game.physics.arcade.enable(top);
			top.body.velocity.x = -150; 
			top.outOfBoundsKill = true;
            top.checkWorldBounds = true;

            let bottom = game.add.sprite(game.world.width, 400-height, 'pipe_bottom');	
			game.physics.arcade.enable(bottom);
			bottom.body.velocity.x = -150; 
			bottom.outOfBoundsKill = true;
			bottom.checkWorldBounds = true;   
            
            this.obstacules.push({bottom, top})
        }

        if (this.verifyLose()){
            game.paused=true;
            var loseText = game.add.text(80, 250, `Você perdeu`, { font: '22px "Press Start 2P"', fill: "#f54542" });
            LOOSED = true;
        }
        this.scoreText.text = `Pontuação: ${SCORE}`
    },
    
    verifyLose(){
        if(game.physics.arcade.overlap(this.bird, this.obstacules[0].top) || game.physics.arcade.overlap(this.bird, this.obstacules[0].bottom)){
            return true;
        }
        if(this.bird.body.blocked.up || this.bird.body.blocked.down ){
            return true;
        }
    },
    verifyRestart(){
        if(LOOSED){
            SCORE = 0;
            LOOSED=false;
            game.paused = false;
            game.state.start('game');
        }
    }

}
var game = new Phaser.Game(400,500)
game.state.add('game', lifecycle);

game.state.start('game');
