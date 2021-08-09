module.exports = {
    regexp: /^(бан|ban)/i,
    function: async function(message, { db }){
        if(!message.mentions.members.first())return message.warn('Вы забыли переслать сообщение пользователя.');
        let id = message.mentions.members.first().user.id;
        let reason = message.text.split(" ").slice(1).join(" ");
        if(id == message.author.id)return message.error('Вы не можете заблокировать себя!');
        let user = await db.getUser(id, message);
        if(user.rights >= message.user.rights)return message.warn('Нельзя выдать бан пользователю с такими же правами и выше!');

        if(!reason)reason = "Нарушение правил.";
        if(user.ban.isBanned)return message.error(`Этот пользователь уже забанен по причине "${user.ban.reason}"`);
        user.ban.isBanned = true;
        user.ban.reason = reason;
        db.write();
        return message.ok(`${user.nick} успешно заблокирован по причине "${reason}"`);
    },
    rights: 2,
    help: "бан [пересланное сообщение] [причина]",
    description: "блокировка пользователя в боте."
};