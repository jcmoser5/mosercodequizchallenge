// set up html element targets

const bodyEl = document.querySelector("body");
const headerEl = document.querySelector("header");
const viewHighScoresEl = document.querySelector("#viewhighscores");
const timerSpanEl = document.querySelector("#timer");
const pageTitleEl = document.querySelector("#page-title");
const startBtn = document.querySelector("#startbtn");
const quizEl = document.querySelector("#quiz");
const questionEl = document.querySelector("#question");
const answersContainerEl = document.querySelector("#answerchoices");
const choiceBtn1 = document.querySelector("#choicebtn1");
const choiceBtn2 = document.querySelector("#choicebtn2");
const choiceBtn3 = document.querySelector("#choicebtn3");
const choiceBtn4 = document.querySelector("#choicebtn4");
const highScoreEntryEl = document.querySelector("#highscoreentry");
const initialEntryEl = document.querySelector("#initialentry");
const highScoreSubmitBtn = document.querySelector("#highscoresubmit");
const highScoresListEl = document.querySelector("#highscoreslist");
const quizEndEl = document.querySelector("#quizendform");
const goBackBtn = document.querySelector("#restartbtn");
const clearHighScoresBtn = document.querySelector("#clearscoresbtn")
const feedbackEl = document.querySelector("#feedback");

// set up quiz array
const quizArr = [
    {question: "What are the two types of data in JavaScript?", choice1: "Good and bad", choice2: "Functional and nonfunctional", choice3: "Primitives and objects", choice4: "Standard and variable", answer: "3"},
    {question: "What are examples of primitive data types?", choice1: "Grunts, whistles and calls", choice2: "Strings, numbers and Boolean", choice3: "Trains, planes and automobiles", choice4: "Logical, contextual and clustered", answer: "2"},
    {question: "Arrays that start their index at zero are called ______ arrays.", choice1: "zero-sum", choice2: "base-zero", choice3: "zero-initialized", choice4: "zero-indexed", answer: "4"},
    {question: 'The "for" loop is a special type of statement called a ______.', choice1: "control flow", choice2: "selector", choice3: "variable", choice4: "initial expression", answer: "1"},
    {question: "Variables that are declared outside of any functions are considered _______, meaning that any function can access them.", choice1: "universal", choice2: "primary", choice3: "global", choice4: "alpha", answer: "3"},
    {question: "Variables with ______ scope only exist within the scope of the function.", choice1: "domestic", choice2: "local", choice3: "home", choice4: "limited", answer: "2"},
    {question: "When a function belongs to an object, it's referred to as a ______.", choice1: "child", choice2: "descendant", choice3: "package", choice4: "method", answer: "4"},
    {question: "A ____ function calls itself.", choice1: "recursive", choice2: "repetitive", choice3: "redundant", choice4: "retrograde", answer: "1"},
    {question: "_____ values are values that evaluate to false in a conditional statement", choice1: "wrongy", choice2: "falsy", choice3: "incorrecty", choice4: "untruey", answer: "2"},
    {question: "What method changes characters in a string to lowercase?", choice1: "makeLowerCase", choice2: "setLowerCase", choice3: "toLowerCase", choice4: "returnLowerCase", answer: "3"},
    
];

// randomize quiz array
quizArr.sort(function() {
    return 0.5 - Math.random()
});


// set up other values
var timeRemaining = 60;
var score = 0;
var lastQuestionIndex = quizArr.length -1;
var currentQuestionIndex = 0;
var countdown = "";
var highScores = JSON.parse(localStorage.getItem("highScoreData")) || [];
var maxHighScores = 10;

// start counter and begin questions
function startQuiz() {
    viewHighScoresEl.classList.add("hidden");
    headerEl.setAttribute("style", "justify-content:center");
    pageTitleEl.classList.add("hidden");
    startBtn.classList.add("hidden");
    answersContainerEl.classList.remove("hidden");
    countdown = setInterval(timer, 1000);
    askQuestions();
}


// show timeRemaining to user/decrement timeRemaining once every second
function timer() {
    // when timer hits 0, game's over
    if (timeRemaining <= 0) {
        clearInterval(countdown);
        checkGameOver();
    }
    timerSpanEl.textContent = timeRemaining;
    timeRemaining--;
}

