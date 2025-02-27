import { storage } from './storage.js';

function updateDashboard() {
    const quizzes = storage.get('quizzes');
    const results = storage.get('results');

    document.getElementById('total-quizzes').textContent = quizzes.length;
    document.getElementById('total-participants').textContent = results.length;

    if (results.length > 0) {
        const avgScore = Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length);
        document.getElementById('average-score').textContent = `${avgScore}%`;
    }

    const quizList = document.getElementById('quiz-list');
    quizList.innerHTML = quizzes.map(quiz => `
        <div class="quiz-card">
            <h3>${quiz.title}</h3>
            <p>${quiz.description}</p>
            <p class="quiz-code">Code: ${quiz.code}</p>
            <p class="quiz-stats">
                Questions: ${quiz.questions.length} | 
                Participants: ${results.filter(r => r.quizId === quiz.id).length}
            </p>
        </div>
    `).join('');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('quizzes')) storage.set('quizzes', []);
    if (!localStorage.getItem('results')) storage.set('results', []);
    updateDashboard();
});