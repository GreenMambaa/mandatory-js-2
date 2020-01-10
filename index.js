// ------------ VARIABLER ---------------

var gameBoard;

var players=[];
var markers=["O", "X", "ai"];
var scores=[0, 0];
var wonGames=[0, 0];
var whoseTurn = 0;
players[0] = "Mighty Minion";
players[1] = "Baby Boss";
players[2] = "AI Extreme";

var gameOver = false;

var winValues = [7, 56, 73, 84, 146, 273, 292, 448];

const winCombo = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
];

const sqr = document.querySelectorAll('.sqr');

// ------------ PLAY MODES ---------------

function playGame() {
    document.querySelector(".playButton").style.display = "none";
    document.querySelector(".selectMode").style.display = "block";
    document.querySelector(".play2player").style.display = "block";
    //document.querySelector(".playAI1").style.display = "block";
    document.querySelector(".playAI2").style.display = "block";
}

// ------------ PLAY EASY GAME ---------------



// ------------ PLAY MULTI PLAYER GAME ---------------

function playGameP2P() {
    gameOver = false;
    scores=[0, 0];
    document.querySelector(".gameText").textContent = players[whoseTurn] + "'s Turn!";

    document.querySelector(".endGame").style.display = "none";
    document.querySelector(".buttonPage").style.display = "none";
    document.querySelector(".selectMode").style.display = "none";
    document.querySelector(".play2player").style.display = "none";
    document.querySelector(".playAI1").style.display = "none";
    document.querySelector(".playAI2").style.display = "none";

    document.querySelector("table").style.display = "table";

    for (var i = 0; i < sqr.length; i++) {
        if (i == 0) {
            sqr[i].id = 1;
        } else {
            sqr[i].id = sqr[i - 1].id * 2;
        }
    }

    for (var i = 0; i < sqr.length; i++) {
        sqr[i].innerText = '';
        sqr[i].style.removeProperty('background-color');
        sqr[i].addEventListener('click', playerMove, false);
    }
}
    
function playerMove(pressedSqr) {
    if (!gameOver) {
        scores[whoseTurn] += parseInt(pressedSqr.target.id);
        document.getElementById(pressedSqr.target.id).removeEventListener('click', playerMove, false);
        document.getElementById(pressedSqr.target.id).innerText = markers[whoseTurn];
        winCheck();
        if (!gameOver) {toggle();}
    }
}

function winCheck() {
    for (var i = 0; i < winValues.length; i++) {
        if ((scores[whoseTurn] & winValues[i]) == winValues[i]) {
            document.querySelector(".gameText").textContent = players[whoseTurn] + " Wins!";
            gameOver = true;
            document.querySelector(".buttonPage").style.display = "block";
            document.querySelector(".playButton").style.display = "block";
            wonGames[whoseTurn] += 1;
            if (whoseTurn == 0) {
                document.querySelector(".player1Wins").textContent = wonGames[whoseTurn] + " Wins";
            } else if (whoseTurn == 1){
                document.querySelector(".player2Wins").textContent = wonGames[whoseTurn] + " Wins";
            }
        }
    }
    if (((scores[0] + scores[1]) == 511) && !gameOver) {
        document.querySelector(".gameText").textContent = "Tie!";
        gameOver = true;
        document.querySelector(".buttonPage").style.display = "block";
        document.querySelector(".playButton").style.display = "block";
    }
}

function toggle() {
    if (whoseTurn == 0) whoseTurn = 1;
    else whoseTurn = 0;

    document.querySelector(".gameText").textContent = players[whoseTurn] + "'s Turn!";
}



// ------------ PLAY HARD GAME ---------------

