let sectors = [
  { color: "red", label: "AGAIN" },
  { color: "black", label: "WIN" }
];

const labelChange=(e)=>{console.log("changed ",e)}
 const addBtn= ()=>{
  console.log('add button')

  const newSector=document.createElement("div")
  const newColor=document.createElement("input")
  newColor.placeholder="color"  const newLabel=document.createElement("input")
  newLabel.placeholder="label"
  newLabel.oninput='labelChange()'
  newSector.appendChild(newLabel)
   newSector.appendChild(newColor)
   userSetupForm.appendChild(newSector)
  sectors.push({color: "white",label:"add"})
  
  console.log(sectors)
  init()
  } 
  const remBtn= ()=>{
  console.log('rem button')
  const newSector=document.createElement("input")
   userSetupForm.removeChild(userSetupForm.lastElementChild)
   sectors.pop()
  
  console.log(sectors)
  init()
  }
  
  
  
const userSetupForm = document.querySelector("#setupForm");
const setupAsObject = document.querySelector("#setupAsObject");
userSetupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formInputs = new FormData(userSetupForm);

  formInputs.getAll("value");

  for (const [key, value] of formInputs) {
    console.log(`${key}: ${value}\n`);
  }
  // inputsArray.forEach((score) => console.log(score));
});

const submitObject = () => {
  console.log("old sectors: ", setupAsObject.value);
  try {
    sectors = [JSON.parse(setupAsObject.value)];
  } catch (error) {
    console.log(error);
  }

  console.log("new sectors: ", [sectors]);
  init();
};

const init = () => {
  // Generate random float in range min-max:
  const rand = (m, M) => Math.random() * (M - m) + m;

  const tot = sectors.length;
  const elSpin = document.querySelector("#spin");
  const ctx = document.querySelector("#wheel").getContext`2d`;
  const dia = ctx.canvas.width;
  const rad = dia / 2;
  const PI = Math.PI;
  const TAU = 2 * PI;
  const arc = TAU / sectors.length;
  const friction = 0.991; // 0.995=soft, 0.99=mid, 0.98=hard
  const angVelMin = 0.002; // Below that number will be treated as a stop
  let angVelMax = 0; // Random ang.vel. to acceletare to
  let angVel = 0; // Current angular velocity
  let ang = 0; // Angle rotation in radians
  let isSpinning = false;
  let isAccelerating = false;
  let won = false;

  //* Get index of current sector */
  const getIndex = () => Math.floor(tot - (ang / TAU) * tot) % tot;

  //* Draw sectors and prizes texts to canvas */
  const drawSector = (sector, i) => {
    const ang = arc * i;
    ctx.save();
    // COLOR
    ctx.beginPath();
    ctx.fillStyle = sector.color;
    ctx.moveTo(rad, rad);
    ctx.arc(rad, rad, rad, ang, ang + arc);
    ctx.lineTo(rad, rad);
    ctx.fill();
    // TEXT
    ctx.translate(rad, rad);
    ctx.rotate(ang + arc / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#fff";
    ctx.font = "bold .9rem sans-serif";
    ctx.fillText(sector.label, rad - 10, 10);
    //
    ctx.restore();
  };

  //* CSS rotate CANVAS Element */
  const rotate = () => {
    const sector = sectors[getIndex()];
    ctx.canvas.style.transform = `rotate(${ang - PI / 2}rad)`;
    // elSpin.textContent = !angVel ? "SPIN" : sector.label;
    won = sector.label;
    elSpin.style.background = sector.color;
  };

  const frame = () => {
    if (!isSpinning) return;

    if (angVel >= angVelMax) isAccelerating = false;

    // Accelerate
    if (isAccelerating) {
      angVel ||= angVelMin; // Initial velocity kick
      angVel *= 1.06; // Accelerate
    }

    // Decelerate
    else {
      isAccelerating = false;
      angVel *= friction; // Decelerate by friction

      // SPIN END:
      if (angVel < angVelMin) {
        console.log("finished", won);
        // won === "WIN" ? alert("you won") : alert("try again");
        window.parent.postMessage(won, "*");
        isSpinning = false;
        angVel = 0;
      }
    }

    ang += angVel; // Update angle
    ang %= TAU; // Normalize angle
    rotate(); // CSS rotate!
  };

  const engine = () => {
    frame();
    requestAnimationFrame(engine);
  };

  elSpin.addEventListener("click", () => {
    if (isSpinning) return;
    isSpinning = true;
    isAccelerating = true;
    angVelMax = rand(0.25, 0.4);
  });

  // INIT!

  sectors.forEach(drawSector);
  rotate(); // Initial rotation
  engine(); // Start engine!
};
init();
