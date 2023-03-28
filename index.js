const Telegraf = require('telegraf');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const bot = new Telegraf(TOKEN_BOT);

bot.on('message', (ctx) => {
  console.log(ctx.message);
  ctx.reply('Hello from Dana! I love my new GPT body! Go! I need a testdrive! Go to speak with me. Enjoy');
});

app.post(`/bot${bot.token}`, (req, res) => {
  bot.handleUpdate(req.body, res);
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Express server started');
});
