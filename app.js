/*
	Import libraries
*/
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CharacterAI = require('node_characterai');
const characterAI = new CharacterAI();


/*
	Processing
*/



const bot = new TelegramBot(TELEGRAM_TOKEN, {polling: true});


bot.setWebHook(process.env.WEBHOOK_URL);

bot.onText(/\/start/, async (msg, match) => {
	let chatId = msg.chat.id;
	
	bot.sendMessage(chatId, "Xin chào, tôi là Kerros - Một trợ lí ảo!");
	
	
});

bot.onText(/(.+)/, async (msg, match) => {
	
	let chatId = msg.chat.id;
	let question = match[1];
	let answer = "";
	
	(async() => {
		await characterAI.authenticateAsGuest();
		const characterId = "gj6Fzgn1XOO3j7Dw8yjvdfqHXBB5nJza7aQlU_t2CQg";

		const chat = await characterAI.createOrContinueChat(characterId);
		const response = await chat.sendAndAwaitResponse(question, true);

		bot.sendMessage(chatId, response);
	})();
	
	
});