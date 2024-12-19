//Scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
//renderer.setSize(window.innerWidth, window.innerHeight);
//^ pushes the screen to the right for some reason
renderer.setSize(50, 50);
document.body.appendChild(renderer.domElement);


function spawnCube() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({
    color: 000000
  });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  camera.position.z = 5;
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();
}
//Define our getCookie function
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function randomFromArray(array) {
  return array[Math.floor(Math.random() * array.length)]

}
function randomSafeSpotX() {
  let maxXlimit = 31;
  let randX = Math.random() * maxXlimit;
  randX = Math.floor(randX);
  let maxYlimit = 15;
  let randY = Math.random() * maxYlimit
  randY = Math.floor(randY);
  x = randX
  y = randY
  return x;
}
function randomSafeSpotY() {
  let maxXlimit = 31;
  let randX = Math.random() * maxXlimit;
  randX = Math.floor(randX);
  let maxYlimit = 15;
  let randY = Math.random() * maxYlimit
  randY = Math.floor(randY);
  x = randX
  y = randY
  return y
}
const mapData = {
  minX: 0,
  maxX: 31,
  minY: 0,
  maxY: 15,
  blockedSpaces: {
    "-10x-10": true

  }
}

function getKeyString(x, y) {
  return `${x}x${y}`;
}
function createName() {
  const adj = randomFromArray([
    "dasher",
    "merry",
    "prancer",
    "rudolph",
    "jingle",
    "ornament",
    "red nosed",
    "Grinch",
    "snow",
    "candy cane",
    "santa",
    "elf on the shelf",
    "elf",
    "all I want for Christmas",
    "poopy",
    "snowflake",
    "leo",
    "zayd",
    "kellen",
    "shaur",
    "humza",
    "monkey",
    "eric",
    "pluto",
    "pizza",
    "mr.knell",
    "larry du",
    "boyce",
    "lemon",
    "guzman",
    "Justin Li",
    "William Xie",
    "christmas",

  ]);
  return `${adj} goose`

}
function isSolid(x, y) {
  const blockNextSpace = mapData.blockedSpaces[getKeyString(x, y)];

  return (
    blockNextSpace ||
    x >= mapData.maxX ||
    x < mapData.minX ||
    y >= mapData.maxY ||
    y < mapData.minY
  );
}


