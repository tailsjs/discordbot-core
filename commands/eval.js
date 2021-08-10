const kindOf = require('kind-of');

module.exports = {
    regexp: /^(а?евал+|a?eval+)/i,
    function: async function(message, { command, db, config, commands, fetchUser, logger, random, fetch }){
        const form = message.text.split(' ').slice(0, 1).join(' ');
        let code = message.text.split(' ').slice(1).join(' ');

        if (/^[аa]/i.test(form)) code = `(async () => { ${code} })()`;

        try {
            let evaled = await eval(code);

            if (/(evall+|евалл+)$/i.test(form)) evaled = JSON.stringify(evaled, null, '	');

            const type = kindOf(evaled);
            if (type === 'array') evaled = `[ ${evaled} ]`;

            message.ok([
                `Выполнено!`,
                `Тип: \`\`\`${type}\`\`\``,
                `Ответ: \`\`\`${evaled}\`\`\``
            ].join('\n'));
    }
        catch (e) {
            message.error(`Ошибка!\n\n\`\`\`${e}\`\`\``);
        };
    },
    rights: 3,
    help: "евал [код]",
    description: "выполнить код."
};