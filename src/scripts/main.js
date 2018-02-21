let State = function(oldState) {
  this.turn = oldState.turn;
  this.board = oldState.board;
  this.availableCells = game.availableCells(this.board);
};

// ------------------------------------------------------------------------
// can this be done with immutable variables? pure functions not updating vars

let game = {};
game.choice = '';
game.winningCombo = [];
game.difficultySetting = 'medium';

// ------------------------------------------------------------------------

game.availableCells = function(b) {
  return b.filter(cell => cell != "x" && cell != "o");
};

// ------------------------------------------------------------------------

game.init = function(playerChar, playerFirstTurn) {
  game.player = playerChar;
  game.ai = playerChar == "x" ? "o" : "x";
  game.state = new State({
    board: [  0,  1,  2,  3,  4,  5,  6,  7,  8 ],
    turn: playerFirstTurn  ? game.player  : game.ai,
  });
  updateBoardUI();
  game.advanceGame();
  console.log(`*************** NEW GAME ***************`);
};

// ------------------------------------------------------------------------

game.changeTurn = function(currentTurn) {
  return currentTurn == 'x'? 'o' : 'x';
}
// ------------------------------------------------------------------------

game.makeNewState = function(state, pos){
  let newBoard = [...state.board];
  newBoard[pos] = state.turn;
  return new State({board: newBoard, turn: game.changeTurn(state.turn)});
}


// ------------------------------------------------------------------------
game.makeMove = function(pos, player) {
  //update UI

  //update state
  game.state = game.makeNewState(game.state, pos)
  game.advanceGame();
  updateBoardUI(pos, player);
};

// ------------------------------------------------------------------------
  // if game is over start a new one
  // if its ai's turn call makeAIMove()

game.advanceGame = function() {
  if(game.isTerminal(game.state)){
    setTimeout(() => {game.init(game.player, game.playerStarts) }, 1000);
  } else if(game.state.turn == game.ai){
    setTimeout(() => { game.makeAImove() }, 1500);
  }
};

// ------------------------------------------------------------------------
// perform minimax calculations
// make move with AIs game.choice

game.makeAImove = function() {
  // make easy move
  // make intermediate move
  // make impossible move(minimax)

  game.aiStrategy[game.difficultySetting](game.state)

  //game.minimax(game.state)
  game.makeMove(game.choice, game.ai)
};

// ------------------------------------------------------------------------
game.checkWin = function(state, player) {

// checks board for winning combination

  let win = false;
  let combos = [
    [  0, 4, 8 ],
    [  2, 4, 6 ],
    [  0, 1, 2 ],
    [  3, 4, 5 ],
    [  6, 7, 8 ],
    [  0, 3, 6 ],
    [  1, 4, 7 ],
    [2, 5, 8] ];
  for (let i = 0; i < combos.length; i++) {
    let check = [
      state.board[combos[i][0]],
      state.board[combos[i][1]],
      state.board[combos[i][2]]
    ].every((x, index, a) => {
      return player == undefined  ? x == a[0]  : x == player
    });
    if (check) {
      game.winningCombo = combos[i];
      win = true;
      break;
    }
  }
  return win
};

// ------------------------------------------------------------------------

// checks if game is over
game.isTerminal = function(state) {
  return game.checkWin(state)  ? true  : state.availableCells.length == 0  ? true : false;
};


// ------------------------------------------------------------------------
// return a  score for every possible game state
game.minimax = function(state) {
  let scores = []
  let moves = []
  if (game.isTerminal(state)) {
    return game.score(state)
  } else {

    state.availableCells.forEach(move => {
      scores.push(game.minimax(game.makeNewState(state, move)))
      moves.push(move)
    })

    let max_score,
      max_score_index,
      min_score,
      min_score_index;
    if (state.turn === game.ai) {
      max_score = Math.max.apply(Math, scores);
      max_score_index = scores.indexOf(max_score);
      game.choice = moves[max_score_index];

      return scores[max_score_index];

    } else {
      min_score = Math.min.apply(Math, scores);
      min_score_index = scores.indexOf(min_score);
      game.choice = moves[min_score_index];

      return scores[min_score_index];
    }
  }

}
// ------------------------------------------------------------------------
game.score = function(state) {
  if (game.checkWin(state, game.ai)) {
    return 10;
  } else if (game.checkWin(state, game.player)) {
    return -10;
  } else {
    return 0;
  }
}

game.aiStrategy = {
  easy: function(){
    let ran = Math.round(Math.random() * (game.state.availableCells.length-1));
    let pos = game.state.availableCells[ran];
    game.choice = pos;
  },
  medium: function(state){
    console.log('medium')
    let ran = Math.round(Math.random() * 1)
    console.log(ran)
    ran == 0 ? this.easy() : this.hard(state)
  },
  hard: game.minimax
}