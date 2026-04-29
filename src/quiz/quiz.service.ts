import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  QuizQuestion,
  QuizSession,
  QuizSessionDocument,
} from './schemas/quiz-session.schema';

const QUESTIONS_PER_ROUND = 10;

@Injectable()
export class QuizService {
  constructor(
    @InjectModel(QuizSession.name)
    private readonly quizSessionModel: Model<QuizSessionDocument>,
  ) {}

  async startNewRound(telegramUserId: number): Promise<QuizSessionDocument> {
    const questions = this.generateQuestions(QUESTIONS_PER_ROUND);

    return this.quizSessionModel
      .findOneAndUpdate(
        { telegramUserId },
        {
          telegramUserId,
          questions,
          currentIndex: 0,
          correctAnswers: 0,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      )
      .exec();
  }

  async getSession(telegramUserId: number): Promise<QuizSessionDocument | null> {
    return this.quizSessionModel.findOne({ telegramUserId }).exec();
  }

  getCurrentQuestion(session: QuizSessionDocument): QuizQuestion | null {
    if (session.currentIndex >= session.questions.length) {
      return null;
    }

    return session.questions[session.currentIndex];
  }

  async submitAnswer(
    session: QuizSessionDocument,
    answer: number,
  ): Promise<{
    isCorrect: boolean;
    expectedAnswer: number;
    isFinished: boolean;
    nextQuestion: QuizQuestion | null;
    currentQuestionNumber: number;
    totalQuestions: number;
    correctAnswers: number;
  }> {
    const question = this.getCurrentQuestion(session);
    if (!question) {
      return {
        isCorrect: false,
        expectedAnswer: 0,
        isFinished: true,
        nextQuestion: null,
        currentQuestionNumber: QUESTIONS_PER_ROUND,
        totalQuestions: QUESTIONS_PER_ROUND,
        correctAnswers: session.correctAnswers,
      };
    }

    const isCorrect = answer === question.answer;
    if (isCorrect) {
      session.correctAnswers += 1;
    }

    session.currentIndex += 1;
    await session.save();

    const isFinished = session.currentIndex >= QUESTIONS_PER_ROUND;
    const nextQuestion = isFinished ? null : session.questions[session.currentIndex];

    return {
      isCorrect,
      expectedAnswer: question.answer,
      isFinished,
      nextQuestion,
      currentQuestionNumber: session.currentIndex,
      totalQuestions: QUESTIONS_PER_ROUND,
      correctAnswers: session.correctAnswers,
    };
  }

  private generateQuestions(count: number): QuizQuestion[] {
    return Array.from({ length: count }, () => {
      const left = this.randomInt(1, 20);
      const right = this.randomInt(1, 20);
      const operator = Math.random() > 0.5 ? '+' : '-';
      const answer = operator === '+' ? left + right : left - right;

      return {
        question: `${left} ${operator} ${right} = ?`,
        answer,
      };
    });
  }

  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
