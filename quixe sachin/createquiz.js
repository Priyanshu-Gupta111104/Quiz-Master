import { storage } from './storage.js';

const quizForm = document.getElementById('quiz-form');
const addQuestionBtn = document.getElementById('add-question');
const questionsContainer = document.getElementById('questions-container');

function createQuestionElement(index) {
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question-item';
    questionDiv.innerHTML = `
        <div class="form-group">
            <label>Question ${index + 1}</label>
            <input type="text" name="question${index}" required>
        </div>
        <div class="options-container">
            <div class="form-group">
                <input type="text" name="option${index}_1" placeholder="Option 1" required>
            </div>
            <div class="form-group">
                <input type="text" name="option${index}_2" placeholder="Option 2" required>
            </div>
            <div class="form-group">
                <input type="text" name="option${index}_3" placeholder="Option 3" required>
            </div>
            <div class="form-group">
                <input type="text" name="option${index}_4" placeholder="Option 4" required>
            </div>
        </div>
        <div class="form-group">
            <label>Correct Answer (1-4)</label>
            <input type="number" name="correct${index}" min="1" max="4" required>
        </div>
    `;
    return questionDiv;
}

addQuestionBtn.addEventListener('click', () => {
    const questionCount = questionsContainer.children.length;
    questionsContainer.appendChild(createQuestionElement(questionCount));
});

quizForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const quiz = {
        id: Date.now().toString(),
        title: document.getElementById('quiz-title').value,
        description: document.getElementById('quiz-description').value,
        questions: [],
        code: Math.random().toString(36).substr(2, 6).toUpperCase(),
        created: new Date().toISOString(),
        timer: parseInt(document.getElementById('quiz-timer').value) || 5  // Store quiz duration (default 5 min)
    };

    const questionElements = questionsContainer.children;
    for (let i = 0; i < questionElements.length; i++) {
        const question = {
            text: quizForm[`question${i}`].value,
            options: [
                quizForm[`option${i}_1`].value,
                quizForm[`option${i}_2`].value,
                quizForm[`option${i}_3`].value,
                quizForm[`option${i}_4`].value
            ],
            correct: parseInt(quizForm[`correct${i}`].value) - 1
        };
        quiz.questions.push(question);
    }

    // Save quiz
    const quizzes = storage.get('quizzes');
    quizzes.push(quiz);
    storage.set('quizzes', quizzes);

    // Show share modal
    const modal = document.getElementById('share-modal');
    const codeInput = document.getElementById('share-code-input');
    codeInput.value = quiz.code;
    modal.classList.add('active');

    // Reset form
    quizForm.reset();
    questionsContainer.innerHTML = '';
    questionsContainer.appendChild(createQuestionElement(0));
});

// Share Modal
document.getElementById('copy-code').addEventListener('click', () => {
    const codeInput = document.getElementById('share-code-input');
    codeInput.select();
    document.execCommand('copy');
});

document.getElementById('close-modal').addEventListener('click', () => {
    document.getElementById('share-modal').classList.remove('active');
});

// Initialize with first question
document.addEventListener('DOMContentLoaded', () => {
    questionsContainer.appendChild(createQuestionElement(0));
});