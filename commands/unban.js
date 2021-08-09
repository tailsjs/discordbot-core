module.exports = {
    regexp: /^(разбан|unban)/i,
    function: async function(message, { db }){
        if(!message.mentions.members.first())return message.error('Вы забыли переслать сообщение пользователя.');
        let id = message.mentions.members.first().user.id;
        let user = await db.getUser(id, message);
        if(user.rights >= message.user.rights)return message.warn('Нельзя убирать бан пользователю с такими же правами и выше!');
        if(!user.ban.isBanned)return message.error(`Этот пользователь уже разблокирован.`);
        user.ban.isBanned = false;
        user.ban.reason = "";
        db.write();
        return message.ok(`${user.nick} успешно разблокирован.`);
    },
    rights: 2,
    help: "разбан [пересланное сообщение]",
    description: "разблокировка пользователя в боте."
};