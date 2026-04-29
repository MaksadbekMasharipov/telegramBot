import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizService } from './quiz.service';
import { QuizUpdate } from './quiz.update';
import { QuizSession, QuizSessionSchema } from './schemas/quiz-session.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: QuizSession.name,
        schema: QuizSessionSchema,
      },
    ]),
  ],
  providers: [QuizService, QuizUpdate],
})
export class QuizModule {}
