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
exports.QuizUpdate = void 0;
const nestjs_telegraf_1 = require("nestjs-telegraf");
const telegraf_1 = require("telegraf");
const quiz_service_1 = require("./quiz.service");
let QuizUpdate = class QuizUpdate {
    constructor(quizService) {
        this.quizService = quizService;
    }
    async onStart(ctx) {
        const telegramUserId = ctx.from?.id;
        if (!telegramUserId) {
            await ctx.reply('Foydalanuvchi aniqlanmadi.');
            return;
        }
        const session = await this.quizService.startNewRound(telegramUserId);
        const firstQuestion = this.quizService.getCurrentQuestion(session);
        await ctx.reply(`Salom! 10 ta matematik savol boshlaymiz.\n\n1/10: ${firstQuestion?.question}`);
    }
    async onRetry(ctx) {
        const telegramUserId = ctx.from?.id;
        if (!telegramUserId) {
            await ctx.reply('Foydalanuvchi aniqlanmadi.');
            return;
        }
        const session = await this.quizService.startNewRound(telegramUserId);
        const firstQuestion = this.quizService.getCurrentQuestion(session);
        await ctx.reply(`Yangi 10 ta savol boshlandi!\n\n1/10: ${firstQuestion?.question}`);
    }
    async onText(ctx) {
        const telegramUserId = ctx.from?.id;
        const text = ctx.message?.text?.trim();
        if (!telegramUserId || !text) {
            return;
        }
        const session = await this.quizService.getSession(telegramUserId);
        if (!session) {
            await ctx.reply('Boshlash uchun /start buyrug‘ini bosing.');
            return;
        }
        const answer = Number(text);
        if (Number.isNaN(answer)) {
            await ctx.reply('Iltimos, javobni faqat son ko‘rinishida yuboring.');
            return;
        }
        const result = await this.quizService.submitAnswer(session, answer);
        if (result.isFinished) {
            const statusText = result.isCorrect
                ? 'To‘g‘ri.'
                : `Noto‘g‘ri. To‘g‘ri javob: ${result.expectedAnswer}.`;
            await ctx.reply(`${statusText}\n\nTest yakunlandi.\nTo‘g‘ri javoblar soni: ${result.correctAnswers}/${result.totalQuestions}\n\nYana ishlash uchun "yana" deb yozing.`);
            return;
        }
        const statusText = result.isCorrect
            ? 'To‘g‘ri.'
            : `Noto‘g‘ri. To‘g‘ri javob: ${result.expectedAnswer}.`;
        await ctx.reply(`${statusText}\n${result.currentQuestionNumber + 1}/${result.totalQuestions}: ${result.nextQuestion?.question}`);
    }
};
exports.QuizUpdate = QuizUpdate;
__decorate([
    (0, nestjs_telegraf_1.Start)(),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], QuizUpdate.prototype, "onStart", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)(/^(yana|Yana)$/),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], QuizUpdate.prototype, "onRetry", null);
__decorate([
    (0, nestjs_telegraf_1.On)('text'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], QuizUpdate.prototype, "onText", null);
exports.QuizUpdate = QuizUpdate = __decorate([
    (0, nestjs_telegraf_1.Update)(),
    __metadata("design:paramtypes", [quiz_service_1.QuizService])
], QuizUpdate);
//# sourceMappingURL=quiz.update.js.map