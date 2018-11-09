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

function generateCard(card) {
    return `<li class='card' data-card="${card}"><i class="fa ${card}"></i></li>`;
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

initGame();

var allCards = document.querySelectorAll('.card');
var openCards = [];
var moves = 0;
var clicks = 0;

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

restartGame.onclick = function() {
    time.textContent = "00:00:00";
    seconds = 0; minutes = 0; hours = 0;
    
    clearTimeout(t);
    initGame();
}

allCards.forEach(function(card) {
    card.addEventListener('click', function(e) {    

        if (!card.classList.contains('open') && !card.classList.contains('show') && !card.classList.contains('match')) {
            openCards.push(card);
            card.classList.add('open', 'show');
            
            if(clicks==0){
                timer();
            }

            clicks++;
            movesCounter.innerHTML = Math.floor(clicks/2);
        
           if (openCards.length == 2) {      
               if (openCards[0].dataset.card == openCards[1].dataset.card)  {
                 openCards[0].classList.add('match');  
                 openCards[0].classList.add('open'); 
                 openCards[0].classList.add('show');  

                 openCards[1].classList.add('match');
                 openCards[1].classList.add('open');
                 openCards[1].classList.add('show');

                 openCards = [];
            
                } else {  
                    setTimeout(function() {
                        openCards.forEach(function(card) {
                            card.classList.remove('open', 'show');
                        });

                        openCards = [];
                    }, 1000);
                }
        
                cards = shuffle(cards);
                
                // remove all existing classes from each card
                for (var i = 0; i < cards.length; i++){
                    deck.innerHTML = "";
                    [].forEach.call(cards, function(item) {
                        deck.appendChild(item);
                    });
                    cards[i].classList.remove("show", "open", "match", "disabled");
                }
                
                // reset star rating
                //for (var i= 0; i < stars.length; i++) 
            }
            
            // setting rates based on moves
            if (moves > 8 && moves < 12){
                for( i= 0; i < 3; i++){
                    if(i > 1){
                        stars[i].style.visibility = "collapse";
                    }
                }
            }
            else if (moves > 13){
                for( i= 0; i < 3; i++){
                    if(i > 0){
                        stars[i].style.visibility = "collapse";
                    }
                }    
            }   
            
            //congrats popup
            let modal = document.getElementById("endgame")
            let starsList = document.querySelectorAll(".stars li");
            let closeicon = document.querySelector(".close");
            
            function congratulations(){
                if (openCard.length == 16){
                    clearInterval(interval);
                    finalTime = timer.innerHTML;
                
                    //show congrats popup
                    modal.classList.add("show");
                
                    //declare star rating variable
                    var starRating = document.querySelector(".stars").innerHTML;
                    
                    //showing move, rating, time on modal
                    document.getElementById("finalMove").innerHTML = moves;
                    document.getElementById("starRating").innerHTML = starRating;
                    document.getElementById("totalTime").innerHTML = finalTime;
                    
                    //closeicon on modal
                    closeModal();
                };

                function closeModal(){
                    closeicon.addEventListener("click", function(e){
                    modal.classList.remove("show");
                        startGame();
                    });
                }

                            
                //for player to play Again 
                function playAgain(){
                    modal.classList.remove("show");
                    startGame();
                }
            }
        
        }
    });
});


