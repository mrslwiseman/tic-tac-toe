const startBtn = document.querySelector('.startBtn')
,     boardCells = document.querySelectorAll('.cell')
,     userChoiceXBtn = document.querySelector('.userChoiceX')
,     userChoiceOBtn = document.querySelector('.userChoiceO')
,     userStartsBtn = document.querySelector('.userStarts')
,     aiStartsBtn = document.querySelector('.aiStarts');



function updateBoardUI(pos, player){
  boardCells.forEach((cell, i, a) => {
    a[i].classList.value = 'cell'
    a[i].classList.add(game.state.board[i]);
  })
}

function gameOver(winningCombo){
  console.log(winningCombo);
  winningCombo.forEach(cell => {
    let x = boardCells[cell];
    x.classList.add("win");
  });
}


// pick your symbol
[userChoiceXBtn, userChoiceOBtn].forEach(btn => {
  btn.addEventListener('click', function(){
   game.playerSymbol = this.value;
   //disable buttons
   [userChoiceXBtn, userChoiceOBtn].forEach(btn => {
     btn.disabled = true;
   })
  })
});


// choose who starts
// initiate game
[userStartsBtn, aiStartsBtn].forEach(btn => {
  btn.addEventListener('click', function(){
    // select starting player
   game.playerStarts = this.value == 'user' ? true : false;

   // change text in button after clicking
   [userStartsBtn, aiStartsBtn].forEach(btn => {
     btn.innerHTML = btn.value == 'user' ? "I'll Start Over" : "You Start Over"
   })

 // assign click handlers to board cells
   if(!game.state){
     boardCells.forEach(cell => {
       cell.addEventListener('click', function(e) {
         if(!this.classList.contains('x') && !this.classList.contains('o')){
           if(game.state.turn == game.player){
             game.makeMove(this.dataset.pos, game.player);
           }
         }
       });
     });
   }

   // init game state
   game.init(game.playerSymbol, game.playerStarts);
   // clear board
   resetBoardUI();

  })
});
