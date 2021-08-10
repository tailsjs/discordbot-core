const Discord = require("discord.js");
const config = require("./config.json");
const client = new Discord.Client(); 
const low = require('lowdb');	
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
const fs = require("fs");
const fetch = require("node-fetch")

db.defaults({ users: [] }).write();

db.getUser = async(ID) => {
    if(isNaN(ID))return logger('ID can be only numberic!', 4)
    let user = db.get('users').find({ id: Number(ID) }).value();
    if(!user){
        const discordUser = await fetchUser(ID)
        db.get('users').push({
            id: Number(ID),
            userId: db.get('users').value().length + 1,
            nick: discordUser.username,
            discriminator: discordUser.discriminator,
            rights: 0,
            warns: 0,
            ban: {
                isBanned: false,
                reason: ""
            }
        }).write();
        user = db.get("users").find({ id: ID }).value();
    };
    return user;
};

const commands = fs.readdirSync(`${__dirname}/commands/`).filter((name) => /\.js$/i.test(name)).map((name) => require(`${__dirname}/commands/${name}`));

if(!config.botToken) return logger("Вы забыли указать токен в config.json!", 2, true);

client.once("ready", async() => {
    logger("Бот на ядре discordbot-core от tailsjs запущен!", 0);
    if(config.rpc.enabled){
        setInterval(function(){
            client.user.setPresence({
                status: config.rpc.status,
                activity: {
                    name: config.rpc.texts[random(0, config.rpc.texts.length - 1)],
                    type: config.rpc.type,
                    url: config.rpc.twitchUrl
                }
            });
        }, config.rpc.changeIntervalS * 1000);
    };
});

client.once("reconnecting", () => {
    logger('Переподключение...', 1)
});
  
client.once("disconnect", () => {
    logger('Отключен!', 2)
});

client.on("message", async message => {
    if(message.author.bot)return;
    if(!message.content.startsWith(config.prefix) && message.channel.type !== 'dm')return;
    logger(`${message.member ? message.member.user.tag : message.author.tag} (${message.author.id}) => ${message.content}`, 3);
    
    message.text = message.content.replace(config.prefix, "");
    message.user = await db.getUser(message.author.id, message);
    let command = commands.find(command => command.regexp ? command.regexp.test(message.text) : (new RegExp(`^\\s*(${command.tag.join('|')})`, "i")).test(message.text));
    message.answer = (text = "", params = {}) => {
        return message.channel.send(text, params);
    };
    message.ok = (text = "", params = {}) => {
        return message.answer(`✅ >> ${text}`, params);
    };
    message.error = (text = "", params = {}) => {
        return message.answer(`❌ >> ${text}`, params);
    };
    message.warn = (text = "", params = {}) => {
        return message.answer(`⚠️ >> ${text}`, params);
    };
    if(message.user.ban.isBanned)return message.error(`Вы заблокированы.\nПричина: ${message.user.ban.reason}`);
    if(!command)return message.error("Такой команды нет!");
    if(message.user.rights < command.rights)return message.warn(`Команда доступна только ${["Пользователям", "Випам", "Админам", "Создателю"][command.rights]} ${command.rights > 0 && command.rights !== 3 ? "или выше." : ""}`);
    try{
        await command.function(message, { command, db, config, commands, fetchUser, logger, random, fetch });
    }catch(e){
        logger(`Ошибка: ${e}`, 2);
        if(config.errorLogging){
            client.users.cache.get(config.ownerId).send(`Произошла ошибка! \`\`\`${e}\`\`\`\nВызвана: ${message.author.tag} (<@${message.author.id}>)\nЕсли вы не знаете как её починить, пишите tailsjs.`);
        };
    }
})

client.login(config.botToken);

process.on("uncaughtException", e => {
    logger(e, 2);
});
process.on("unhandledRejection", e => {
    logger(e, 2);
});

function logger(text, value = 0, crashAfterError = false){
    const sub = ["GOOD", "WARN", "ERROR", "MESSAGE", "DB ERROR"];
    if(value > sub.length || isNaN(value))return console.log(`[ LOGGER ERROR ] >> Значение должно быть от 0 до ${sub.length - 1}!`);
    console.log(`[ ${sub[value]} ] >> ${text}`);
    if(crashAfterError && value == 2)return process.exit(-1);
};
function random(min, max) {return Math.round(Math.random() * (max - min)) + min};
async function fetchUser(id){
    if(typeof id != "string")throw new Error('[ FETCHUSER ERROR ] >> Пожалуйста, отправляйте ID с типом String (проще говоря String(ID)), ибо дискорд странный')
    const response = await fetch(`https://discord.com/api/v9/users/${id}`, {
        headers: {
            Authorization: `Bot ${config.botToken}`
        }
    })
    if (!response.ok) throw new Error(`[ FETCHUSER ERROR ] >> Код ошибки: ${response.status}`)
    return response.json()
}
