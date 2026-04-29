import { HydratedDocument } from 'mongoose';
export type QuizSessionDocument = HydratedDocument<QuizSession>;
export declare class QuizQuestion {
    question: string;
    answer: number;
}
export declare class QuizSession {
    telegramUserId: number;
    currentIndex: number;
    correctAnswers: number;
    questions: QuizQuestion[];
}
export declare const QuizSessionSchema: import("mongoose").Schema<QuizSession, import("mongoose").Model<QuizSession, any, any, any, any, any, QuizSession>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, QuizSession, import("mongoose").Document<unknown, {}, QuizSession, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<QuizSession & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    telegramUserId?: import("mongoose").SchemaDefinitionProperty<number, QuizSession, import("mongoose").Document<unknown, {}, QuizSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<QuizSession & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    currentIndex?: import("mongoose").SchemaDefinitionProperty<number, QuizSession, import("mongoose").Document<unknown, {}, QuizSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<QuizSession & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    correctAnswers?: import("mongoose").SchemaDefinitionProperty<number, QuizSession, import("mongoose").Document<unknown, {}, QuizSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<QuizSession & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    questions?: import("mongoose").SchemaDefinitionProperty<QuizQuestion[], QuizSession, import("mongoose").Document<unknown, {}, QuizSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<QuizSession & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, QuizSession>;
