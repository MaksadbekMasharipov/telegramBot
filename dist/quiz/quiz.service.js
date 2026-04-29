"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const quiz_session_schema_1 = require("./schemas/quiz-session.schema");
const QUESTIONS_PER_ROUND = 10;
let QuizService = class QuizService {
    constructor(quizSessionModel) {
        this.quizSessionModel = quizSessionModel;
    }
    async startNewRound(telegramUserId) {
        const questions = this.generateQuestions(QUESTIONS_PER_ROUND);
        return this.quizSessionModel
            .findOneAndUpdate({ telegramUserId }, {
            telegramUserId,
            questions,
            currentIndex: 0,
            correctAnswers: 0,
        }, { upsert: true, new: true, setDefaultsOnInsert: true })
            .exec();
    }
    async getSession(telegramUserId) {
        return this.quizSessionModel.findOne({ telegramUserId }).exec();
    }
    getCurrentQuestion(session) {
        if (session.currentIndex >= session.questions.length) {
            return null;
        }
        return session.questions[session.currentIndex];
    }
    async submitAnswer(session, answer) {
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
    generateQuestions(count) {
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
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
};
exports.QuizService = QuizService;
exports.QuizService = QuizService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(quiz_session_schema_1.QuizSession.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], QuizService);
//# sourceMappingURL=quiz.service.js.map