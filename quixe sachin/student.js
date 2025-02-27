import { storage } from './storage.js';

const startQuizBtn = document.getElementById('start-quiz');
const quizEntry = document.getElementById('quiz-entry');
const quizContent = document.getElementById('quiz-content');
let currentQuiz = null;
let currentQuestion = 0;
let userAnswers = [];
let quizTimer;

//add user name and quiz code
startQuizBtn.addEventListener('click', () => {
    const userName = document.getElementById('user-name').value.trim();
    const code = document.getElementById('quiz-code').value.toUpperCase();
    const quizzes = storage.get('quizzes');

    if (!userName) {
        alert('Please enter your name before starting the quiz.');
        return;
    }

    currentQuiz = quizzes.find(q => q.code === code);

    if (currentQuiz) {
        // Store user's name in local storage
        storage.set('userName', userName);

        quizEntry.classList.add('hidden');
        quizContent.classList.remove('hidden');
        document.getElementById('quiz-title-display').textContent = currentQuiz.title;
        currentQuestion = 0;
        userAnswers = new Array(currentQuiz.questions.length).fill(null);
        displayQuestion();

         // Start Timer
         startTimer(currentQuiz.timer);

    } else {
        alert('Invalid quiz code!');
    }
});


function displayQuestion() {
    const question = currentQuiz.questions[currentQuestion];
    const questionDisplay = document.getElementById('question-display');
    
    questionDisplay.innerHTML = `
        <h3>Question ${currentQuestion + 1} of ${currentQuiz.questions.length}</h3>
        <p class="question-text">${question.text}</p>
        <div class="options">
            ${question.options.map((option, index) => `
                <label class="option">
                    <input type="radio" name="answer" value="${index}" 
                        ${userAnswers[currentQuestion] === index ? 'checked' : ''}>
                    ${option}
                </label>
            `).join('')}
        </div>
    `;

    // Update navigation buttons
    document.getElementById('prev-question').style.display = currentQuestion > 0 ? 'block' : 'none';
    document.getElementById('next-question').style.display = currentQuestion < currentQuiz.questions.length - 1 ? 'block' : 'none';
    document.getElementById('submit-quiz').style.display = currentQuestion === currentQuiz.questions.length - 1 ? 'block' : 'none';
}

document.getElementById('prev-question').addEventListener('click', () => {
    if (currentQuestion > 0) {
        currentQuestion--;
        displayQuestion();
    }
});

document.getElementById('next-question').addEventListener('click', () => {
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');
    if (selectedAnswer) {
        userAnswers[currentQuestion] = parseInt(selectedAnswer.value);
        if (currentQuestion < currentQuiz.questions.length - 1) {
            currentQuestion++;
            displayQuestion();
        }
    } else {
        alert('Please select an answer!');
    }
});

//timer ka code hai
function startTimer(duration) {
    let timeRemaining = duration * 60; // Convert minutes to seconds
    const timerDisplay = document.createElement('h3');
    timerDisplay.id = "quiz-timer-display";
    timerDisplay.style.color = "red";
    timerDisplay.style.textAlign = "center";
    quizContent.prepend(timerDisplay);

    quizTimer = setInterval(() => {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        timerDisplay.textContent = `Time Left: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        if (timeRemaining <= 0) {
            clearInterval(quizTimer);
            alert("Time's up! Your quiz is being submitted.");
            autoSubmitQuiz();
        }

        timeRemaining--;
    }, 1000);
}

// Function to auto-submit the quiz when time is up
function autoSubmitQuiz() {
    clearInterval(quizTimer);
    document.getElementById('submit-quiz').click();  // Simulate submit button click
}

//submit function with username and code
document.getElementById('submit-quiz').addEventListener('click', () => {
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');
    if (selectedAnswer) {
        userAnswers[currentQuestion] = parseInt(selectedAnswer.value);
        
        // Calculate score
        const score = userAnswers.reduce((total, answer, index) => {
            return total + (answer === currentQuiz.questions[index].correct ? 1 : 0);
        }, 0);

        const percentage = Math.round((score / currentQuiz.questions.length) * 100);

        // Get stored name
        const userName = storage.get('userName');

        // Save result with userName
        const results = storage.get('results') || [];
        results.push({
            quizId: currentQuiz.id,
            quizTitle: currentQuiz.title,
            score: percentage,
            name: userName,  // Store the participant's name
            date: new Date().toISOString()
        });
        storage.set('results', results);

        // Show result
        quizContent.innerHTML = `
            <h2>Quiz Complete!</h2>
            <div class="result">
                <p><strong>${userName}</strong>, your score: ${percentage}%</p>
                <p>Correct answers: ${score} out of ${currentQuiz.questions.length}</p>
            </div>
            <button onclick="location.reload()" class="btn primary">Take Another Quiz</button>
        `;
    }
});
