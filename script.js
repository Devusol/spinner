console.log("sectors: ", sectors);

function download(filename, text) {
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

document.getElementById("dwn-btn").addEventListener(
  "click",
  function () {
    var text = `const sectors = ${JSON.stringify(sectors)};` + jsString;
    var filename = "spinwheel.js";

    download(filename, text);
  },
  false
);

let jsString =
  'const rand=(e,n)=>Math.random()*(n-e)+e,tot=sectors.length,elSpin=document.querySelector("#spin"),ctx=document.querySelector("#wheel").getContext`2d`,dia=ctx.canvas.width,rad=dia/2,PI=Math.PI,TAU=2*PI,arc=TAU/sectors.length,friction=.991,angVelMin=.002;let angVelMax=0,angVel=0,ang=0,isSpinning=!1,isAccelerating=!1,won=!1;const getIndex=()=>Math.floor(tot-ang/TAU*tot)%tot,drawSector=(e,n)=>{let t=arc*n;ctx.save(),ctx.beginPath(),ctx.fillStyle=e.color,ctx.moveTo(rad,rad),ctx.arc(rad,rad,rad,t,t+arc),ctx.lineTo(rad,rad),ctx.fill(),ctx.translate(rad,rad),ctx.rotate(t+arc/2),ctx.textAlign="right",ctx.fillStyle="#fff",ctx.font="bold .9rem sans-serif",ctx.fillText(e.label,rad-10,10),ctx.restore()},rotate=()=>{let e=sectors[getIndex()];ctx.canvas.style.transform=`rotate(${ang-PI/2}rad)`,won=e.label,elSpin.style.background=e.color},frame=()=>{isSpinning&&(angVel>=angVelMax&&(isAccelerating=!1),isAccelerating?(angVel||=.002,angVel*=1.06):(isAccelerating=!1,(angVel*=.991)<.002&&(console.log("finished",won),window.parent.postMessage(won,"*"),isSpinning=!1,angVel=0)),ang+=angVel,ang%=TAU,rotate())},engine=()=>{frame(),requestAnimationFrame(engine)};elSpin.addEventListener("click",()=>{isSpinning||(isSpinning=!0,isAccelerating=!0,angVelMax=rand(.25,.4))}),sectors.forEach(drawSector),rotate(),engine();';
