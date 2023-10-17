const $ = selector => document.querySelector(selector);
const SCORE = $("#score");
const HIGH = $("#high");
const BOARD = $("#board");
const BTN = $("#btn");
const MSG=$("#msg");
const GAMECONTAINER=$(".msg_container");
const LEVEL=$("#level");

let level=1;
let scoreLevel=0;
let timeLevel=300;
let score=0;
let highScore= localStorage.getItem("high") || 0;
HIGH.textContent=highScore;
let limitX=20;
let limitY=20;
let foodY, foodX;
let snakeY = 1, snakeX = 1;
let moveY = 0, moveX = 0;
let snakeBody = [];
let setIntervalId;
let tecla;
let prevkey="ArrowDown";
const previous = {
    ArrowUp:{ArrowUp:true, ArrowDown:false,ArrowLeft:true,ArrowRight:true},
    ArrowDown:{ArrowUp:false,ArrowDown:true,ArrowLeft:true,ArrowRight:true},
    ArrowLeft:{ArrowUp:true,ArrowDown:true,ArrowLeft:true,ArrowRight:false},
    ArrowRight:{ArrowUp:true,ArrowDown:true,ArrowRight:true,ArrowLeft:false}
};
const move = {
    ArrowUp: [-1, 0],
    ArrowDown: [1, 0],
    ArrowLeft: [0, -1],
    ArrowRight: [0, 1]
}


function gameOver(){

   clearInterval(setIntervalId);
   MSG.innerHTML=`<button id="restart" class="btn__restart">Reiniciar</button>`

   document.querySelector("#restart").addEventListener("click", ()=> {
    GAMECONTAINER.classList.remove("msg_container--active");
    location.reload();
})
  GAMECONTAINER.classList.add("msg_container--active");
   
}

const clearFunction =()=>{

    clearInterval(setIntervalId);
    setIntervalId= setInterval(initGame, timeLevel)
    console.log(timeLevel);
}


const chanFoodPosition = () => {
    foodX = Math.floor((Math.random() * 20) + 1);
    foodY = Math.floor((Math.random() * 20) + 1);
}

function changeDirection(e) {
    
    if(e.target.id)tecla = e.target.id;    
    if(e.key)tecla = e.key;
  
    if (tecla == "btn") return;
    
    if (previous[tecla][prevkey]){
        moveX=move[tecla][1];
        moveY=move[tecla][0];
        
        prevkey=tecla;
    }
   
}

function checkFoodPosition(){
    for (let i=1; i<snakeBody.length; i++){
        if(foodY==snakeBody[i][0]  && foodX==snakeBody[i][1]){
            chanFoodPosition();
            console.log("CAMBIO POSICION");
        }
    }
}

const initGame = () => {

    console.log(timeLevel);
    checkFoodPosition();
   
    let htmlMarkup = `<div class="game__apple" style="grid-area: ${foodY} / ${foodX}">
    <img src="./assets/manzana.png" class="game__apple" alt="">
    </div>`;

    if (snakeX == foodX && snakeY == foodY) {
        snakeBody.push([foodY, foodX]);
        score++;
        SCORE.textContent = score;
        
        console.log(score, scoreLevel, level)

        if(score >= (scoreLevel + 5)){
            timeLevel-=25;
            scoreLevel=score;
            level++
            LEVEL.textContent= level;
            clearFunction();      
        }

        highScore = score >= highScore ?score : highScore;
        localStorage.setItem("high", highScore);
        
        HIGH.textContent=highScore;
        chanFoodPosition()
    }

    for (let i= snakeBody.length -1; i>0; i--){
        snakeBody[i]= snakeBody[i - 1];
    }

    snakeY += moveY;
    snakeX += moveX;

    snakeBody[0] = [snakeY, snakeX];

    for (let i = 0; i < snakeBody.length; i++) {
        htmlMarkup += `<div class="game__snake" style="grid-area: ${snakeBody[i][0]} / ${snakeBody[i][1]}"></div>`;
        if(i!=0 && snakeBody[0][1] == snakeBody[i][1] && snakeBody[0][0] == snakeBody[i][0]){
            gameOver();
        }
    }

    BOARD.innerHTML = htmlMarkup;

    if(snakeX > limitX || snakeX <= 0 || snakeY <= 0 || snakeY > limitY){
       gameOver();
    }

}

chanFoodPosition();
setIntervalId= setInterval(initGame, timeLevel);


BTN.addEventListener("click",  changeDirection);
document.addEventListener("keydown", changeDirection);

