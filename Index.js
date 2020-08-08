const Discord = require('discord.js');
const moment = require('moment');
const bot = new Discord.Client({}); // Alguns parâmetros podem ser adicionados entre esses {}
moment.locale('pt-BR');

//Quando o bot ligar
bot.on('ready', message => {
console.log("Olá Mundo!");
console.log("Estou online");
bot.user.setActivity({name: "Estou online!", type: "PLAYING"});
// Você pode alterar o valor do `name` e o type
})

// Evento de receber mensagem Servidor Canal/DM
bot.on('message', async message => {
   if(message.author.bot) return;
   let prefix = "!"; // Defini a prefix do bot aqui
   let args = message.content.split(" ").slice(1);
   
   if(message.content.startsWith(prefix+"limparchat")){
    if(!message.member.hasPermission("MANAGE_GUILDS")) return message.channel.send("Sem permissão! você precisa da permissão `Manage_Guilds`");
    message.delete();
    let apagar = args[0];
    if(!apagar || apagar < 1 || apagar > 100) return message.channel.send("Informe um valor de 1 a 100");
    message.channel.bulkDelete(apagar)
    message.channel.send("Mensagens apagadas com sucesso!")
}
})
