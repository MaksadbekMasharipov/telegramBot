import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type QuizSessionDocument = HydratedDocument<QuizSession>;

@Schema({ _id: false })
export class QuizQuestion {
  @Prop({ required: true })
  question!: string;

  @Prop({ required: true })
  answer!: number;
}

const QuizQuestionSchema = SchemaFactory.createForClass(QuizQuestion);

@Schema({ timestamps: true })
export class QuizSession {
  @Prop({ required: true, unique: true, index: true })
  telegramUserId!: number;

  @Prop({ default: 0 })
  currentIndex!: number;

  @Prop({ default: 0 })
  correctAnswers!: number;

  @Prop({ type: [QuizQuestionSchema], default: [] })
  questions!: QuizQuestion[];
}

export const QuizSessionSchema = SchemaFactory.createForClass(QuizSession);