function playGameHard() {
    document.querySelector(".endGame").style.display = "none";
    document.querySelector(".buttonPage").style.display = "none";
    document.querySelector(".selectMode").style.display = "none";
    document.querySelector(".play2player").style.display = "none";
    document.querySelector(".playAI1").style.display = "none";
    document.querySelector(".playAI2").style.display = "none";

    document.querySelector("table").style.display = "table";

    whoseTurn = 0;
    document.querySelector('.gameText').innerText = "GOOO !!!";

    for (var i = 0; i < sqr.length; i++) {
        sqr[i].id = i;
    }

    gameBoard = Array.from(Array(9).keys());

    for (var i = 0; i < sqr.length; i++) {
        sqr[i].innerText = '';
        sqr[i].style.removeProperty('background-color');
        sqr[i].addEventListener('click', nextMove, false);
    }
}
    
function nextMove(square) {
    if (typeof gameBoard[square.target.id] == 'number') {
        nextTurn(square.target.id, markers[0]);
        if (!checkTie(gameBoard, markers[0]) && !checkTie()) nextTurn(bestSpot(), markers[2]);
    }
}

function nextTurn(squareId, player) {
    gameBoard[squareId] = player;
    document.getElementById(squareId).textContent = player;
    let gameWon = checkWin(gameBoard, player);
    if (gameWon) IsGameOver(gameWon)
    if (whoseTurn == 0) whoseTurn = 1;
        else whoseTurn = 0;
}

function checkWin(board, player) {
    let games = board.reduce((a, e, i) =>
    (e === player) ? a.concat(i) : a, []);
    
    let gameWon = null;
            
    for (let [index, win] of winCombo.entries()) {
        if (win.every(elem => games.indexOf(elem) > -1)) {
            gameWon = {index: index, player: player};
            break;
        }
    }   
    return gameWon;
}
    
function IsGameOver(gameWon) {
    for (let index of winCombo[gameWon.index]) {
        document.getElementById(index).style.backgroundColor =
        gameWon.player == markers[0] ? "blue" : "red";
    }
    for (var i = 0; i < sqr.length; i++) {
        sqr[i].removeEventListener('click', nextTurn, false);
    }

    wonGames[whoseTurn] += 1;
    if (whoseTurn == 0) {
        document.querySelector(".player1Wins").textContent = wonGames[whoseTurn] + " Wins";
    } else if (whoseTurn == 1){
        document.querySelector(".player2Wins").textContent = wonGames[whoseTurn] + " Wins";
    }
            
    declareWinner(gameWon.player == markers[0] ? 'You win!' : 'You lose.');
    document.querySelector(".buttonPage").style.display = "block";
    document.querySelector(".playButton").style.display = "block";
}
    
    
function declareWinner(who) {
    document.querySelector(".buttonPage").style.display = "block";
    document.querySelector(".playButton").style.display = "block";
    document.querySelector('.gameText').innerText = who;
}
    
function emptySquares() {
    return gameBoard.filter(s => typeof s == 'number');
}
    
function bestSpot() {
    return minimax(gameBoard, markers[2]).index;
}
    
function checkTie() {
    if (emptySquares().length == 0) {
        for (var i = 0; i < sqr.length; i++) {
            sqr[i].style.backgroundColor = "green";
            sqr[i].removeEventListener('click', nextTurn, false);
        }
        declareWinner("Tie Game!");
        return true;
    }
    return false;
}
    
function minimax(newBoard, player) {
    var availSpots = emptySquares(newBoard);
    if (checkWin(newBoard, player)) {
        return {score: -10};
    } else if (checkWin(newBoard, markers[2])) {
        return {score: 10};
    } else if (availSpots.length === 0) {
        return {score: 0};
    }
    
    var moves = [];
    for (var i = 0; i < availSpots.length; i++) {
        var move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;
    
        if (player == markers[2]) {
            var result = minimax(newBoard, markers[0]);
            move.score = result.score;
        } else {
            var result = minimax(newBoard, markers[2]);
            move.score = result.score;
        }
    
        newBoard[availSpots[i]] = move.index;
    
        moves.push(move);
    }
    
    var bestMove;
    if (player === markers[2]) {
        var bestScore = -10000;
        for(var i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        var bestScore = 10000;
        for(var i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    return moves[bestMove];
}
