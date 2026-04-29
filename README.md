# Telegram Math Quiz Bot (NestJS + MongoDB)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from example:

```bash
cp .env.example .env
```

3. Fill environment values in `.env`:

- `TELEGRAM_BOT_TOKEN`
- `MONGO_URI`

## Run

```bash
npm run start:dev
```

## Bot flow

- `/start` -> starts 10 math questions.
- User answers one by one with numbers.
- After 10 answers, bot shows total correct answers.
- User writes `yana` to get another 10 questions.
