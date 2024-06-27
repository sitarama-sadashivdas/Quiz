document.addEventListener('DOMContentLoaded', () => {
    const quizContainer = document.getElementById('quiz');
    const resultsContainer = document.getElementById('results');
    const submitButton = document.getElementById('submit');

    const fetchQuestions = async () => {
        try {
            const response = await fetch('https://opentdb.com/api.php?amount=5&type=multiple'); // Fetch 5 questions
            const data = await response.json();
            return data.results.map((questionData) => {
                const formattedQuestion = {
                    question: decodeHTML(questionData.question),
                    answers: {
                        a: decodeHTML(questionData.correct_answer),
                        b: decodeHTML(questionData.incorrect_answers[0]),
                        c: decodeHTML(questionData.incorrect_answers[1]),
                        d: decodeHTML(questionData.incorrect_answers[2]),
                    },
                    correctAnswer: 'a', // The correct answer will always be 'a' since we set it first
                };

                // Shuffle answers
                const answersArray = Object.entries(formattedQuestion.answers);
                for (let i = answersArray.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [answersArray[i], answersArray[j]] = [answersArray[j], answersArray[i]];
                }

                formattedQuestion.answers = Object.fromEntries(answersArray);

                // Adjust correctAnswer based on shuffled answers
                formattedQuestion.correctAnswer = answersArray.find(([key, value]) => value === questionData.correct_answer)[0];

                return formattedQuestion;
            });
        } catch (error) {
            console.error('Error fetching questions:', error);
            return [];
        }
    };

    const decodeHTML = (html) => {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
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

