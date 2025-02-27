import { storage } from './storage.js';

function updateLeaderboard() {
    const results = storage.get('results');
    const quizzes = storage.get('quizzes');
    
    // Update quiz select
    const quizSelect = document.getElementById('quiz-select');
    quizSelect.innerHTML = `
        <option value="all">All Quizzes</option>
        ${quizzes.map(quiz => `
            <option value="${quiz.id}">${quiz.title}</option>
        `).join('')}
    `;

    // Sort and display results
    function displayResults() {
        const selectedQuizId = quizSelect.value;
        const filteredResults = selectedQuizId === 'all' 
            ? results  // Show all quiz results
            : results.filter(r => r.quizId === selectedQuizId);  // Show only selected quiz results

        const sortedResults = filteredResults.sort((a, b) => b.score - a.score);

        document.getElementById('leaderboard-body').innerHTML = sortedResults.map((result, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${result.name || 'Anonymous'}</td>  <!-- Display participant name -->
                <td>${result.quizTitle}</td>
                <td>${result.score}%</td>
                <td>${new Date(result.date).toLocaleString()}</td>
            </tr>
        `).join('');
    }

    // Add event listener to quiz select to update the table when selection changes
    quizSelect.addEventListener('change', displayResults);
    
    // Initial display of results
    displayResults();
}

// Initialize
document.addEventListener('DOMContentLoaded', updateLeaderboard);