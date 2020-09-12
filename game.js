
var maxScore = 0;
var N = 1;



var mainState = {

    preload: function() { 
        // Load the bird sprite
        game.load.image('bird', 'assets/bird.png'); 
        game.load.image('pipe_top', 'assets/pipetop.png');
        game.load.image('pipe_bot', 'assets/pipebottom.png');
        game.load.image('background', 'assets/background.png');
    },
    
    create: function() { 
        
        // Configura como será a físca do sistema
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        this.bg = game.add.tileSprite(0,0,400,500,'background');

    

        this.birds = [];
        for (let i = 0; i < N; i++) {
            let b = game.add.sprite(80, 200+i*20, 'bird');
            game.physics.arcade.enable(b);
            b.body.gravity.y = 500; // ToDo (Baseei no valor do vídeo, pq esse da gravidade é quanto ele vai cair)
            b.anchor.setTo(-0.2, 0.5);
            this.birds.push(b);
        }
		
		
    
        // configura a tecla para a ação de pulo
		// usando a barra de espaço
        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        spaceKey.onDown.add(this.flap, this);     



		this.distInsere = 0;
		this.obstacules=[];
		for (let i = 0; i < 1; i++) {
			let obs = this.makeObstacule(); 
            this.obstacules.push(obs[0]);
            this.obstacules.push(obs[1]);
		}

        this.score = 0;
        this.labelScore = game.add.text(10, 10, `Score:  ${this.score}`, { font: "18px Arial", fill: "#ffffff" });   
        this.labelMaxScore = game.add.text(10, 30, `Max score: ${maxScore}`, { font: "18px Arial", fill: "#ffffff" });  
	
    },
	
	makeObstacule: function(){
		
			let altura = 50 + Math.floor(100 * Math.random());
			
            let pipetop = game.add.sprite(game.world.width, 300-altura, 'pipe_top');
            pipetop.anchor.setTo(0, 1);
			game.physics.arcade.enable(pipetop);
			pipetop.body.velocity.x = -150; 
			pipetop.outOfBoundsKill = true;
            pipetop.checkWorldBounds = true;
            
            
			let pipebot = game.add.sprite(game.world.width, 400-altura, 'pipe_bot');	
			game.physics.arcade.enable(pipebot);
			pipebot.body.velocity.x = -150; 
			pipebot.outOfBoundsKill = true;
			pipebot.checkWorldBounds = true;            

            
            
			this.distInsere = 100;
			return [pipetop, pipebot];
		
		
	},

    
    update: function() {
        
        for (let i in this.birds) {
            // ToDo
        }
		
		 for (let i in this.obstacules) {
			if( this.birds[0] && ((this.obstacules[i].x+this.obstacules[i].width/2) < (this.birds[0].x-this.birds[0].width/2)) )
			{
				this.obstacules.splice(i,1);
			}
			 
		 }
		 
		if(this.distInsere == 0){
            let obs = this.makeObstacule();
            this.obstacules.push(obs[0]);
            this.obstacules.push(obs[1]);
        }
		else
			this.distInsere--;		

        //Aqui tenho que fazer essa verificação pra ver se o score é maior pq se caso for true, o maxScore, tem que ser atualizado
		// ToDo	
		if(maxScore<score){
			maxScore = score
			this.labelScore.text = `Score:  ${maxScore}`;     
			this.labelMaxScore.text = `Max score: ${maxScore}`;  
        }
		
        this.score += 1;
		//pipebot.body.velocity.x = -150; Copiei do que estava lá em cima, mas não entendi essa atualização.
		this.background.tilePosition.x -= 150; // ToDo	
    },
	
	isGameOver: function(){
        // ToDo		
	},
	
	
	isDead: function(bird){

        if ( (bird.y - bird.height/2) < 0 || (bird.y+bird.height/2) > game.world.height ){
            return true;
        }

        if(game.physics.arcade.overlap(bird, this.obstacules[0]) || game.physics.arcade.overlap(bird, this.obstacules[1])){
            return true;
        }

        return false;
    },


    // Faz o pássaro pular
    flap: function() {

        for (let i in this.birds) {
            if (this.birds[i].alive == false)
                return; 
        }


        for (let i in this.birds) {
            this.birds[i].body.velocity.y = -300;
            game.add.tween(this.birds[i]).to({angle: -15}, 100).start(); 

        }            
    
    },

    // Reinicia o jogo
    restartGame: function() {
        game.state.start('main');
    },


 

};

// Initialize Phaser, and create a 400px by 490px game
var game = new Phaser.Game(600, 500);

// Add the 'mainState' and call it 'main'
game.state.add('main', mainState); 

// Start the state to actually start the game
game.state.start('main');

