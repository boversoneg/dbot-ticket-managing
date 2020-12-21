const Discord = require("discord.js");
const mysql = require('mysql');
const client = new Discord.Client();
const prefix = '-';
let wiadomosc;
let kto;
let guard;

const con = mysql.createConnection({
    host: 'remotemysql.com',
    user: '1aLNWvex0X',
    password: 'CuKgMgYKud',
    database: '1aLNWvex0X'
});

con.connect(err => {
    if(err) throw err;
    console.log("Połączono z bazą danych")
});

client.on('ready', () => { 
    console.log(`Logged as ${client.user.tag}`);
    console.log(`ClientID ${client.user.id}`);

    const query = con.query(`SELECT * FROM tickets WHERE working = 1`, (err, rows) => {
        if(err) throw err;

        if (rows.length > 1) {
            const kanalll = client.channels.cache.get(`${rows[0].channelid}`);
            kanalll.messages.fetch();
        }
    });

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
        if (args[0] === 'other') {
            if (!args[1]) {
                guard = 613717481323757569
            } else {
                guard = args[1]
            }
            const embed = new Discord.MessageEmbed()
            .setColor('#9370DB')
            .setTitle('Nowy język')
            .setDescription(`Naciśnij reakcję 📋 jeśli chcesz wysłać prośbę o dodanie nowego języka`);

            wiadomosc = await message.channel.send(embed);
            wiadomosc.react('📋');

            con.query(`INSERT INTO tickets (channelid, messageid, guardid, name, emoji1) VALUES ('${wiadomosc.channel.id}', '${wiadomosc.id}', '${guard}', 'OTHER', '📋')`)
        } else if (args[0]) {
            if (!args[1]) {
                kto = `brak`
            } else {
                kto = `<@${args[1]}>`
            }

            if (!args[1]) {
                guard = 613717481323757569
            } else {
                guard = args[1]
            }
            const embed = new Discord.MessageEmbed()
            .setColor('#9370DB')
            .setTitle(`${args[0]} Developer`)
            .setDescription(`Dodaj reakcję 💼 jeśli chcesz otrzymać rolę developera\n\nDodaj reakcję 📋 aby zostać opiekunem\n\nDodaj reakcję 🛡️ aby zgłosić opiekuna/developera\n\n\n\nAktualny opiekun: ${kto}`);

            wiadomosc = await message.channel.send(embed);
            wiadomosc.react('💼');
            wiadomosc.react('📋');
            wiadomosc.react('🛡️');
            con.query(`INSERT INTO tickets (channelid, messageid, guardid, name, emoji1, emoji2, emoji3) VALUES ('${wiadomosc.channel.id}', '${wiadomosc.id}', '${guard}', '${args[0]}', '💼', '📋', '🛡️')`)
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
    if (user.bot) return; 
    console.log(reaction.message.id)
    const query1 = con.query(`SELECT * FROM tickets WHERE emoji1 = '${reaction.emoji.name}'`, (err, rows) => {
        if(err) throw err;

        console.log(rows[0].messageid)

        if (rows.length > 1) {
            if (reaction.message.id === rows[0].messageid) {
                console.log("elo")
            }
        }
    });
});

client.login('NzkwMTU1MTE4ODc1OTAxOTky.X98fTA.54UPDoCDIVM7CnmcpfFVlugCD7A');