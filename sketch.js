var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;
var backgroundImg
var score=0;
var jumpSound, collidedSound;

var gameOver, restart;


function preload(){
  jumpSound = loadSound("assets/sounds/jump.wav")
  collidedSound = loadSound("assets/sounds/collided.wav")
 
  backgroundImg = loadImage("assets/backgroundImg.png")
  sunAnimation = loadImage("assets/sun.png");
 
  trex_running = loadAnimation("assets/trex_2.png","assets/trex_1.png","assets/trex_3.png");
  trex_collided = loadAnimation("assets/trex_collided.png");
 
  groundImage = loadImage("assets/ground.png");
 
  cloudImage = loadImage("assets/cloud.png");
 
  obstacle1 = loadImage("assets/obstacle1.png");
  obstacle2 = loadImage("assets/obstacle2.png");
  obstacle3 = loadImage("assets/obstacle3.png");
  obstacle4 = loadImage("assets/obstacle4.png");
 
  gameOverImg = loadImage("assets/gameOver.png");
  restartImg = loadImage("assets/restart.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
 
  sun = createSprite(width - 50,100,10,10);
  sun.addAnimation("sun", sunAnimation);
  sun.scale = 0.1
 
  trex = createSprite(width,height-70,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.setCollider('circle',0,0,350)
  trex.scale = 0.1;
 
  ground = createSprite(width/2,height,width,2);
  ground.addImage("ground",groundImage);
   
  invisibleGround = createSprite(width/2,height+15,2000,25);  
  invisibleGround.shapeColor = "#f4cbaa";
  invisibleGround.addImage("ground",groundImage);
  invisibleGround.visible = false;
 
  gameOver = createSprite(trex.x,height/2- 50);
  gameOver.addImage(gameOverImg);
 
  restart = createSprite(trex.x,height/2);
  restart.addImage(restartImg);
 
  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;
 
 
  // invisibleGround.visible =false

  cloudsGroup = new Group();
  obstaclesGroup = new Group();
 
  camera.debug = true;
 
  score = 0;
}

function draw() {
  //trex.debug = true;
 
  background(backgroundImg);

  camera.position.x = trex.x +200;
  camera.position.y = windowHeight/2;
 
  sun.x = trex.x +200;

 
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    //ground.velocityX = -(6 + 3*score/100);
    trex.velocityX = 3;
 
    if((touches.length > 0 || keyDown("SPACE")) && trex.y  >= height-130) {
      jumpSound.play( )
      trex.velocityY = -20;
       touches = [];
    }
   
    trex.velocityY = trex.velocityY + 0.8
 
    if(trex.x > (width-200) ){
        trex.x = 0;
     }
    
    spawnClouds();
    spawnObstacles();
 
    if(obstaclesGroup.isTouching(trex)){
        collidedSound.play()
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.x = trex.x;
    restart.x = trex.x;
    gameOver.visible = true;
    restart.visible = true;
   
    trex.velocityX = 0;
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
   
    trex.changeAnimation("collided",trex_collided);
   
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
   
    if(touches.length>0 || keyDown("SPACE")) {      
      reset();
      touches = []
    }
  }
 
  trex.collide(invisibleGround);
  //trex.collide(ground);
  drawSprites();
  textSize(20);
  fill("black")
  text("Score: "+ score,trex.x,150);
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 120 === 0) {
    var cloud = createSprite(trex.x+700,height-300,40,10);
    cloud.y = Math.round(random(100,220));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;

    cloud.lifetime = 600;
   

    cloud.depth = trex.depth;
    trex.depth = trex.depth+1;
   
  
    cloudsGroup.add(cloud);
  }
 
}

function spawnObstacles() {
  if(frameCount % 120 === 0) {
    var obstacle = createSprite(trex.x+700,height-95,20,30);
    obstacle.setCollider('circle',0,0,45)
    // obstacle.debug = true
    // obstacle.velocityX = -(6 + 3*score/100);
       //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle          
    obstacle.scale = 0.3;
    obstacle.lifetime = 600;
    obstacle.depth = trex.depth;
    trex.depth +=1;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
 
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
 
  trex.changeAnimation("running",trex_running);
 
  score = 0;
 
}
