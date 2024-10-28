// These are all the symbols that the game is going to use
const symbols = ['🍎', '🍌', '🍇', '🍓', '🍍', '🍉', '🍒', '🥝'];
// kepts track of when to end the game
let cardsLeft = symbols.length

//keeps score
let bestScore = Number.MAX_SAFE_INTEGER
let currScore = 0

// These will be used when the user starts choosing cards
let firstCard = null, secondCard = null;
// Stop users from choosing cards when they choose two wrong cards
let lockBoard = false;

/* 
    Initializes the games state. This is called on load and whenever the play again
    button is pressed.
*/
function initGame() {
    currScore = 0
    cardsLeft = symbols.length
    document.getElementById("game-board").innerHTML = ""
    document.getElementById("win-header").innerHTML = "IN PROGRESS"
    document.getElementById('win-header').className = "progress"
    //shuffleArray randomizes the order of the paseed in array
    shuffleArray(symbols)
    for (let i = 0; i < symbols.length; i++) {
        createCard(symbols[i])
    }

    shuffleArray(symbols)
    for (let i = 0; i < symbols.length; i++) {
        createCard(symbols[i])
    }

    document.getElementById('restart-btn').addEventListener('click', initGame);
}

/*
    The card will have the class 'card' and it would be a good idea to somehow save what its symbol is
    within the element itself, since we'll need it for later and there's no easy way to get it from the arrays.
    Also make sure to add the event listener with the 'flipCard' function
*/
function createCard(symbol) {
    let card = document.createElement("div")
    card.dataset.symbol = symbol
    card.className = "card"
    card.addEventListener("click", ()=> flipCard(card))
    document.getElementById("game-board").appendChild(card)
}

/*
   This function will handle flipping the cards, if the cards are both
   flipped over, then the function will check for match and do the 
   appropriate behavior according to the card values
*/
function flipCard(card) {
    /* 
        this makes sure you can't flip over more than 2 cards
        also makes sure you can't flip over already chosen cards (then the game
        would be too easy!)
    */
    if (lockBoard || card == firstCard) return;
    
    // if the card is flipped then it will unflip
    if (card.classList.contains("flipped")) {
        card.classList.remove('flipped')
        card.textContent = ""
    } else {
        card.classList.add("flipped")
        // if no cards are flipped, then simply flip the first card
        if (firstCard == null) {
            firstCard = card
            card.textContent = card.dataset.symbol
        } else {
            // when the second card is flipped, we must check for a match
            // if there is no match then both cards will be flipped back over
            secondCard = card
            card.textContent = card.dataset.symbol
            checkForMatch()
        }
    } 
}

//If the two current cards match, turn then green and disable them
function checkForMatch() {
    currScore += 1
    document.getElementById('curr-score').textContent = "Current Tries: " + currScore
    if (firstCard.dataset.symbol == secondCard.dataset.symbol) {
        disableCards()
    } else {
        unflipCards()
    }
}

/*  
    turns both cards green, then calls the resetBoard function
    This function will be called when two matched cards are found
*/
function disableCards() {
    firstCard.classList.add("matched")
    secondCard.classList.add("matched")
    cardsLeft -= 1
    resetBoard()
    if (cardsLeft == 0) {
        endGame()
    }
}
 
// unflips both cards, used when the cards chosen aren't a match
function unflipCards() {

    // We lock the board so that the user can't touch the board while it is unflipping
    lockBoard = true;

    // The cards will be flipped back after 1 second and the board will be reset
    // The 1 second is to give the user time to actaully see the card so they can memorize them before they unflip
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        firstCard.textContent = '';
        secondCard.textContent = '';
        resetBoard();
    }, 1000);
}

// resets the firstCard, secondCard, and lockBoard variables
function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

// Function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function endGame(){
    bestScore = Math.min(bestScore, currScore)
    document.getElementById('best-score').textContent = "Best Score: " + bestScore
    document.getElementById('win-header').textContent = "YOU WON!"
    document.getElementById('win-header').classList.add("won")
    document.getElementById('game-board').innerHTML = "Score: " + currScore
}

initGame();