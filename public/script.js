let config = {
    type: Phaser.AUTO,      
    width: 800,
    height: 600,                 
    scene: {
        preload,        
        create,
        update
    },
    physics: {
        default: 'arcade',     
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    }
}

let game = new Phaser.Game(config);

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;

var grammar = '#JSGF V1.0;'

var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.lang = 'en-IN'; 
recognition.interimResults = true;
recognition.maxAlternatives = 2;
recognition.continuous=true;
recognition.start();
let x=0;            
let y=0;
let timer=0;
var gameOver = false;

recognition.onresult = function(event) {
     
    let len = event.results.length;
    for(let i =event.resultIndex;i<len;i++)
    {
        let command = event.results[i][0].transcript;
        command=command.split(' ').pop().toLowerCase();
        console.log(command);
        if(command=="bike"||command=="left"||command=="let"||command=="that"||command=="love")
        {
   
            x=1;
        }
        else if(command=="right"||command=="write"||command=="white"||command=="strike")
        {
           x=2;
     
        }else if((command=="camp"||command=="jab"||command=="jump"||command=="junk"||command=="jung"||command=="champ")&&timer==0)
        {
            y=1;

        
        }else if(command=="soap"||command == "stop"||command=="top"||command=="star"||command=="stock"||command=="talk")
        {
            player.setVelocityX(0);         
            player.anims.play('turn', true);      
            x=0;        
                
        }
   

    }

};
function preload() {
    this.load.image('sky', './assets/sky.png');  
    this.load.image('bomb', './assets/bomb.png');
    this.load.image('star', './assets/star.png');
    this.load.image('ground', './assets/platform.png');
    this.load.spritesheet('dude', './assets/dude.png',
        { frameWidth: 32, frameHeight: 48 }  

    );

    this.load.audio('top2','./assets/sound/yo.ogg');
 
}
var platforms;
var player;
var stars;
var score = 0;
var scoretext;
var bombs;
var yo;
function create() {

    this.add.image(400, 300, 'sky');          
    platforms = this.physics.add.staticGroup();        
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');
    yo = this.sound.add('top2');


    player = this.physics.add.sprite(100, 450, 'dude');       
    player.setCollideWorldBounds(true);               
    player.setBounce(0.2);              
    this.anims.create({                 
        key: 'left',               
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),        
        frameRate: 10,                   
        repeat: -1                       

    });
    this.anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 4 }],  
        frameRate: 20
    });
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    this.physics.add.collider(platforms, player);   

    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 10, y: 0, stepX: 70 }
    });

    stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        child.setCollideWorldBounds(true);
    });
    bombs = this.physics.add.group()  
    scoretext = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: 'black' });

    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(stars, player, collectStar, null);         

    this.physics.add.collider(platforms, bombs);
    this.physics.add.overlap(bombs,player,hitbomb,null,this);

}
function collectStar(player, star) {
    star.disableBody(true, true);
    score += 10;
    scoretext.setText('score: ' + score);
    if (stars.countActive(true) === 0) {
        stars.children.iterate(function(child) {
            child.enableBody(true, child.x, 0, true, true);
        });
        let x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
        let bomb = bombs.create(x, 16, 'bomb');
        bomb.setCollideWorldBounds(true);
        bomb.setBounce(1);
        // yo.play();
        bomb.setVelocity(Phaser.Math.Between(-200,200),20);
    }
}

function hitbomb(player, bomb) {
    this.physics.pause();
    player.setTint('0xff0000');
    gameOver = true;
    this.add.text(400,300,'GAME OVER!!!',{fontSize:'50px',fill:'red'});
    player.anims.play('turn');
}



function update() {
    if(gameOver){
        return;
    }
    let cursors = this.input.keyboard.createCursorKeys();
    if(timer>0)
        timer--;
    if (cursors.left.isDown || (!cursors.right.isDown&&x==1))     
    {
        if(x==2)
            x=0;
        player.setVelocityX(-160);          
        player.anims.play('left', true);     
    }
    else if (cursors.right.isDown|| x==2)       
    {
        if(x==1)
            x=0;
        player.setVelocityX(160);           
        player.anims.play('right', true);       
    }
    else if(x==0) {           
        player.setVelocityX(0);         
        player.anims.play('turn', true);     
    }

    if (((y==1&&timer==0)||cursors.up.isDown) && player.body.touching.down)      
    {
        player.setVelocityY(-360);      
        y=0;
        timer=100;

    }
  

}
