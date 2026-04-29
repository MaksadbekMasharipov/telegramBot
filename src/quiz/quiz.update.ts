import { Ctx, Hears, On, Start, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { QuizService } from './quiz.service';

@Update()
export class QuizUpdate {
  constructor(private readonly quizService: QuizService) {}

  @Start()
  async onStart(@Ctx() ctx: Context): Promise<void> {
    const telegramUserId = ctx.from?.id;
    if (!telegramUserId) {
      await ctx.reply('Foydalanuvchi aniqlanmadi.');
      return;
    }

    const session = await this.quizService.startNewRound(telegramUserId);
    const firstQuestion = this.quizService.getCurrentQuestion(session);

    await ctx.reply(
      `Salom! 10 ta matematik savol boshlaymiz.\n\n1/10: ${firstQuestion?.question}`,
    );
  }

  @Hears(/^(yana|Yana)$/)
  async onRetry(@Ctx() ctx: Context): Promise<void> {
    const telegramUserId = ctx.from?.id;
    if (!telegramUserId) {
      await ctx.reply('Foydalanuvchi aniqlanmadi.');
      return;
    }

    const session = await this.quizService.startNewRound(telegramUserId);
    const firstQuestion = this.quizService.getCurrentQuestion(session);

    await ctx.reply(`Yangi 10 ta savol boshlandi!\n\n1/10: ${firstQuestion?.question}`);
  }

  @On('text')
  async onText(@Ctx() ctx: Context): Promise<void> {
    const telegramUserId = ctx.from?.id;
    const text = (ctx.message as { text?: string })?.text?.trim();

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
      await ctx.reply(
        `${statusText}\n\nTest yakunlandi.\nTo‘g‘ri javoblar soni: ${result.correctAnswers}/${result.totalQuestions}\n\nYana ishlash uchun "yana" deb yozing.`,
      );
      return;
    }

    const statusText = result.isCorrect
      ? 'To‘g‘ri.'
      : `Noto‘g‘ri. To‘g‘ri javob: ${result.expectedAnswer}.`;

    await ctx.reply(
      `${statusText}\n${result.currentQuestionNumber + 1}/${result.totalQuestions}: ${result.nextQuestion?.question}`,
    );
  }
}