// asks questions from quizArr
function askQuestions() {
    // show questions in text and answer options as buttons
    questionEl.textContent = "#" + (currentQuestionIndex+1) + ": " + quizArr[currentQuestionIndex].question;
    choiceBtn1.textContent = "1. " + quizArr[currentQuestionIndex].choice1;
    choiceBtn2.textContent = "2. " + quizArr[currentQuestionIndex].choice2;
    choiceBtn3.textContent = "3. " + quizArr[currentQuestionIndex].choice3;
    choiceBtn4.textContent = "4. " + quizArr[currentQuestionIndex].choice4;
};


// checks user's answer
function checkResponse(response) {
    // if answer correct, let them know they got it right and increment score by 1
    if (response == quizArr[currentQuestionIndex].answer) {
        score += 1;
        feedbackEl.textContent = "Correct!";
        feedbackEl.classList.remove("hidden");
        setTimeout(clearFeedback, 1000 * .75);
        checkGameOver();
    }
    // if answer wrong, let them know they got it wrong and decrement timer by 10
    else {
        timeRemaining -= 10;
        if (timeRemaining <= 0) {
            timeRemaining = 0;
        }
        timerSpanEl.textContent = timeRemaining;
        feedbackEl.textContent = "Wrong!";
        feedbackEl.classList.remove("hidden");
        setTimeout(clearFeedback, 1000 * .75);
        checkGameOver();
    }
}

function clearFeedback() {
    feedbackEl.classList.add("hidden");
    bodyEl.setAttribute("style", "background-color:white");
}


function checkGameOver() {
    // when end of the question array is reached, game's over
    if (currentQuestionIndex === lastQuestionIndex || timeRemaining <= 0) {
        answersContainerEl.classList.add("hidden");
        clearInterval(countdown);
        endQuiz();
    } 
    // if there are any more questions left run them
    else {
        currentQuestionIndex++;
        askQuestions();
    }
}

// show final score and ask for initials
function endQuiz() {
    highScoreEntryEl.classList.remove("hidden");
    questionEl.textContent = "All done! Your final score is " + score + ".";
}

// store final score and initials in localStorage for top 10 results
function storeHighScore(event){
    event.preventDefault();

    var mostRecentScore = {initials: initialEntryEl.value.toUpperCase(), highScore: score};
    highScores.push(mostRecentScore);
    highScores.sort(function(a,b) {
        return b.highScore - a.highScore;
    })
    highScores.splice(maxHighScores);
    localStorage.setItem("highScoreData", JSON.stringify(highScores));

    highScoreEntryEl.classList.add("hidden");
    questionEl.classList.add("hidden");
    displayHighScores();
}

// show top 10 scores. Check if user wants to clear scores or go back to start.
function displayHighScores() {
    if (localStorage.getItem("highScoreData")) {
        headerEl.classList.add("hidden");
        questionEl.classList.add("hidden");
        startBtn.classList.add("hidden");
        pageTitleEl.textContent = "High Scores";
        pageTitleEl.setAttribute("style", "margin-top: 90px");
        pageTitleEl.classList.remove("hidden");
        goBackBtn.classList.remove("hidden");
        clearHighScoresBtn.classList.remove("hidden");
        var highScoreData = JSON.parse(localStorage.getItem("highScoreData"));
        highScoresListEl.classList.remove("hidden");
        highScoresListEl.innerHTML = highScoreData.map(function(score) {
            return '<li class="highscore">' + score.initials + " - " + score.highScore + "</li>"
        }).join("");
    }
    else {
        noHighScores();
    }
}

// show message if no high scores in local data
function noHighScores() {
    pageTitleEl.textContent = "No high scores to display";
    pageTitleEl.setAttribute("style", "margin-top: 90px");
    headerEl.classList.add("hidden");
    questionEl.classList.add("hidden");
    startBtn.classList.add("hidden");
    goBackBtn.classList.remove("hidden");
}

// clear high score data if any
function clearHighScores() {
    event.preventDefault();
    localStorage.removeItem("highScoreData")
    highScoresListEl.classList.add("hidden");
    clearHighScoresBtn.classList.add("hidden");
    noHighScores();
}

startBtn.onclick = startQuiz;

choiceBtn1.addEventListener("click", function() {checkResponse(1)});
choiceBtn2.addEventListener("click", function() {checkResponse(2)});
choiceBtn3.addEventListener("click", function() {checkResponse(3)});
choiceBtn4.addEventListener("click", function() {checkResponse(4)});

highScoreEntryEl.addEventListener("submit", storeHighScore);

viewHighScoresEl.addEventListener("click", displayHighScores);

clearHighScoresBtn.addEventListener("click", clearHighScores);