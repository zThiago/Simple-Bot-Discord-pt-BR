const Discord = require('discord.js'); // puxando a biblioteca discord.js
const moment = require('moment'); // utiizando a biblioteca moment para a formatação de tempo
const config = require('./config.json'); // definindo a config para futuros usos de informações nela contida.
const bot = new Discord.Client({}); // Alguns parâmetros podem ser adicionados entre esses {}
const comandos = new Set(); // criando um novo set, ele irá armazenar informações, não será usada nesse primeiro momento.
moment.locale('pt-BR'); // definindo o local de formatação do tempo, para ficar traduzido

//Quando o bot ligar
bot.on('ready', message => {
console.log("Olá Mundo!"); // irá informar no console 
console.log("Estou online"); // outro texto que sera logado no console
bot.user.setActivity({name: "Estou online!", type: "PLAYING"}); // alterando a atividade do bot para jogando com o seguinte texto: "Estou online!"
// Você pode alterar o valor do `name` e o type
})

// Evento de receber mensagem Servidor Canal/DM
bot.on('message', async message => {
   if(message.author.bot) return; // Caso o autor da mensagem seja um bot, ele irá continuar a ler o codigo, ou seja, ele não vai responder.
   let prefix = config.prefix; // Defini a prefix do bot aqui, puxando da config, verifique a config e você verá a prefix lá.
   let args = message.content.split(" ").slice(1); // definindo que args e o conteudo da mensagem separada por espaçamento e que será apenas da segunda palavra, pois a se trata do comando, e caso seja o comando de enviar mensagem por exemplo ele irá enviar o comando também, segue o exemplo abaixo:
   // split(" ") => a mensagem será separada por espaçamento, assim caso a mensagem seja: Bom dia pessoal!
   // será lido:
   // args[0] = Bom
   // args[1] = dia
   // args[2] = pessoal!
   // na programação javascript, tudo tem inicio a partir do 0
   // Sem o slice(1)
   // Comando de falar: Usuario#0101 > !falar Ola, estou usando o comando de falar.
   // resposta do bot: !falar Ola, estou usando o comando de falar.
   // Com o slice(1)
   // Comando de falar: Usuario#0101 > !falar Ola, estou usando o comando de falar.
   // resposta do bot: Ola, estou usando o comando de falar.
   
   
   
   // Comando de limparchat
   if(message.content.startsWith(prefix+"limparchat")){ // verificando se a mensagem e: !limparchat caso a prefix seja !
      // ele verifica se quem executou o comando tem permissão para gerenciar o servidor, caso não possua a permissão será retornado uma mensagem e irá parar o codigo
    if(!message.member.permissions.has("MANAGE_GUILDS")) return message.channel.send("Sem permissão! você precisa da permissão `Manage_Guilds`");
    message.delete(); // apaga a mensagem que foi enviada
    let apagar = args[0]; // defini que o args[0] vai ser chamado pagar
   // verificando se apagar não existe ou se apagar e menor que 1 ou se apagar e maior que 100, caso isso seja verdadeiro ele irá retornar uma mensagem abaixo entre ""
    if(!apagar || apagar < 1 || apagar > 100) return message.channel.send("Informe um valor de 1 a 100");
    message.channel.bulkDelete(apagar) // apagando a quantidade de mensagens informada no apagar, lembrando que precisa ser um numero de 1 - 100
    message.channel.send("Mensagens apagadas com sucesso!") // enviando uma mensagem no canal
} // fim do comando de limpar chat
   // Comando de reportar
   if(message.content.startsWith(prefix+"reportar")){
     let usuario = message.mentions.members.first(); //Pegar um usuario mencionado na mensagem
  if(!usuario) return message.channel.send("**Você precisa informar um usuario para reportar.**") // Caso a mensagem não contenha o usuario reportado
  if(usuario.id == message.author.id) return message.channel.send("Você não pode reportar a sí mesmo.**") // Verificar se o usuario que vai ser reportado e o propio usuario
  let motivo = args.slice(1).join(" ") //Definir o motivo
  if(!motivo) return message.channel.send("**Você precisa informar um motivo para reportar o usuario.**") //Caso o motivo não tenha sido informado
  let canal = message.guild.channels.cache.get('ID DO CANAL PARA ONDE O REPORTE VAI') //Aqui ele vai procurar um canal no servidor para enviar o reporte, OBS: E por ID
  if(!canal) return message.channel.send("**Ocorreu um erro, não foi possivel encontrar um canal de reportes.**") //Caso não encontre o canal ele vai informar na hora do reporte

//Abaixo tem a embed, você pode personalizar a seu gosto
  let reportemsg = new Discord.MessageEmbed() 
  .setTitle("Novo Reporte")
  .setColor("#FFF000")
  .setThumbnail(usuario.user.avatarURL({format: "png"}))
  .addField("Quem reportou:", message.author.tag)
  .addField("Usuario reportado:", usuario.user.tag)
  .addField("Motivo do Reporte:", motivo)
  .addField("Quando reportou:", moment(message.createdAt).format('LLLL'))
  .setFooter("ID do reportado: " + usuario.id)
  canal.send(reportemsg) // Enviando o reporte para o canal
  message.channel.send("**Seu reporte foi concluido.**").then(msg => msg.delete({timeout: 10000})) // Avisando para o usuario que o reporte foi feito, essa mensagem será apagada em 10 segundos.
message.delete() //Apaga a mensagem delete
  }
   
   // Comando de Banir
  if(message.content.startsWith(prefix+"banir")){
     //banir @usuario [Motivo]
     // Precisa do moment!
   if(!message.member.permissions.has("BAN_MEMBERS")) return message.channel.send("Você precisa ter a permissão de banir usuarios para executar esse comando.")
   let usuario = message.mentions.members.first(); // pegar o usuario
   if(!usuario) return message.channel.send("Você precisa informar um usuario para banir."); // caso não tenha mencionado usuario
    if(usuario.id == message.author.id) return message.channel.send("Você não pode banir a sí propio"); //caso mencione a si mesmo
   let motivo = args.slice(1).join(" "); //definir o motivo
     if(!motivo) motivo = "Sem Motivo" // definir caso o motivo não seja informado
   let canal = message.guild.channels.cache.get("ID CANAL DE PUNIÇÕES"); // pega um canal para enviar mensagem de banimento
   message.channel.send("Para confirmar o banimento do usuario " + usuario.user.tag + " pelo motivo: " + motivo + " digite `confirmar`").then(msg => msg.delete({timeout: 60000})) // messagem de confirmação, depois de 1 minutos será pagado, pois e o tempo que o coletor acaba
   let confirmar = message.channel.createMessageCollector(a => a.author.id === message.author.id, {time: 60000, max: 1}); // coletor de mensagem com 1 minuto de espera e uma maximo de 1 mensagem
   confirmar.on('collect', r => {
   let mc = r.content; // mesangem coletada
   // abaixo verificar se a mensagem e "confirmar", uso do toLowerCase para identificar "Confirmar","CONFIRMAR","cONFIRMAR"...
   if(mc.toLowerCase() == "confirmar"){
     try{
      // tenta banir o usuario
      usuario.ban({reason: motivo})
      let banmsg = new Discord.MessageEmbed()
      .setTitle(usuario.user.username + " | Banido")
      .setThumbnail(usuario.user.avatarURL({format: "png"}))
      .setColor("#ff0000")
      .addField("Autor da punição:", message.author)
      .addField("Usuario punido:", usuario)
      .addField("Motivo:", motivo)
      .addField("Quando ocorreu:", moment(message.createdAt).format('LLLL'))
      .setFooter("Banimento")
      canal.send(banmsg)
      message.channel.send("<@"+message.author.id + "> usuario banido com sucesso.")
     }catch(erro){
     // se não conseguiu banir o usuario ele retornar o erro
     message.channel.send("Não foi possivel banir o usuario por causa do error: "+ erro)
}
   } else{
    // caso a mensagem não seja "confirmar"
    return message.channel.send("Banimento cancelado.")
}
  })
  }
   // Comando de Ajuda
 if(message.content.startsWith("ajuda")){
 let helpmsg = new Discord.MessageEmbed() // cria um embed, a seguir o link explicando tudo sobre uma embed: https://discordjs.guide/popular-topics/embeds.html
 .setTitle("Simple bot comandos")
 .setDescription("`!ajuda` - Vê os comandos de ajuda\n`!banir <@usuario> [Motivo]` - Bani um usuario do servidor.\n`!limparchat [1-100]` - Limpa um chat do servidor.\n`!kick <@usuario> [Motivo]` - Expulsa um usuario do servidor\n`!reportar <@usuario> [Motivo]` - Reporta um usuario para os administradores do servidor.")
 .setColor("#fff000")
 .setFooter("Comandos do bot")
 message.channel.send(helpmsg) // envia a embed no canal
 }
})
// faz o login do bot através do token presente na config.
bot.login(config.token).catch(erro => {console.log("Não foi possivel logar o bot: " + erro)})
