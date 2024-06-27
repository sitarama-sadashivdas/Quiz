document.addEventListener('DOMContentLoaded', () => {
    const quizContainer = document.getElementById('quiz');
    const resultsContainer = document.getElementById('results');
    const submitButton = document.getElementById('submit');

    const fetchQuestions = async () => {
        try {
            const response = await fetch('questions.json'); // Simulated server
            const questions = await response.json();
            return questions;
        } catch (error) {
            console.error('Error fetching questions:', error);
            return [];
        }
    };

    const buildQuiz = (questions) => {
        const output = [];

        questions.forEach((question, questionNumber) => {
            const answers = [];
            for (const letter in question.answers) {
                answers.push(
                    `<label>
                        <input type="radio" name="question${questionNumber}" value="${letter}">
                        ${letter} : ${question.answers[letter]}
                    </label>`
                );
            }

            output.push(
                `<div class="question"> ${question.question} </div>
                <div class="answers"> ${answers.join('')} </div>`
            );
        });

        quizContainer.innerHTML = output.join('');
    };

    const showResults = (questions) => {
        const answerContainers = quizContainer.querySelectorAll('.answers');
        let numCorrect = 0;

        questions.forEach((question, questionNumber) => {
            const answerContainer = answerContainers[questionNumber];
            const selector = `input[name=question${questionNumber}]:checked`;
            const userAnswer = (answerContainer.querySelector(selector) || {}).value;

            if (userAnswer === question.correctAnswer) {
                numCorrect++;
                answerContainers[questionNumber].style.color = 'green';
            } else {
                answerContainers[questionNumber].style.color = 'red';
            }
        });

        resultsContainer.innerHTML = `${numCorrect} out of ${questions.length}`;
    };

    fetchQuestions().then(questions => {
        buildQuiz(questions);
        submitButton.addEventListener('click', () => showResults(questions));
    });
});
