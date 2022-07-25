const guessedLettersElement = document.querySelector(".guessed-letters"); //access the <ul> where input letters will appear
const guessButton = document.querySelector(".guess"); //access the <button> with a class of "guess"
const letterInput = document.querySelector(".letter"); //access the letter input by the user
const wordInProgress = document.querySelector(".word-in-progress"); //access the <p> where letters will appear
const remainingGuessesElement = document.querySelector(".remaining"); //access the <p> where remaining guesses will display
const remainingGuessesSpan = document.querySelector(".remaining span"); //acess the span element inside <p> with class "remaining"
const message = document.querySelector(".message"); //access the empty <p> where program let's user know if they guessed a letter
const playAgainButton = document.querySelector(".play-again"); //acess the play again button that appears at the end

let word = "magnolia"; //guess word until we fetch from an api
let guessedLetters = []; //empty array where we store the user's guesses
let remainingGuesses = 8; //maximum number of guesses the player can make, the variable can increase or decrease over time

//async function to get 800 random words
const getWord = async function() {
    const wordRequest = await fetch("https://gist.githubusercontent.com/skillcrush-curriculum/7061f1d4d3d5bfe47efbfbcfe42bf57e/raw/5ffc447694486e7dea686f34a6c085ae371b43fe/words.txt");
    const data = await wordRequest.text();
    const dataArray = data.split("\n");
    console.log(dataArray);
    const randomIndex = Math.floor(Math.random() * dataArray.length); //gets a random index number from 0 to 799
    word = dataArray[randomIndex].trim(); //gets the random word from the array and eliminates empty spaces

    displayCircles(word);
};

//Calls function to innitiate the game
getWord();

//function that displays circle symbols as placeholders for letters in the guess word
const displayCircles = function (word) {
  const circleArray = [];
  for (const letter of word) { //for each letter in the word, push the circle string into the array 
    console.log(letter);
    circleArray.push("●"); 
  }
  wordInProgress.innerText = circleArray.join(""); //joins circle strings 
};

guessButton.addEventListener("click", function(e) {
    e.preventDefault();
    
    message.innerText = ""; //we empty the element which contains the message

    const userGuess = letterInput.value;
    const checkIfGoodGuess = checkInput(userGuess);

    if (checkIfGoodGuess) { //if condition is true, we call the function makeGuess
        makeGuess(userGuess);
    };
    letterInput.value =""; //then we clear the input value
});

//Function to Check Player's Input
const checkInput = function(input) {
    const acceptedLetter = /[a-zA-Z]/; //regular expression that accepts only letters
    if(input.length === 0 || input.length > 1 || !input.match(acceptedLetter)) { //conditional statements that make sure the user's input is a letter
        message.innerText = "Please enter a single letter."
    } else  {
        return input;
    }  
};

//Function to Capture Input
const makeGuess = function(guess) {
    guess = guess.toUpperCase(); 
    if (guessedLetters.includes(guess)) {
        message.innerText = "You already guessed this letter. Try again."
    } else {
        guessedLetters.push(guess);
        console.log(guessedLetters);
        countGuessesRemaining(guess);
        showGuessedLetters();
        updateWordInProgress(guessedLetters);
    }
};

//Function to Show the Guessed Letters
const showGuessedLetters = function() {
    guessedLettersElement.innerHTML = "";
    
    for(const letter of guessedLetters ) {
        const li = document.createElement("li");
        li.innerText = letter; 
        guessedLettersElement.append(li);
    }
};

//Function to Update the Word in Progress
//This function will replace the circle symbols with the correct letters guessed.
const updateWordInProgress = function(guessedLetters) {
    const wordUpper = word.toUpperCase();
    const wordArray = wordUpper.split("");
    const newArray = [];
    for (const letter of wordArray) {
        if(guessedLetters.includes(letter)) {
            newArray.push(letter.toUpperCase());
        } else {
            newArray.push("●");
        }
    }
    //console.log(newArray);
    wordInProgress.innerText = newArray.join("");
    checkIfPlayerWon();
};

//Function to Count Guesses Remaining
const countGuessesRemaining = function(guess) {
    const upperWord = word.toUpperCase(); //here we upper case the user's guessed letter, so it matches our upper cased letters in the array
    if (!upperWord.includes(guess)) {
        message.innerText = `The word has no ${guess}, try another. 🥺`;
        remainingGuesses -= 1;
    } else {
        message.innerText =`The word has the letter ${guess}. Yay! 🎉`;
    };

    if (remainingGuesses === 0) {
        message.innerHTML = `The game is over. The word is <span class="higlight">${word}</span>.`;
        startOver();
    } else if (remainingGuesses === 1) {
        remainingGuessesSpan.innerText = `${remainingGuesses} guess`;
    } else {
        remainingGuessesSpan.innerText = `${remainingGuesses} guesses`;
    }
};

//Function to Check If the Player Won
const checkIfPlayerWon = function() {
    if (word.toUpperCase() === wordInProgress.innerText) {
        message.classList.add("win");
        message.innerHTML = `<p class="highlight">You guessed correct the word! Congrats!</p>`;

        startOver();
    }
};

//Function to Hide and Show Elements
const startOver = function() {
    guessButton.classList.add("hide");
    remainingGuessesElement.classList.add("hide");
    guessedLettersElement.classList.add("hide");
    playAgainButton.classList.remove("hide");
};

//Event listener for the Play Again Button
playAgainButton.addEventListener("click", function() {
    //Here we reset values
    message.classList.remove("win");
    guessedLetters = [];
    remainingGuesses = 8;
    remainingGuessesSpan.innerText = `${remainingGuesses} guesses`;
    guessedLettersElement.innerHTML = "";
    message.innerText = "";
    
    //Show UI Elements
    guessButton.classList.remove("hide");
    remainingGuessesElement.classList.remove("hide");
    guessedLettersElement.classList.remove("hide");
    playAgainButton.classList.add("hide");

    //Grab a new word
    getWord();
})
