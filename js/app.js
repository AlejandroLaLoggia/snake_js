const $ = selector => document.querySelector(selector);
const SCORE = $("#score");
const HIGH = $("#high");
const BOARD = $("#board");
const BTN = $("#btn");
const MSG=$("#msg");
const GAMECONTAINER=$(".msg_container");
let score=0;
let highScore= localStorage.getItem("high") || 0;
HIGH.textContent=highScore;
let limitX=20;
let limitY=20;
let foodY, foodX;
let snakeY = 5, snakeX = 10;
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

const initGame = () => {

    let htmlMarkup = `<div class="game__apple" style="grid-area: ${foodY} / ${foodX}">
    <img src="./assets/manzana.png" class="game__apple" alt="">
    </div>`;

    if (snakeX == foodX && snakeY == foodY) {
        snakeBody.push([foodY, foodX]);
        score++;
        SCORE.textContent = score;
        
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
setIntervalId= setInterval(initGame, 200);

BTN.addEventListener("click",  changeDirection);
document.addEventListener("keydown", changeDirection);