(function() {

  let playerId;
  let playerRef;
  let playerElements = {};
  let players = {};
  let food = {};
  let Curryrotten = {}
  let foodElements = {};
  let CurryrottenElements = {};
  const gameContainer = document.querySelector(".game-container");



  function placeCurryrotten() {

    console.log(randomSafeSpot());
    const
      CurryrottenRef = firebase.database().ref(`Curryrotten/${x}x${y}`)
    CurryrottenRef.set({
      x,
      y,
    })

    const CurryrottenTimeouts = 12000000000
    setTimeout(() => {
      placeCurryrotten()
    }, CurryrottenTimeouts)

  }
  function placeFood() {

    let x = randomSafeSpotX();
    let y = randomSafeSpotY();
    const foodRef = firebase.database().ref(`food/${getKeyString(x, y)}`)
    foodRef.set({
      x,
      y,
    })

    const foodTimeouts = [20, 30, 40, 50]
    setTimeout(() => {
      placeFood()
    }, randomFromArray(foodTimeouts));

  }
  function attemptGrabFood(x, y) {

    const key = getKeyString(x, y);

    if (foodElements[key]) {

      firebase.database().ref(`food/${key}`).remove();
      delete food[key];
      //Anticheat（kicks player if food is higher than 1M [not reliable]）
      if (players[playerId].food > 10000000000000000000000000000000000000000000000000000000000) {
        firebase.database().ref(`players/${playerId}`).remove();
        delete players[playerId];
      } else if (players[playerId].food === 100000000000000000000000000000) {
        location.href = `bossbattle.html`
      } else {
        playerRef.update({
          food: players[playerId].food + 1,
        });
        players[playerId].walking=false
      }
    }

  }

  function attemptGrabCurryrotten(x, y) {

    const key = getKeyString(x, y);

    if (CurryrottenElements[key]) {

      firebase.database().ref(`Curryrotten/${key}`).remove();
      delete Curryrotten[key];
      playerRef.update({
        food: players[playerId].food = 0,
      });
    }
    //Curryrotten is not registering correctly on firebase 
  }
  function playerCollision(x, y) {
    let playeramountoffood = []
    let numplayers = Object.keys(players)
    let plrX = players[playerId].x;
    let plrY = players[playerId].y;


    for (var i = 0; i < numplayers.length; i++) {
      let id = numplayers[i];


      if (id == playerId) {

      } else {
        //opposer
        let oprX = players[id].x;
        let oprY = players[id].y;
        if (plrX === oprX && plrY === oprY) {
          if (players[playerId].food > players[id].food) {
            players[playerId].food += players[id].food;
            players[id].killedby = players[playerId].name;
            firebase.database().ref(`players/${id}`).remove();
            delete players[id];

          }
          if (players[id].food > players[playerId].food) {
            players[playerId].killedby = players[id].name;
            players[id].food += players[playerId].food;

            firebase.database().ref(`players/${playerId}`).remove();
            delete players[playerId];


          }
        }
      }
    }



  }
  function handleAwsdPress(xChange = 0, yChange = 0) {
    const newX = players[playerId].x + xChange;
    const newY = players[playerId].y + yChange;
    if (!isSolid(newX, newY)) {
      players[playerId].x = newX;
      players[playerId].y = newY;

      if (xChange === 1) {
        players[playerId].direction = "right";
        players[playerId].walking = true;

      }
      if (xChange === -1) {
        players[playerId].direction = "left";
        players[playerId].walking = true;
      }
      playerRef.set(players[playerId]);

      attemptGrabFood(newX - xChange, newY - yChange);
      playerCollision(newX, newY)

    }
  }
  function InitGame() {

    new KeyPressListener("KeyW", () => handleAwsdPress(0, -1))
    new KeyPressListener("KeyS", () => handleAwsdPress(0, 1))
    new KeyPressListener("KeyD", () => handleAwsdPress(1, 0))
    new KeyPressListener("KeyA", () => handleAwsdPress(-1, 0))
    
    const allPlayersRef = firebase.database().ref('players');
    const allFoodRef = firebase.database().ref('food');
    const allCurryrottenRef = firebase.database().ref('Curryrotten');

    allPlayersRef.on("value", (snapshot) => {
      //change happens and stuff happens

      players = snapshot.val() || {};

      Object.keys(players).forEach((key) => {

        if (players[key].walking === true) {

          const characterState = players[key];
          let el = playerElements[key];
          el.querySelector(".Character_name").innerText = characterState.name;
          el.querySelector(".Character_food").innerText = characterState.food;
          el.setAttribute('data-direction', players[playerId].direction + "_walking");

          const left = 16 * characterState.x + "px";
          const top = 16 * characterState.y - 4 + "px";
          el.style.transform = `translate3d(${left}, ${top}, 0)`;
          players[key].walking = false;
        } else {
          players[key].walking = false;
          const characterState = players[key];
          let el = playerElements[key];
          el.querySelector(".Character_name").innerText = characterState.name;
          el.querySelector(".Character_food").innerText = characterState.food;
          el.setAttribute('data-direction', characterState.direction);
          const left = 16 * characterState.x + "px";
          const top = 16 * characterState.y - 4 + "px";
          el.style.transform = `translate3d(${left}, ${top}, 0)`;
        }
        setTimeout(() => {
          const characterState = players[key];
          let el = playerElements[key];
          el.querySelector(".Character_name").innerText = characterState.name;
          el.querySelector(".Character_food").innerText = characterState.food;
          el.setAttribute('data-direction', characterState.direction);
          const left = 16 * characterState.x + "px";
          const top = 16 * characterState.y - 4 + "px";
          el.style.transform = `translate3d(${left}, ${top}, 0)`;
          players[key].walking = false;
        }, 750);
      })

    })
    allPlayersRef.on("child_added", (snapshot) => {
      //when player joins. yea yk what happens
      const addedPlayer = snapshot.val();
      const CharacterElement = document.createElement("div");
      CharacterElement.classList.add("Character", "grid-cell");
      if (addedPlayer.id === playerId) {
        CharacterElement.classList.add("you");
      }
      CharacterElement.innerHTML = (`
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
      playerElements[addedPlayer.id] = CharacterElement;
      CharacterElement.querySelector(".Character_name").innerHTML = addedPlayer.name;
      CharacterElement.querySelector(".Character_food").innerHTML = addedPlayer.food + ' food collected';
      CharacterElement.setAttribute("data-direction", addedPlayer.direction);
      const left = 16 * addedPlayer.x + "px";
      const top = 16 * addedPlayer.y - 4 + "px";
      CharacterElement.style.transform = `translate3d(${left}, ${top}, 0)`;
      gameContainer.appendChild(CharacterElement);


    });
    allPlayersRef.on("child_removed", (snapshot) => {
      document.getElementById('mySound').play();
      const removedKey = snapshot.val().id
      const elem = document.getElementById('deaths');
      const killer = players[removedKey].killedby
      elem.textContent = players[removedKey].name + " got quacked by " + killer;
      gameContainer.removeChild(playerElements[removedKey]);
      delete playerElements[removedKey];
      if (playerId === removedKey) {
        window.location.href = "index2.html";
      }
      setTimeout(() => {
        elem.textContent = " "
      }, 5000);
    })
    allCurryrottenRef.on('child_added', (snapshot) => {

      const Curryrotten = snapshot.val();
      const key = getKeyString(Curryrotten.x, Curryrotten.y)
      Curryrotten[key] = true;

      const CurryrottenElement = document.createElement("div")
      CurryrottenElement.classList.add("Curryrotten", "grid-cell");
      CurryrottenElement.innerHTML = `
      <div class="Curryrotten_shadow grid-cell"></div>
      <div class="Curryrotten grid-cell"></div>
      `;

      const left = 16 * Curryrotten.x + "px";
      const top = 16 * Curryrotten.y - 4 + "px";
      CurryrottenElement.style.transform = `translate3d(${left}, ${top}, 0)`;

      CurryrottenElements[key] = CurryrottenElement;
      gameContainer.appendChild(CurryrottenElement);
    })
    allCurryrottenRef.on("child_removed", (snapshot) => {
      const { x, y } = snapshot.val();
      const keytoRemove = getKeyString(x, y)
      gameContainer.removeChild(CurryrottenElements[keytoRemove]);
      delete CurryrottenElements[keytoRemove];
    })
    allFoodRef.on('child_added', (snapshot) => {
      const food = snapshot.val();
      const key = getKeyString(food.x, food.y)
      food[key] = true;

      const foodElement = document.createElement("div")
      foodElement.classList.add("food", "grid-cell");
      foodElement.innerHTML = `
      <div class="food_shadow grid-cell"></div>
      <div class="food_sprite grid-cell"></div>
      `;

      const left = 16 * food.x + "px";
      const top = 16 * food.y - 4 + "px";
      foodElement.style.transform = `translate3d(${left}, ${top}, 0)`;

      foodElements[key] = foodElement;
      gameContainer.appendChild(foodElement);
    })
    allFoodRef.on("child_removed", (snapshot) => {
      const { x, y } = snapshot.val();
      const keytoRemove = getKeyString(x, y)
      gameContainer.removeChild(foodElements[keytoRemove]);
      delete foodElements[keytoRemove];
    })
    placeFood();
    //give admin dashboard
    if (getCookie(`adminperm` == `true`)) {
      elem.innerHTML = `
 <style>div { background-color: black; border-radius: 6px; }</style><div><h1>Welcome to the admin dashboard</h1></div>`;
    }
  }

  firebase.auth().onAuthStateChanged((user) => {

    if (user) {
      playerId = user.uid;
      playerRef = firebase.database().ref(`players/${playerId}`);
      const name = createName();
      let x = randomSafeSpotX();
      let y = randomSafeSpotY();
      playerRef.set({
        id: playerId,
        name,
        direction: "right",
        x,
        y,
        food: 0,
        walking: false,
        killedby: null,

      })

      playerRef.onDisconnect().remove();

      InitGame();


    }
  })
  firebase.auth().signInAnonymously().catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;

    console.log(errorCode, errorMessage);
  });

})();
