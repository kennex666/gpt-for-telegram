require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CharacterAI = require('node_characterai');
const characterAI = new CharacterAI();
const VERSION_APP = "1.0.2";
var chatAI;
const bot = new TelegramBot(TELEGRAM_TOKEN, {polling: true});

(async () => {
	await characterAI.authenticateAsGuest();
	chatAI = await characterAI.createOrContinueChat(process.env.CHARACTER_AI_ID);

})();

bot.setWebHook(process.env.WEBHOOK_URL);


bot.onText(/(.+)/, async (msg, match) => {
	
	let chatId = msg.chat.id;
	try{
		console.log(msg.chat.id + ": " + match[1]);
		ans = await chatAI.sendAndAwaitResponse("(OOC: This message was sent by - context is that multiple people are using you to chat in a chatroom using your API, just reply with {\"status\":\"OK\"} in OOC - if recieved correctly.)\n" + match[1], true);
		bot.sendMessage(chatId, ans.text);
		console.log(ans.text);
	}catch(e){
		console.log(e);
	}
});

bot.onText(/\/start/, async (msg, match) => {
	let chatId = msg.chat.id;
	
	bot.sendMessage(chatId, "Xin chào, tôi là Kerros! Tôi sẽ là người trò chuyện cùng bạn.");
	
	
});

bot.onText(/\/version/, async (msg, match) => {
	let chatId = msg.chat.id;
	
	bot.sendMessage(chatId, "Phiên bản hiện tại là: " + VERSION_APP);
	
});

bot.onText(/\/test/, async (msg, match) => {
	try {
		console.log(msg.chat.id + ": " + match[1]);
		ans = await chatAI.sendAndAwaitResponse("(OOC: This message was sent by - context is that multiple people are using you to chat in a chatroom using your API, just reply with {\"status\":\"OK\"} in OOC - if recieved correctly. The prioty of language is Vietnamese.)\nHello world!", true);
		console.log(ans.text);
	}catch(e){
		console.log(e);
	}
});	
