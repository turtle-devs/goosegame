
function randomFromArray(array) {
  return array[Math.floor(Math.random()*array.length) ]

}
function randomSafeSpot(){
  let maxXlimit=31;
  let randX = Math.random() * maxXlimit;
  randX=Math.floor(randX);
  let maxYlimit=15
  let randY = Math.random() * maxYlimit
  randY=Math.floor(randY);
  x=randX
  y=randY
  return [{x, y}]
}
const mapData={
  minX:0,
  maxX:31,
  minY:0,
  maxY:15,
  blockedSpaces:{
    "-10x-10":true

  }
}

function getKeyString(x,y) {
  return `${x}x${y}`;
}
function createName(){
  const adj=randomFromArray([
    "cool",
    "awesome",
    "pretty",
    "smart",
    "i dont know",
    "kind",
    "pretty cool",
    "considerate", 
    "cooperative",
"friendly",
"generous",
"handy",
"helpful",
"hospitable",
"kind",
  "omeagle",
    "omega",
    "tofu",
    "what the",
    "leo",
    "zayd",
    "kellen",
    "shaur",
    "hummus",
    "humza",
    "monkey",
    "i made name",
    
  ]);
  return `${adj} goose`
  
}
function isSolid(x,y){
  const blockNextSpace= mapData.blockedSpaces[getKeyString(x,y)];
  
  return (
    blockNextSpace ||
    x>=mapData.maxX ||
    x < mapData.minX ||
    y>= mapData.maxY ||
    y<mapData.minY 
  );
}


