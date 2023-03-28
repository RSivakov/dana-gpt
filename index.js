const {dotenv} = require("dotenv/config");
// require('dotenv').config()
const { Configuration, OpenAIApi } = require("openai");
const { getImage, getChat } = require("./Helper/functions");
const { Telegraf } = require("telegraf");

const configuration = new Configuration({
  apiKey: process.env.API,
});
const openai = new OpenAIApi(configuration);
module.exports = openai;

const bot = new Telegraf(process.env.TG_API);
bot.start((ctx) => ctx.reply("Welcome , You can ask anything from me"));

bot.help((ctx) => {
  ctx.reply(
    "This bot can perform the following command \n /image -> to create image from text \n /ask -> ank anything from me "
  );
});



// Image command
bot.command("image", async (ctx) => {
  const text = ctx.message.text?.replace("/image", "")?.trim().toLowerCase();

  if (text) {
   
    const res = await getImage(text);

    if (res) {
      ctx.sendChatAction("upload_photo");
      // ctx.sendPhoto(res);
      // ctx.telegram.sendPhoto()
      ctx.telegram.sendPhoto(ctx.message.chat.id, res, {
        reply_to_message_id: ctx.message.message_id,
      });
    }
  } else {
    ctx.telegram.sendMessage(
      ctx.message.chat.id,
      "You have to give some description after /image",
      {
        reply_to_message_id: ctx.message.message_id,
      }
    );
  }
});

// Chat command

bot.command("ask", async (ctx) => {
  const text = ctx.message.text?.replace("/ask", "")?.trim().toLowerCase();

  if (text) {
    ctx.sendChatAction("typing");
    const res = await getChat(text);
    if (res) {
      ctx.telegram.sendMessage(ctx.message.chat.id, res, {
        reply_to_message_id: ctx.message.message_id,
      });
    }
  } else {
    ctx.telegram.sendMessage(
      ctx.message.chat.id,
      "Please ask anything after /ask",
      {
        reply_to_message_id: ctx.message.message_id,
      }
    );
  
    //  reply("Please ask anything after /ask");
  }
});

bot.on("message", async (msg) => {
  const baseCompletion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `${msg.text}.\n`,
      temperature: 0.8,
      max_tokens: 4000,
  })

  console.log(baseCompletion.data.usage?.prompt_tokens)
  const basePromptOuput = baseCompletion.data.choices.pop()

  const chatId = msg.chat.id

  invariant(basePromptOuput?.text, "Не удалось получить ответ от open ai")
  bot.sendMessage(chatId, basePromptOuput?.text)
})

bot.launch();