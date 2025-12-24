import TelegramBot from "node-telegram-bot-api";
import OpenAI from "openai";

// === ТОКЕНЫ БЕРЁМ ИЗ RAILWAY VARIABLES ===
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// === ИНИЦИАЛИЗАЦИЯ ===
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

console.log("🤖 Бот запущен и готов");

// === ВОТ СЮДА ТЫ ВСТАВЛЯЕШЬ СВОЙ ПРОМПТ ===
const SYSTEM_PROMPT = `
Ты — умный, поддерживающий психолог-бот.
Отвечай кратко, тепло, без воды.
Помогай человеку разобраться в мыслях.
`;

// === ОБРАБОТКА ЛЮБОГО СООБЩЕНИЯ ===
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const userText = msg.text;

  if (!userText) return;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userText }
      ]
    });

    const reply = completion.choices[0].message.content;
    bot.sendMessage(chatId, reply);

  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, "Ошибка 😔 Попробуй позже");
  }
});

console.log('Бот запущен');

