module.exports = {
    regexp: /^(помощь|help|commands|команды)/i,
    function: async function(message, { commands, config }){
        let result = [
            `Команды бота ${config.botName}:`,
            ``,
            `Команды для пользователей:`,
            commands.filter(command => command.rights == 0).map(command => `${config.prefix}${command.help} - ${command.description}`).join("\n") || "Нет команд для пользователей.",
            ``,
            `Команды для випов:`,
            commands.filter(command => command.rights == 1).map(command => `${config.prefix}${command.help} - ${command.description}`).join("\n") || "Нет команд для випов.",
            ``,
            `Команды для админов:`,
            commands.filter(command => command.rights == 2).map(command => `${config.prefix}${command.help} - ${command.description}`).join("\n") || "Нет команд для админов.",
            ``,
            `Команды для создателя:`,
            commands.filter(command => command.rights == 3).map(command => `${config.prefix}${command.help} - ${command.description}`).join("\n") || "Нет команд для создателя.",
        ].join("\n");
        message.ok(result);
    },
    rights: 0,
    help: "помощь",
    description: "команды."
};