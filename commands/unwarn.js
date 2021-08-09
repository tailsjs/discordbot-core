module.exports = {
    regexp: /^(разварн|unwarn)/i,
    function: async function(message, { db, config }){
        if(!message.mentions.members.first())return message.warn('Вы забыли переслать сообщение пользователя.');
        let id = message.mentions.members.first().user.id;
        if(id == message.author.id)return message.warn('Вы не можете убрать у себя предупреждение!');
        let user = await db.getUser(id, message);
        if(user.rights >= message.user.rights)return message.warn('Нельзя убирать предупреждение у пользователя с такими же правами и выше!');

        if(user.ban.isBanned)return message.error('Этот пользователь забанен. Нельзя убрать предупреждение.');
        if(user.warn == 0)return message.error('У этого пользователя нет варнов!');
        user.warn -= 1;
        db.write();
        return message.ok(`У пользователя ${user.nick} успешно убрано предупреждение. ${user.warn}/${config.maxWarns} варн.`);
    },
    rights: 2,
    help: "разварн [пересланное сообщение]",
    description: "убрать предупреждение у пользователя."
};