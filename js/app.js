/*
 * Create a list that holds all of your cards
 */
var cards = ['fa-diamond', 'fa-diamond',
            'fa-bolt', 'fa-bolt',
            'fa-bomb', 'fa-bomb',
            'fa-leaf', 'fa-leaf',
            'fa-bicycle', 'fa-bicycle',
            'fa-paper-plane-o', 'fa-paper-plane-o',
            'fa-anchor', 'fa-anchor',
            'fa-cube', 'fa-cube',
            ];

var movesCounter = document.querySelector('.moves');

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

function initGame() {
    var deck = document.querySelector('.deck');
    var cardHTML = shuffle(cards).map(function(card) {
        return generateCard(card);
    });

    movesCounter.innerHTML = 0;
    deck.innerHTML= cardHTML.join('');
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function generateCard(card) {
    return `<li class='card' data-card="${card}"><i class="fa ${card}"></i></li>`;
}

initGame();

var allCards = document.querySelectorAll('.card');
var openCards = [];
var matchedCardList = [];
var moves = 0;
var clicks = 0;
var starsList = document.querySelectorAll(".stars li");

var time = document.getElementsByTagName('time')[0],
    start = document.getElementById('start'),
    stop = document.getElementById('stop'),
    clear = document.getElementById('clear'),
    seconds = 0, minutes = 0, hours = 0,
    t;

function add() {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
            hours++;
        }
    }
    
    time.textContent = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);

    timer();
}

function timer() {
    t = setTimeout(add, 1000);
}

restartGame.addEventListener('click', function(e) {
    resetToNewGame();
});

function resetToNewGame(){
    time.textContent = "00:00:00";
    seconds = 0; minutes = 0; hours = 0;
    
    clearTimeout(t);
    movesCounter.innerHTML = 0;
    newCardSort = shuffle(cards);
    
    allCards.forEach(function(card, index) {        
        card.childNodes[0].classList.remove(card.getAttribute('data-card'));
        card.childNodes[0].classList.add(newCardSort[index]);
        card.setAttribute('data-card', newCardSort[index]);
        card.classList.remove('open', 'show', 'match');
        index++;
    });

    starsList.forEach(function(star){
        star.style.visibility = '';
    });

    clicks = 0;

    openCards = [];
}

function showCard(card){
    card.classList.add('open', 'show');
}

function addToOpenList(card){
    openCards.push(card);
}

function lockCards(matchedCards){
    matchedCards.forEach(function(card){
        card.classList.add('match');  
        card.classList.add('open'); 
        card.classList.add('show'); 

        matchedCard(card);
    });
}

function matchedCard(card){
    matchedCardList.push(card);

    if(matchedCardList.length == 16){
        clearTimeout(t);

        if (confirm("YOU MATCHED ALL THE CARDS!\nMove Count: " + movesCounter.innerHTML + "\nYour Time: " + time.textContent + "\n"+
        "Your Star Rating: " + getStarRating() + "\nWould you like to play again?")) {
            resetToNewGame();
        }       
    }
}

function getStarRating(){
    var starRating = 0;

    starsList.forEach(function(star, index){
       if(star.style.visibility !== "collapse"){
            starRating = index + 1;
       }
    });

    return starRating;
}

function flipCards(unmatchedCards){
    setTimeout(function() {
        unmatchedCards.forEach(function(card) {
            card.classList.remove('open', 'show');
        });
    }, 1000);
}

function incrementMoveCounter(){
    clicks++;
    movesCounter.innerHTML = Math.floor(clicks/2);
}

allCards.forEach(function(card) {
    card.addEventListener('click', function(e) { 
        if (!card.classList.contains('open') && !card.classList.contains('show') && !card.classList.contains('match')) {
            showCard(card);            
            addToOpenList(card);

            if(clicks==0){
                timer();
            }
            
            incrementMoveCounter(); 

            if (openCards.length == 2) {          
                if (openCards[0].dataset.card == openCards[1].dataset.card)  {
                    lockCards(openCards);
                }
                else {  
                    flipCards(openCards);                     
                }        

                openCards = [];
           }            
            
            if (clicks == 24){
                starsList[0].style.visibility = "collapse";
            }
            else if (clicks == 32){
                starsList[1].style.visibility = "collapse";
            }
        }
    });
});


