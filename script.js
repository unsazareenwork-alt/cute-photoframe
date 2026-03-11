const video = document.getElementById("video")
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
const countdown = document.getElementById("countdown")

let photos = []

async function startCamera(){

const stream = await navigator.mediaDevices.getUserMedia({video:true})

video.srcObject = stream

}

async function takeStrip(){

photos = []

for(let i=0;i<4;i++){

await runCountdown()

takePhoto()

await new Promise(r=>setTimeout(r,500))

}

createStrip()

}

function runCountdown(){

return new Promise(resolve=>{

let num = 3

countdown.innerText = num

let interval = setInterval(()=>{

num--

if(num==0){

clearInterval(interval)

countdown.innerText="📸"

setTimeout(()=>{

countdown.innerText=""

resolve()

},500)

}

else{

countdown.innerText=num

}

},1000)

})

}

function takePhoto(){

const tempCanvas = document.createElement("canvas")

tempCanvas.width = video.videoWidth
tempCanvas.height = video.videoHeight

const tempCtx = tempCanvas.getContext("2d")

tempCtx.drawImage(video,0,0)

photos.push(tempCanvas)

}

function createStrip(){

canvas.width = photos[0].width
canvas.height = photos[0].height*4

for(let i=0;i<4;i++){

ctx.drawImage(photos[i],0,i*photos[i].height)

}

}

function download(){

const link = document.createElement("a")

link.download="photostrip.png"

link.href = canvas.toDataURL()

link.click()

}