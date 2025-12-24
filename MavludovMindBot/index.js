require('dotenv').config();
const { Telegraf } = require('telegraf');
const fetch = require('node-fetch');

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

bot.start((ctx) => ctx.reply('Привет! Я твой AI-бот. Пиши что угодно.'));

bot.on('text', async (ctx) => {
  const userMessage = ctx.message.text;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userMessage }]
      })
    });

    const data = await response.json();
    ctx.reply(data.choices[0].message.content);
  } catch (err) {
    console.error(err);
    ctx.reply('Ошибка с AI :(');
  }
});

bot.launch();
console.log('Бот запущен');
