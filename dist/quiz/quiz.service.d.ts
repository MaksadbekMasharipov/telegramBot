import { Model } from 'mongoose';
import { QuizQuestion, QuizSessionDocument } from './schemas/quiz-session.schema';
export declare class QuizService {
    private readonly quizSessionModel;
    constructor(quizSessionModel: Model<QuizSessionDocument>);
    startNewRound(telegramUserId: number): Promise<QuizSessionDocument>;
    getSession(telegramUserId: number): Promise<QuizSessionDocument | null>;
    getCurrentQuestion(session: QuizSessionDocument): QuizQuestion | null;
    submitAnswer(session: QuizSessionDocument, answer: number): Promise<{
        isCorrect: boolean;
        expectedAnswer: number;
        isFinished: boolean;
        nextQuestion: QuizQuestion | null;
        currentQuestionNumber: number;
        totalQuestions: number;
        correctAnswers: number;
    }>;
    private generateQuestions;
    private randomInt;
}
