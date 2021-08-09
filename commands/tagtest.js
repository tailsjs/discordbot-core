module.exports = {
    tag: [ "тэгтест" ],
    function: async function(message){
        message.answer('Тестирую...');
        message.ok('OK_MESSAGE');
        message.warn('WARN_MESSAGE');
        message.error('ERROR_MESSAGE');
    },
    help: "тэгтест",
    description: "тэгтест"
};