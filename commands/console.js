module.exports = {
    regexp: /^(консоль|console)/i,
    function: async function(message, { command, db, config, commands }){
        const cmd = message.text.split(" ").slice(1).join(" ");
	    if(!cmd)return message.error(`Нет команды!`);
	    try{
	    	let console = require('child_process').execSync(cmd);
	    	message.ok(`Выполнено!\nОтвет: \`\`\`${console}\`\`\``);
	    }catch(e){
	    	message.error(`Неудача!\n \`\`\`${e.message}\`\`\``);
	    };
    },
    rights: 3,
    help: "консоль [команда]",
    description: "выполнить команду"
};