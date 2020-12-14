class Game{
    constructor(){

    }
    getState() {
        var gameStateRef = database.ref('gameState');
        gameStateRef.on("value", function (data) {
            gameState = data.val();
        })

    }

    update(state) {
        database.ref('/').update({
            gameState: state
        });
    }
    async start() {
            if (gameState === 0) {
                player = new Player();
                var playerCountRef = await database.ref('playerCount').once("value");
                if (playerCountRef.exists()) {
                    playerCount = playerCountRef.val();
                    player.getCount();
                }
                form = new Form()
                form.display();
            }
            player1 = createSprite(200,500);
            player1.addImage("player1",player_img);
            
            player2 = createSprite(800,500);
            player2.addImage("player2", player_img);
            players=[player1,player2];
            passedFinish= false; // C-41 LB
        }
    
    play(){
        //passedFinished = false;
                form.hide();

                Player.getPlayerInfo();
                player.getFinishedPlayers(); //LB

                 image(back_img, 0, 0, 1000, 800);
                 var x =100;
                 var y=200;
                 var index =0;
                 drawSprites();
                 for(var plr in allPlayers)
                 {
                     index = index+1;
                     x = 500-allPlayers[plr].distance;
                     y=500;
                     
                     players[index -1].x = x;
                     players[index - 1].y = y;
                       
                     if(index === player.index){
                         
                         // to display player name on the basket.
                         //P-41 BG-2
                         fill("black");
                         textSize(25);
                         text(allPlayers[plr].name ,x-25,y+25);
                         
                     }
                    
                     //text to display player score.
                      //Display player score - P-41 BG-3
                    textSize(25);
                    fill("white");
                    text("Player 1 :" + allPlayers.player1.name + "--> " + allPlayers.player1.score,50,50);
                    text("Player 2 :"  + allPlayers.player2.name + "--> " + allPlayers.player2.score, 50, 100);
                 
                 }
                
                if (keyIsDown(RIGHT_ARROW) && player.index !== null  && passedFinish!==true) {
                    player.distance -= 10
                    player.update();
                }
                if (keyIsDown(LEFT_ARROW) && player.index !== null && passedFinish!==true) {
                    player.distance += 10
                    player.update();
                }
            
                 if (frameCount % 20 === 0) {
                     fruits = createSprite(random(100, 1000), 0, 100, 100);
                     fruits.velocityY = 6;
                     var rand = Math.round(random(1,5));
                     switch(rand){
                         case 1: fruits.addImage("fruit1",fruit1_img);
                         break;
                         case 2: fruits.addImage("fruit1", fruit2_img);
                         break;
                         case 3: fruits.addImage("fruit1", fruit3_img);
                         break;
                         case 4: fruits.addImage("fruit1", fruit4_img);
                         break;
                         case 5: fruits.addImage("fruit1", fruit5_img);
                         break;
                     }
                     fruitGroup.add(fruits);
                     
                 }
                 
                  if (player.index !== null) {
                     //fill code here, to destroy the objects. (Use the one in the class project 39)
                     // add the condition to calculate the score. and use update ti update the values in the database.
                     //P-41 BG 4
                     for(var i=0; i < fruitGroup.length; i++){
                        if(fruitGroup.get(i).isTouching(players)){
                            fruitGroup.get(i).destroy();

                            player.score = player.score+1;
                            player.update();
                        }
                    }
                  } 

                  if(player.score === 5  && passedFinish===false){
                    Player.updateFinishedPlayers();
                    console.log("Finished player :"+finishedPlayers);
                    player.rank= finishedPlayers;
                    player.update();
                    
                    fruitGroup.setVelocityYEach(0);
                    fruitGroup.destroyEach();
                    passedFinish= true;
                }
                else if (player.score === 5 && passedFinish === true){
                    fruitGroup.setVelocityYEach(0);
                    fruitGroup.destroyEach();
                }
            }

    end(){
       console.log("Game Ended");
    }

    reset(){
        database.ref('/').update({
            gameState: 0,
            players : null,
            playerCount :0,
            finishedPlayers : 0
        });
    }

    //C-41 LB
  displayRanks(){
    camera.position.x =0;
    camera.position.y = 0;
     
    imageMode(CENTER);
    Player.getPlayerInfo();

  //  image(bronze_img, displayWidth/-4, -100 + displayHeight/9, 200, 240);
    image(silver_img, displayWidth/4, -100 + displayHeight/10, 225, 270);
    image(gold_img, displayWidth/4-500,0, 250, 300);

    textAlign(CENTER);
    textSize(50);
    for(var plr in allPlayers){
      if(allPlayers[plr].rank === 1){
        text("1st :  "+allPlayers[plr].name,displayWidth/4-500,190);
      }
      else if(allPlayers[plr].rank === 2){
        text("2nd: " + allPlayers[plr].name, displayWidth/4, displayHeight/9 + 73);
      }
      /*else if(allPlayers[plr].rank === 3){
        text("3rd: " + allPlayers[plr].name, displayWidth/-4, displayHeight/10 + 76);
      }else{
        textSize(30);
        text("Honorable Mention: " + allPlayers[plr].name, 0, 225);
      }*/
    }
  }
}