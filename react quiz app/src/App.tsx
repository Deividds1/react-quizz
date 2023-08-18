import { useState, useEffect } from 'react';
import './App.css';
import { fetchQuestions, Question, QuestionData } from './api';

function shuffleArray<T>(array: T[]): T[] {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

export default function App() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [showScore, setShowScore] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    async function loadQuestions() {
      try {
        const response = await fetchQuestions();

        const transformedQuestions: Question[] = response.results.map((questionData: QuestionData) => {
          const answerOptions = shuffleArray([
            { answerText: questionData.correct_answer, isCorrect: true },
            ...questionData.incorrect_answers.map((answerText: string) => ({ answerText, isCorrect: false })),
          ]);
          return {
            ...questionData,
            answerOptions: answerOptions,
          };
        });
        setQuestions(transformedQuestions);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    }
    loadQuestions();
  }, []);

  const handleAnswerButtonClick = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;

    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  return (
    <div className='app'>

      {questions.length === 0 ? (
        <p>Cargando...</p>
      ) : showScore ? (
        <div className='score-section'>
          <h2>Resultados</h2>
          <h3>Total de preguntas: {questions.length}</h3>
          <div className="rightAnwsers">
            <p>
              <img src="/check-icon.svg" alt="icono de marcación correcta" />
              Respuestas correctas:
            </p>
            <span>
              {score}
            </span>
          </div>
          <div className="wrongAnwsers">
            <p>
              <img src="/x-icon.svg" alt="Ícono de marcación incorrecta" />
              Respuestas incorrectas:
            </p>
            <span>
              {questions.length - score}
            </span>
          </div>
          <div className="messages">
            {score >= 3 ? (
              <img className="conffetiEffect" src="conffeti.gif" alt="confeti" />
            ) : (

              <h1 className="messageResult">Has respondido correctamente muy pocas preguntas 😭</h1>

            )}
          </div>
          <button onClick={() => window.location.reload()}>
            Play again!
          </button>
        </div>
      ) : (
        <div className='question-container'>
          <div className='question-section'>
            <div className='question-count'>
              <h1 className='title'>Quizz app</h1>
              <span>Pregunta {currentQuestion + 1}</span>/{questions.length}
            </div>
            <div className='question-text'>
              {questions[currentQuestion] && (
                <h2>
                  {questions[currentQuestion].question}
                </h2>
              )}
            </div>
          </div>
          <div className='answer-section'>
            {questions.length > 0 && questions[currentQuestion] && questions[currentQuestion].answerOptions.map((answerOption, index) => (
              <button
                key={index}
                onClick={() => handleAnswerButtonClick(answerOption.isCorrect)}
              >
                {answerOption.answerText}
              </button>
            ))}



          </div>
        </div>
      )}
    </div>
  );
}
