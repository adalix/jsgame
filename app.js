const canvas = document.getElementById("canvas");
const info = document.querySelector('.info');

let foods = [];
const robot = { x: 10, y: 10, size: 40 };


let time = 10;
const timerInfo = document.createElement('p');
  timerInfo.classList.add("time");

const timer = setInterval(() => {
  timerInfo.innerHTML = `Time:${time}`;
  console.log(time)

  info.prepend(timerInfo)
    if(time <= 0){
      clearInterval(timer)
      console.log("time is up")
    }
    time--;

}, 1000);


function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function appendRobotElement(parent) {
  const div = document.createElement("div");
  div.classList.add("box");
  div.innerHTML = `&#129302;`;
  div.style.fontSize = robot.size + "px";
  div.style.top = robot.y + "px";
  div.style.left = robot.x + "px";
  div.style.width = robot.size + "px";
  div.style.height = robot.size + "px";
  div.style.zIndex = 100;
  parent.appendChild(div);
}

function appendFoodElement(parent, food) {
  const div = document.createElement("div");
  div.classList.add("box");
  div.innerHTML = `&#127843;`;
  div.style.fontSize = food.size + "px";
  div.style.top = food.y + "px";
  div.style.left = food.x + "px";
  div.style.width = food.size + "px";
  div.style.height = food.size + "px";
  parent.appendChild(div);
}

function render() {
  removeAllChildNodes(canvas);
  appendRobotElement(canvas);
  foods.forEach((f) => appendFoodElement(canvas, f));
}

function createRandomFoods() {
  for(let i = 0; i<10 ; i++){
    foods.push({ x: Math.floor(Math.random() * (window.innerWidth - 40)), y: Math.floor(Math.random() * (window.innerHeight - 40)), size: 40});
  }
}

function initgame(){
  canvas.focus();
  createRandomFoods();
  timer;
  render();
}

canvas.addEventListener("keypress", (e) => {
  let amount = 0;
  let field = undefined;
  let step = 40;

  if (e.key === "w") {
    field = "y";
    amount = -step;
  } else if (e.key === "a") {
    field = "x";
    amount = -step;
  } else if (e.key === "d") {
    field = "x";
    amount = step;
  } else if (e.key === "s") {
    field = "y";
    amount = step;
  } else {
    field = undefined;
    amount = 0;
  }
console.log('field', field);
  if (field) {
    console.log(field, amount, robot);
    robot[field] += amount;
    console.log('robot field: ', robot[field], field);
    console.log(window.innerHeight, window.innerWidth);
    if (robot[field] < 0) {
      if (field === 'x') robot[field] = window.innerWidth - robot.size;
      if (field === 'y') robot[field] = window.innerHeight - robot.size;
    } else if ((field === 'y' && robot[field] > window.innerHeight) || (field === 'x' && robot[field] > window.innerWidth)) {
      if (field === 'x') robot[field] = 10;
      if (field === 'y') robot[field] = 10;
    }

    const filterFoods = foods.filter((food) => {
      let tleft =
        robot.y >= food.y &&
        robot.y <= food.y + food.size &&
        robot.x >= food.x &&
        robot.x <= food.x + food.size;
      let tright =
        robot.y >= food.y &&
        robot.y <= food.y + food.size &&
        robot.x + robot.size >= food.x &&
        robot.x + robot.size <= food.x + food.size;
      let bleft =
        robot.y + robot.size >= food.y &&
        robot.y + robot.size <= food.y + food.size &&
        robot.x >= food.x &&
        robot.x <= food.x + food.size;
      let bright =
        robot.y + robot.size >= food.y &&
        robot.y + robot.size <= food.y + food.size &&
        robot.x + robot.size >= food.x &&
        robot.x + robot.size <= food.x + food.size;

      return tleft || tright || bleft || bright;
    });

    console.log('foods', filterFoods)
    if (filterFoods.length > 0) {
      for (let f = 0; f < filterFoods.length; f++) {
        let ff = filterFoods[f];
        foods = foods.filter((el) => {
          return (el.x !== ff.x && el.y !== ff.y);
        });
      }
    }

    console.log('remaining food count: ', foods.length);
    if (foods.length === 0) {
      createRandomFoods();
    }

    render();
  }
});

initgame()
