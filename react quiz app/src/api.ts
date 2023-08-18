import he from 'he';

interface APIResponse {
    response_code: number;
    results: QuestionData[];
}

export interface QuestionData {
    category: string;
    correct_answer: string;
    difficulty: string;
    incorrect_answers: string[];
    question: string;
    type: string;
}

export interface Question extends QuestionData {
    answerOptions: AnswerOption[];
}

interface AnswerOption {
    answerText: string;
    isCorrect: boolean;
}

async function fetchQuestions(): Promise<APIResponse> {
    const response = await fetch("https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple");
    const data: APIResponse = await response.json();


    const decodedResults = data.results.map(questionData => ({
        ...questionData,
        question: he.decode(questionData.question),
        correct_answer: he.decode(questionData.correct_answer),
        incorrect_answers: questionData.incorrect_answers.map(incorrectAnswer => he.decode(incorrectAnswer))
    }));


    return {
        ...data,
        results: decodedResults
    };
}

export { fetchQuestions };
