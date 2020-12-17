const fs = require("fs");
const Bot = require("node-telegram-bot-api");
const ytdl = require("ytdl-core");
require("dotenv").config();

const token = process.env.TOKEN;
let bot;
if(process.env.NODE_ENV === 'production') {
  bot = new Bot(token);
  bot.setWebHook(process.env.HEROKU_URL + bot.token);
}
else {
  bot = new Bot(token, { polling: true });
}

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Welcome to best downloader EVER🔥');
});

bot.onText(/\/v (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const url = match[1]; 
  if(ytdl.validateURL(url)){
  const video = ytdl(url, {quality: "lowest", filter: format => format.hasVideo && format.hasAudio});

  video.pipe(fs.createWriteStream("video.mp3"));
  bot.sendMessage(
    msg.chat.id,
    "Please wait while download the video- depend on speed of net",
    { replyToMessage: msg.message_id }
  );
  video.on("info", function (info) {
    bot.sendMessage(msg.chat.id, `The video still downloading !`);
  });
  video.on("end", function () {
    let vid = `${__dirname}/video.mp3`;
    let stats = fs.statSync(vid);
    let fileSizeInBytes = stats.size;
    var fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024).toFixed(2);
    if (Number(fileSizeInMegabytes) >= 50) {
      bot.sendMessage(
        msg.chat.id,
        `Video is too large to send via HTTP BOT Api, please set up your own BotAPI Server to send via MTProto...`
      );
    } else {
      bot
        .sendVideo(msg.chat.id, vid, { replyToMessage: msg.message_id })
        .catch((error) => console.log(error));
      fs.unlink(vid, (error) => console.log(error));
    }
  });
}else bot.sendMessage(
  msg.chat.id,
  "Please send YT video",
  { replyToMessage: msg.message_id });

});

bot.onText(/\/a (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const url = match[1]; 
  if(ytdl.validateURL(url)){
  const audio =  ytdl(url, {quality: "lowestaudio"});

  audio.pipe(fs.createWriteStream("audio.mp3"));
  bot.sendMessage(
    msg.chat.id,
    "Please wait while download the audio- depend on speed of net",
    { replyToMessage: msg.message_id }
  );
  audio.on("info", function (info) {
    bot.sendMessage(msg.chat.id, `The audio still downloading !`);
  });
  audio.on("end", function () {
    let sound = `${__dirname}/audio.mp3`;
    let stats = fs.statSync(sound);
    let fileSizeInBytes = stats.size;
    var fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024).toFixed(2);
    if (Number(fileSizeInMegabytes) >= 50) {
      bot.sendMessage(
        msg.chat.id,
        `audio is too large to send via HTTP BOT Api, please set up your own BotAPI Server to send via MTProto...`
      );
    } else {
      bot
        .sendAudio(msg.chat.id, sound, { replyToMessage: msg.message_id })
        .catch((error) => console.log(error));
      fs.unlink(sound, (error) => console.log(error));
    }
  });
}else bot.sendMessage(
  msg.chat.id,
  "Please send YT video",
  { replyToMessage: msg.message_id });

});




module.exports = bot;