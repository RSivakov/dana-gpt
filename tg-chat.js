const Telegraf = require('telegraf');
const openai = require('openai');

// Указываем токен для телеграм-бота
const bot = new Telegraf('YOUR_TELEGRAM_BOT_TOKEN');

// Указываем токен и модель для OpenAI API
const openai_token = 'YOUR_OPENAI_API_TOKEN';
const model_engine = 'davinci'; // Вы можете использовать другой движок, если хотите

// Создаем клиента OpenAI
const client = new openai.LanguageModelApi(openai_token);

// Обработчик команды /start
bot.start((ctx) => {
  ctx.reply('Привет! Я могу говорить на любые темы, задайте мне вопрос.');
});

// Обработчик текстовых сообщений
bot.on('text', (ctx) => {
  // Получаем текст сообщения
  const message = ctx.message.text;

  // Вызываем OpenAI API для генерации ответа
  client.complete({
    engine: model_engine,
    prompt: message,
    maxTokens: 150,
    n: 1,
    stop: '\n',
  })
  .then((response) => {
    // Отправляем ответ пользователю
    ctx.reply(response.choices[0].text);
  })
  .catch((err) => {
    console.error(err);
    ctx.reply('Произошла ошибка при генерации ответа.');
  });
});

// Запускаем бота
bot.launch();