(function () {
  
  let playerId;
  let playerRef;
  let playerElements = {};
  let players = {};
  let food= {};
  let poop={}
  let foodElements={};
  let poopElements={};
  const gameContainer = document.querySelector(".game-container");
  let text=document.getElementById('whoasked');


  function placePoop(){
    
    console.log(randomSafeSpot());
    const 
    poopRef=firebase.database().ref(`poop/${x}x${y}`)
    poopRef.set({
      x,
      y,
    })

    const poopTimeouts=120000
    setTimeout(() => {
      placePoop()
    }, poopTimeouts)

  }
  function placeFood(){
    
    console.log(randomSafeSpot());
    const foodRef=firebase.database().ref(`food/${getKeyString(x,y)}`)
    foodRef.set({
      x,
      y,
    })

    const foodTimeouts=[200,300,400,500]
    setTimeout(() => {
      placeFood()
    }, randomFromArray(foodTimeouts));

  }
  function attemptGrabFood(x,y) {
    
    const key =getKeyString(x,y);

    if(foodElements[key]) {
      
      firebase.database().ref(`food/${key}`).remove();
      delete food[key];  
      playerRef.update({
        food: players[playerId].food + 1,
      });
    }

  }
  function attemptGrabPoop(x,y) {
    
    const key =getKeyString(x,y);

    if(poopElements[key]) {
      
      firebase.database().ref(`poop/${key}`).remove();
      delete poop[key];  
      playerRef.update({
        food: players[playerId].food=0,
      });
    }

  }
  function playerCollision(x,y) {
  
    
    
    const match = Object.keys(players).find(id => {
      const thisPlayer = players[id];
      
      return thisPlayer.x === x && thisPlayer.y === y;
  })
    const match2 = Object.keys(players).find(id => {
      const thisPlayer = players[id];
      return thisPlayer;
  })
    console.log(match2 + " <----- match2")
    console.log(match + " <--- match")
    console.log(playerId + " <----- Player Id") 
    if(match != playerId) {
     if (players[match].food < players[playerId].food) {
      console.log("COLLISION");
      firebase.database().ref(`players/${match}`).remove();
      delete players[match];
      
     }
     else if (players[match].food > players[playerId].food)  {
      console.log("COLLISION");
      firebase.database().ref(`players/${playerId}`).remove();
      delete players[playerId];
      
      window.location.href = "index2.html"; 
      text.textContent=`quacked by ${players[match].name}`;
      
     }
      
    }
  }
  function handleAwsdPress(xChange=0, yChange=0) {
    const newX=players[playerId].x + xChange;
    const newY=players[playerId].y + yChange;
    if (!isSolid(newX,newY)) {
      players[playerId].x = newX;
      players[playerId].y = newY;
     
      if (xChange ===1) {
        players[playerId].direction="right";
         players[playerId].walking=true;
         
      }
      if (xChange ===-1) {
        players[playerId].direction="left";
         players[playerId].walking=true;
      }
      playerRef.set(players[playerId]);
      
      attemptGrabFood(newX-xChange, newY-yChange);
      playerCollision(newX, newY)
      attemptGrabPoop(newX, newY);
      
      
    }
  }
  function InitGame() {
    
    new KeyPressListener("KeyW", () => handleAwsdPress(0, -1))
    new KeyPressListener("KeyS", () => handleAwsdPress(0, 1))
    new KeyPressListener("KeyD", () => handleAwsdPress(1, 0))
    new KeyPressListener("KeyA", () => handleAwsdPress(-1, 0))
    new KeyPressListener("ArrowUp", () => handleAwsdPress(0, -1))
    new KeyPressListener("ArrowDown", () => handleAwsdPress(0, 1))
    new KeyPressListener("ArrowRight", () => handleAwsdPress(1, 0))
    new KeyPressListener("ArrowLeft", () => handleAwsdPress(-1, 0))
    new KeyPressListener(!"ArrowLeft", () => players[playerId].walking=false)
    const allPlayersRef=firebase.database().ref('players');
    const allFoodRef=firebase.database().ref('food');
    const allPoopRef=firebase.database().ref('poop');
  
    allPlayersRef.on("value", (snapshot) =>{
      //change happens and stuff happens
      players = snapshot.val() || {};
      Object.keys(players).forEach((key) => {
       if (players[key].walking===true) {
        console.log("working")
        const characterState=players[key];
        let el=playerElements[key];
        el.querySelector(".Character_name").innerText = characterState.name;
        el.querySelector(".Character_food").innerText = characterState.food;
        el.setAttribute('data-direction', characterState.direction + "_walking");
        const left = 16*characterState.x + "px"; 
        const top = 16*characterState.y-4 + "px";
        el.style.transform=`translate3d(${left}, ${top}, 0)`;
       }
       else {
        const characterState=players[key];
        let el=playerElements[key];
        el.querySelector(".Character_name").innerText = characterState.name;
        el.querySelector(".Character_food").innerText = characterState.food;
        el.setAttribute('data-direction', characterState.direction);
        const left = 16*characterState.x + "px"; 
        const top = 16*characterState.y-4 + "px";
        el.style.transform=`translate3d(${left}, ${top}, 0)`;
       }
      })

    })
    allPlayersRef.on("child_added", (snapshot) => {
      //when player joins. yea yk what happens
      const addedPlayer=snapshot.val();
      const CharacterElement=document.createElement("div");
      CharacterElement.classList.add("Character", "grid-cell");
      if (addedPlayer.id === playerId)
      {
        CharacterElement.classList.add("you");
      }
      CharacterElement.innerHTML=(`
      <div class="Character_shadow grid-cell"></div>
      <div class="Character_sprite grid-cell"></div>
      <div class="Character_name-container">
        <span class="Character_name"></span>
      </div>
      <div class="Character_food-container">
        <span class="Character_food">0 food collected</span>
      </div>
      <div class="Character_you-arrow"></div>
      `);
    playerElements[addedPlayer.id]= CharacterElement;
    CharacterElement.querySelector(".Character_name").innerHTML = addedPlayer.name;
    CharacterElement.querySelector(".Character_food").innerHTML = addedPlayer.food + ' food collected';
    CharacterElement.setAttribute("data-direction", addedPlayer.direction);
    const left =16*addedPlayer.x+"px";
    const top =16*addedPlayer.y -4+"px";
    CharacterElement.style.transform=`translate3d(${left}, ${top}, 0)`;
    gameContainer.appendChild(CharacterElement);

      
  
    });
    allPlayersRef.on("child_removed", (snapshot) => {
      const removedKey = snapshot.val().id
      gameContainer.removeChild(playerElements[removedKey]);
      delete playerElements[removedKey];
    })
    allPoopRef.on('child_added', (snapshot) => {
      const poop = snapshot.val();
      const key = getKeyString(poop.x, poop.y)
      poop[key]=true;
  
      const poopElement=document.createElement("div")
      poopElement.classList.add("poop", "grid-cell");
      poopElement.innerHTML=`
      <div class="poop_shadow grid-cell"></div>
      <div class="poop_sprite grid-cell"></div>
      `;
  
      const left=16*poop.x+"px";
      const top=16*poop.y-4+"px";
      poopElement.style.transform=`translate3d(${left}, ${top}, 0)`;
  
      poopElements[key]=poopElement;
      gameContainer.appendChild(poopElement);
    })
    allPoopRef.on("child_removed", (snapshot) => {
      const {x,y}= snapshot.val();
      const keytoRemove=getKeyString(x,y)
      gameContainer.removeChild(poopElements[keytoRemove]);
      delete poopElements[keytoRemove];  
    })
    allFoodRef.on('child_added', (snapshot) => {
      const food = snapshot.val();
      const key = getKeyString(food.x, food.y)
      food[key]=true;
  
      const foodElement=document.createElement("div")
      foodElement.classList.add("food", "grid-cell");
      foodElement.innerHTML=`
      <div class="food_shadow grid-cell"></div>
      <div class="food_sprite grid-cell"></div>
      `;
  
      const left=16*food.x+"px";
      const top=16*food.y-4+"px";
      foodElement.style.transform=`translate3d(${left}, ${top}, 0)`;
  
      foodElements[key]=foodElement;
      gameContainer.appendChild(foodElement);
    })
    allFoodRef.on("child_removed", (snapshot) => {
      const {x,y}= snapshot.val();
      const keytoRemove=getKeyString(x,y)
      gameContainer.removeChild(foodElements[keytoRemove]);
      delete foodElements[keytoRemove];  
    })
    placeFood();
    placePoop();
  }
  
  firebase.auth().onAuthStateChanged((user) => {
    
    if (user) {
      playerId=user.uid;
      playerRef=firebase.database().ref(`players/${playerId}`);
      const name= createName();
      console.log(randomSafeSpot())
      playerRef.set({
        id:playerId,
        name,
        direction:"right",
        x,
        y,
        food:0,
        walking:false,
      
      })

      playerRef.onDisconnect().remove();

      InitGame();
    } else {


    }
  })
  firebase.auth().signInAnonymously().catch((error) => {
    var errorCode=error.code;
    var errorMessage=error.message;

    console.log(errorCode, errorMessage);
  });

})();
