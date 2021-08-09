module.exports = {
    regexp: /^(варн|warn)/i,
    function: async function(message, { db, config }){
        if(!message.mentions.members.first())return message.warn('Вы забыли переслать сообщение пользователя.');
        let id = message.mentions.members.first().user.id;
        if(id == message.author.id)return message.warn('Вы не можете предупредить себя!');
        let user = await db.getUser(id, message);
        if(user.rights >= message.user.rights)return message.warn('Нельзя выдать предупреждение пользователю с такими же правами и выше!');

        if(user.ban.isBanned)return message.warn(`Этот пользователь забанен. Нельзя предупредить`);
        user.warn += 1;
        if(user.warn == config.maxWarns){
            user.ban.isBanned = true;
            user.ban.reason = "Нарушение правил.";
        };
        db.write();
        return message.ok(`${user.nick} успешно предупрждён. ${user.warn}/${config.maxWarns} варн.`);
    },
    rights: 2,
    help: "варн [пересланное сообщение]",
    description: "предупредить пользователя"
}