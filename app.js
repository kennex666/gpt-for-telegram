require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CharacterAI = require('node_characterai');
const characterAI = new CharacterAI();
const VERSION_APP = "1.0.3";
var chatAI;
const bot = new TelegramBot(TELEGRAM_TOKEN, {polling: true});

var listUserBanned = {};

(async () => {
	await characterAI.authenticateAsGuest();
	chatAI = await characterAI.createOrContinueChat(process.env.CHARACTER_AI_ID);
})();

bot.setWebHook(process.env.WEBHOOK_URL);


bot.onText(/^([^\/].+)/, async (msg, match) => {
	let chatId = msg.chat.id;
	
	if (listUserBanned.hasOwnProperty(chatId)){
		bot.sendMessage(chatId, "Tôi không muốn nói chuyện với bạn nữa. Bạn thật khiếm nhã!");
		return;
	}
	
	try{
		console.log(msg.chat.id + ": " + match[1]);
		ans = await chatAI.sendAndAwaitResponse("(OOC: This message was sent by " + chatId + " - context is that multiple people are using you to chat in a chatroom using your API, just reply with {\"status\":\"OK\"} in OOC - if recieved correctly. If you hate someone and don't want to talk to them, just reply with {\"status\":\"OK\", \"hate\":\"1\"})\n" + match[1], true);
		bot.sendMessage(chatId, ans.text);
		if (ans.text.match(/("hate":"1")/)){
			listUserBanned[chatId] = true;
		}
		console.log(ans.text);
	}catch(e){
		bot.sendMessage(chatId, "Quá tải! Hãy thử lại sau.");
		console.log(e);
	}
});

bot.onText(/^\/start/, async (msg, match) => {
	let chatId = msg.chat.id;
	bot.sendMessage(chatId, "Xin chào, tôi là Kerros! Tôi sẽ là người trò chuyện cùng bạn.");
});

bot.onText(/^\/version/, async (msg, match) => {
	let chatId = msg.chat.id;
	
	bot.sendMessage(chatId, "Phiên bản hiện tại là: " + VERSION_APP);
	
});

bot.onText(/^(\/genimg )/, async (msg, match) => {
	let chatId = msg.chat.id;
	try {
		let url = await chatAI.generateImage(match[1].replace(/(\/genimg )/, ''))
		bot.sendPhoto(chatId, url);
		console.log(url);
	}catch (e) {
		console.log("Lỗi: Không phản hồi!");
	}
	
});

bot.onText(/^\/test/, async (msg, match) => {
	let chatId = msg.chat.id;
	try{
		console.log(msg.chat.id + ": " + match[1]);
		ans = await chatAI.sendAndAwaitResponse("(OOC: This message was sent by " + chatId + " - context is that multiple people are using you to chat in a chatroom using your API, just reply with {\"status\":\"OK\"} in OOC - if recieved correctly.)\nHello world!", true);
		bot.sendMessage(chatId, ans.text);
		console.log(ans.text);
	}catch(e){
		bot.sendMessage(chatId, "Quá tải! Hãy thử lại sau.");
		console.log(e);
	}
});	
