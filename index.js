const Discord = require("discord.js");
const client = new Discord.Client();
const prefix = '-';
let wiadomosc;
let kto;

client.on('ready', () => { 
    console.log(`Logged as ${client.user.tag}`);
    console.log(`ClientID ${client.user.id}`);

    setInterval (function () {
        client.user.setPresence({activity: {name: `${client.guilds.cache.get('789874507665899560').memberCount} użytkowników`}});
    }, 1 * 3000); 
});

function clean(text) {
    if (typeof(text) === "string")
      return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
  }

client.on('message', async (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();

    if (command === 'ticketcreate') {
        if (message.author.id !== '613717481323757569') return;
        if (args[0] === 'lua') {
            const embed = new Discord.MessageEmbed()
            .setColor('#9370DB')
            .setTitle('LUA Developer')
            .setDescription(`Dodaj reakcję 💼 jeśli chcesz otrzymać rolę developera\n\nDodaj reakcję 📋 aby zostać opiekunem\n\nDodaj reakcję 🛡️ aby zgłosić opiekuna/devlopera\n\n\n\nAktualny opiekun: <@${args[1]}>`);

            wiadomosc = await message.channel.send(embed);
            wiadomosc.react('💼');
            wiadomosc.react('📋');
            wiadomosc.react('🛡️');
        } else if (args[0] === 'js') {
            if (!args[1]) {
                kto = 'brak';
            } else {
                kto = `<@${args[1]}>`;
            }
            const embed = new Discord.MessageEmbed()
            .setColor('#9370DB')
            .setTitle('JavaScript Developer')
            .setDescription(`Dodaj reakcję 💼 jeśli chcesz otrzymać rolę developera\n\nDodaj reakcję 📋 aby zostać opiekunem\n\nDodaj reakcję 🛡️ aby zgłosić opiekuna/devlopera\n\n\n\nAktualny opiekun: ${kto}`);

            wiadomosc = await message.channel.send(embed);
            wiadomosc.react('💼');
            wiadomosc.react('📋');
            wiadomosc.react('🛡️');
        } else if (args[0] === 'cpp') {
            if (!args[1]) {
                kto = 'brak';
            } else {
                kto = `<@${args[1]}>`;
            }
            const embed = new Discord.MessageEmbed()
            .setColor('#9370DB')
            .setTitle('C++ Developer')
            .setDescription(`Dodaj reakcję 💼 jeśli chcesz otrzymać rolę developera\n\nDodaj reakcję 📋 aby zostać opiekunem\n\nDodaj reakcję 🛡️ aby zgłosić opiekuna/devlopera\n\n\n\nAktualny opiekun: ${kto}`);

            wiadomosc = await message.channel.send(embed);
            wiadomosc.react('💼');
            wiadomosc.react('📋');
            wiadomosc.react('🛡️');
        } else if (args[0] === 'cs') {
            if (!args[1]) {
                kto = 'brak';
            } else {
                kto = `<@${args[1]}>`;
            }
            const embed = new Discord.MessageEmbed()
            .setColor('#9370DB')
            .setTitle('C# Developer')
            .setDescription(`Dodaj reakcję 💼 jeśli chcesz otrzymać rolę developera\n\nDodaj reakcję 📋 aby zostać opiekunem\n\nDodaj reakcję 🛡️ aby zgłosić opiekuna/devlopera\n\n\n\nAktualny opiekun: ${kto}`);

            wiadomosc = await message.channel.send(embed);
            wiadomosc.react('💼');
            wiadomosc.react('📋');
            wiadomosc.react('🛡️');
        } else if (args[0] === 'other') {
            const embed = new Discord.MessageEmbed()
            .setColor('#9370DB')
            .setTitle('Nowy język')
            .setDescription(`Naciśnij reakcję 📋 jeśli chcesz wysłać prośbę o dodanie nowego języka`);

            wiadomosc = await message.channel.send(embed);
            wiadomosc.react('📋');
        }
    } else if (message.content.startsWith(prefix + "eval")) {
        if(message.author.id !== '613717481323757569') return;
        try {
          const code = args.join(" ");
          let evaled = eval(code);
    
          if (typeof evaled !== "string")
            evaled = require("util").inspect(evaled);
    
          message.channel.send(clean(evaled), {code:"xl"});
        } catch (err) {
          message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
        }
      }
});

client.on('messageReactionAdd', (reaction, user) => {
    console.log('ta');
    if (reaction.message.id === '790166299107917825') {
        console.log('elo');
        reaction.message.channel.send("eloox");
    };
});

client.login('NzkwMTU1MTE4ODc1OTAxOTky.X98fTA.54UPDoCDIVM7CnmcpfFVlugCD7A');