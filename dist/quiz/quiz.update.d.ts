import { Context } from 'telegraf';
import { QuizService } from './quiz.service';
export declare class QuizUpdate {
    private readonly quizService;
    constructor(quizService: QuizService);
    onStart(ctx: Context): Promise<void>;
    onRetry(ctx: Context): Promise<void>;
    onText(ctx: Context): Promise<void>;
}
