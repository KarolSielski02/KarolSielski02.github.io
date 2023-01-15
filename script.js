const startButton = document.getElementById('start-btn');
const nextButton = document.getElementById('next-btn');
const goToScoreBoardButton = document.getElementById('goToScoreBoard-btn');
const questionContainerElement = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const selectOptionsElement = document.getElementById('answer-select');
const mainQuestionSectionContainer = document.getElementById("mainQuestionSectionContainer");
const scoreBoardContainer = document.getElementById("scoreBoardContainer");
const restartButton = document.getElementById('startAgain-button');

let correctAnswers = 0;
let check = 0;
let timerWork;
let shuffledQuestions, currentQuestionIndex, usedIndexList;

import questionsList from './questions.json' assert {type: 'json'};


function findQuiz(id) {
    console.log(id)
    let tempArr = []
    questionsList.quizzes.forEach(element => {
        if (element.quizName.toString() === id) {
            console.log(element.questions)
            shuffledQuestions = element.questions;
        }
    })
    return [null];
}

window.startGame = function startGame(id) {
    // console.log(questionsList.quizzes[0].questions)
    startButton.classList.add('hide')
    document.getElementById("timer").classList.remove('hide')
    correctAnswers = 0;
    currentQuestionIndex = 0;
    check = 0;
    findQuiz(id) //change to show questions from valid quizz
    console.log(shuffledQuestions)
    usedIndexList = []
    questionContainerElement.classList.remove('hide')
    setNextQuestion()
}

function mixQuestions() {
    let indexNumber;

    while (true) {
        indexNumber = Math.floor(Math.random() * shuffledQuestions.length);
        if (!usedIndexList.includes(indexNumber)) {
            usedIndexList.push(indexNumber);
            // currentQuestionIndex++
            break;
        }
    }
    return indexNumber;
}

function setNextQuestion() {
    resetState()
    showQuestion(shuffledQuestions[mixQuestions()])
}

function showQuestion(question) {
    timer();
    questionElement.innerText = question.question
    switch (question.questionType) {
        case 'ABCD-TF':
            question.answers.forEach(answer => {
                const button = document.createElement('button')
                button.innerText = answer.text
                button.classList.add('btn')
                if (answer.correct) {
                    button.dataset.correct = answer.correct
                }
                button.addEventListener('click', selectAnswer)
                answerButtonsElement.appendChild(button)
            })
            break;
        case 'List':
            const select = document.createElement("select");
            question.answers.forEach(answer => {
                const option = document.createElement('option')
                option.innerText = answer.text
                // button.classList.add('btn')
                if (answer.correct) {
                    option.dataset.correct = answer.correct
                }
                option.addEventListener('click', selectAnswer)
                answerButtonsElement.appendChild(selectOptionsElement)
                selectOptionsElement.appendChild(selectOptionsElement)
            })
            break;
        default:
            break;


    }
    document.getElementById('score').innerHTML = "Score: " + correctAnswers;
}

function resetState() {
    nextButton.classList.add('hide')
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild
        (answerButtonsElement.firstChild)
    }
}

function selectAnswer(e) {
    const selectedButton = e.target
    const correct = selectedButton.dataset.correct
    if (check < 1) {
        setStatusClass(selectedButton, correct);
        check++
    }
    if (shuffledQuestions.length > currentQuestionIndex + 1) {
        nextButton.classList.remove('hide')
    } else {
        goToScoreBoardButton.classList.remove('hide')
    }
    clearInterval(timerWork);
}

function setStatusClass(element, correct) {
    clearStatusClass(element)
    if (correct) {
        element.classList.add('correct')
        correctAnswers += 10;
    } else {
        element.classList.add('wrong')
        correctAnswers -= 5;
    }
}

function clearStatusClass(element) {
    element.classList.remove('correct')
    element.classList.remove('wrong')
}

function timer() {
    clearInterval(timerWork);
    let timeCheck = 16;

    timerWork = setInterval(function () {
        timeCheck -= 1;
        document.getElementById("timer").innerHTML = "Time left: " + timeCheck + "s ";
        if (timeCheck <= 0) {
            clearInterval(timerWork);
            correctAnswers -= 5;
            currentQuestionIndex++;
            if (shuffledQuestions.length > currentQuestionIndex + 1) {
                nextButton.classList.remove('hide')
            } else {
                goToScoreBoardButton.classList.remove('hide')
                document.getElementById("timer").classList.add('hide')
                return 0;
            }
            setNextQuestion();
            return 0;
        }
    }, 1000);
}

// startButton.addEventListener('click', startGame("Math"));
nextButton.addEventListener('click', () => {
    currentQuestionIndex++
    check = 0;
    setNextQuestion()
})
goToScoreBoardButton.addEventListener('click', () => {
    scoreBoardContainer.classList.remove('hide');
    mainQuestionSectionContainer.classList.add('hide');
    document.getElementById('score-scoreBoard').innerHTML = correctAnswers;
})
restartButton.addEventListener('click', () => {
    scoreBoardContainer.classList.add('hide');
    goToScoreBoardButton.classList.add('hide')
    mainQuestionSectionContainer.classList.remove('hide');
    startGame();
});
