const Discord = require("discord.js");
const mysql = require('mysql');
const client = new Discord.Client();
const prefix = '-';
let wiadomosc;
let kto;
let guard;
let liczba = 0;

const con = mysql.createConnection({
    host: '',
    user: '',
    password: '',
    database: '',
    port: 40090,
});

con.connect(err => {
    if(err) throw err;
    console.log("Połączono z bazą danych")
});

client.on('ready', () => { 
    console.log(`Logged as ${client.user.tag}`);
    console.log(`ClientID ${client.user.id}`);

    const query = con.query(`SELECT * FROM dev_tickets WHERE working = 1`, (err, rows) => {
        if(err) throw err;

        if (rows.length >= 1) {
            const kanalll = client.channels.cache.get(`${rows[0].channelid}`);
            kanalll.messages.fetch();
        }
    });

    const query1 = con.query(`SELECT * FROM dev_opened WHERE working = 1`, (err, rows) => {
        if(err) throw err;

        if (rows.length >= 1) {
            const kanallll = client.channels.cache.get(`${rows[0].channelid}`);
            kanallll.messages.fetch();
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

            con.query(`INSERT INTO dev_tickets (channelid, messageid, guardid, name, emoji1) VALUES ('${wiadomosc.channel.id}', '${wiadomosc.id}', '${guard}', 'OTHER', '📋')`)
        } else if (args[0]) {
            if (!args[1]) {
                kto = `brak`
            } else {
                kto = `<@${args[1]}>`
            }

            if (!args[1]) {
                guard = '613717481323757569'
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
            con.query(`INSERT INTO dev_tickets (channelid, messageid, guardid, name, emoji1, emoji2, emoji3) VALUES ('${wiadomosc.channel.id}', '${wiadomosc.id}', '${guard}', '${args[0]}', '💼', '📋', '🛡️')`)
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

client.on('messageReactionAdd', async (reaction, ruser) => {
    if (ruser.bot) return;
    let tguild = client.guilds.cache.get('789874507665899560')
    let everyoneRole = tguild.roles.cache.find(r => r.name === '@everyone');
    if (reaction.message.channel.id === '789991949242204241') {
        const query1 = con.query(`SELECT * FROM dev_tickets WHERE messageid = '${reaction.message.id}'`, async (err, rows) => {
            if(err) throw err;
    
            if (rows.length >= 1) {
                if (reaction.emoji.name === rows[0].emoji1) {
                    const ticketchannel = await tguild.channels.create(`dev-ticket` + (liczba + 1), {
                        type: 'text',
                        permissionOverwrites: [
                            {
                                id: everyoneRole.id,
                                deny: ['VIEW_CHANNEL'],
                            },
                            {
                                id: ruser.id,
                                allow: ['VIEW_CHANNEL'],
                            }
                        ]
                    })
    
                    let guard = rows[0].guardid
                    
                    const embed = new Discord.MessageEmbed()
                    .setTitle('Nowy bilet')
                    .setDescription(`Opiekun tego języka niebawem się z tobą skontaktuje używając tego kanału w celu sprawdzenia twoich umiejętności. Prosimy o cierpliwość!\n\nNaciśnij na reakcję ❌ aby usunąć ten ticket\n**[Opiekun only]** Aby nadać rolę ${rows[0].name} dla <@${ruser.id}> naciśnij na reakcję 💼\n\n\n\nOpiekun: <@${guard}>\nTicket ID: ${liczba + 1}\nLang: ${rows[0].name}`)
                    .setColor('#9370DB');
                    
                    const wiad = await ticketchannel.send(embed)
                    wiad.react('❌')
                    wiad.react('💼')
                    let wiadomosc = await ticketchannel.send('<@'+guard+'> <@'+ruser.id+'>')
                    wiadomosc.delete()
    
                    liczba = liczba + 1
                    reaction.message.reactions.resolve('💼').users.remove(ruser.id)
    
                    con.query(`INSERT INTO dev_opened (channelid, messageid, emoji1, emoji2, type, name, userid) VALUES ('${wiad.channel.id}', '${wiad.id}', '❌', '💼', 'DEV', '${rows[0].name}', '${ruser.id}')`)
                } else if (reaction.emoji.name === rows[0].emoji2) {
                    if (rows[0].guardid === '613717481323757569') {
                        const ticketchannel = await tguild.channels.create(`opk-ticket` + (liczba + 1), {
                            type: 'text',
                            permissionOverwrites: [
                                {
                                    id: everyoneRole.id,
                                    deny: ['VIEW_CHANNEL'],
                                },
                                {
                                    id: ruser.id,
                                    allow: ['VIEW_CHANNEL'],
                                }
                            ]
                        })
        
                        let guard = rows[0].guardid
                        
                        const embed = new Discord.MessageEmbed()
                        .setTitle('Nowy bilet')
                        .setDescription(`Ktoś z administracji niedługo się z tobą skontaktuje używając tego kanału w celu sprawdzenia twoich umiejętności. Prosimy o cierpliwość!\n\nNaciśnij na reakcję ❌ aby usunąć ten ticket\n**[Administration only]** Aby nadać rolę ${rows[0].name} dla <@${ruser.id}> naciśnij na reakcję 💼\n\n\n\nTicket ID: ${liczba + 1}\nLang: ${rows[0].name}`)
                        .setColor('#9370DB');
                        
                        const wiad = await ticketchannel.send(embed)
                        wiad.react('❌')
                        wiad.react('💼')
                        let wiadomosc = await ticketchannel.send('<@'+guard+'> <@'+ruser.id+'>')
                        wiadomosc.delete()
        
                        liczba = liczba + 1
                        reaction.message.reactions.resolve('📋').users.remove(ruser.id)

                        con.query(`INSERT INTO dev_opened (channelid, messageid, emoji1, emoji2, type, name, userid) VALUES ('${wiad.channel.id}', '${wiad.id}', '❌', '💼', 'OPK', '${rows[0].name}', '${ruser.id}')`)
                    } else {
                        ruser.send('Opiekun tego języka już istnieje! Jeśli uważasz, że mógłbyś być lepszy bądź jesteś w stanie udowodnić brak jego umiejętności użyj reakcji 🛡️')
                        reaction.message.reactions.resolve('📋').users.remove(ruser.id)
                    }
                } else if (reaction.emoji.name === rows[0].emoji3) {
                    const ticketchannel = await tguild.channels.create(`rep-ticket` + (liczba + 1), {
                        type: 'text',
                        permissionOverwrites: [
                            {
                                id: everyoneRole.id,
                                deny: ['VIEW_CHANNEL'],
                            },
                            {
                                id: ruser.id,
                                allow: ['VIEW_CHANNEL'],
                            }
                        ]
                    })
    
                    let guard = rows[0].guardid
                    
                    const embed = new Discord.MessageEmbed()
                    .setTitle('Nowy bilet')
                    .setDescription(`Ktoś z administracji niedługo się z tobą skontaktuje używając tego kanału w celu sprawdzenia dowodów. Prosimy o cierpliwość!\n\nNaciśnij na reakcję ❌ aby usunąć ten ticket\n\n\n\nTicket ID: ${liczba + 1}\nLang: ${rows[0].name}`)
                    .setColor('#9370DB');
                    
                    const wiad = await ticketchannel.send(embed)
                    wiad.react('❌')
                    let wiadomosc = await ticketchannel.send('<@'+guard+'> <@'+ruser.id+'>')
                    wiadomosc.delete()
    
                    liczba = liczba + 1
                    reaction.message.reactions.resolve('🛡️').users.remove(ruser.id)
                    con.query(`INSERT INTO dev_opened (channelid, messageid, emoji1, emoji2, type, name, userid) VALUES ('${wiad.channel.id}', '${wiad.id}', '❌', '💼', 'REP', '${rows[0].name}', '${ruser.id}')`)
                }
            }
        });
    } else {
        const query1 = con.query(`SELECT * FROM dev_opened WHERE messageid = '${reaction.message.id}'`, async (err, rows) => {
            if(err) throw err;

            if (reaction.emoji.name === rows[0].emoji1) {
                let tuser = tguild.members.cache.find(mem => mem.id === rows[0].userid)
                await tuser.send(`Twój ticket został usunięty`)

                con.query(`DELETE FROM dev_opened WHERE messageid = '${reaction.message.id}'`)
                reaction.message.channel.delete()
            } else if (reaction.emoji.name === rows[0].emoji2) {
                con.query(`SELECT * FROM dev_tickets WHERE name = '${rows[0].name}'`, async (err, rows1) => {
                    if (err) throw err;
                    
                    if (rows[0].type === 'DEV') {
                        if (ruser.id === rows1[0].guardid) {
                            let tguild = client.guilds.cache.get('789874507665899560')
                            let role = tguild.roles.cache.find(role => role.name === rows[0].name)
                            let koks = tguild.members.cache.find(mem => mem.id === rows[0].userid)
                            koks.roles.add(role)
                            koks.send(`Twoje zgłoszenie na developera ${rows1[0].name} zostało rozpatrzone pozytywnie! Rola została nadana!`)
                            con.query(`DELETE FROM dev_opened WHERE messageid = '${reaction.message.id}'`)
                            reaction.message.channel.delete()
                        } else {
                            reaction.message.reactions.resolve('💼').users.remove(ruser.id)
                        }
                    } else if (rows[0].type === 'OPK') {
                        if (ruser.id === rows1[0].guardid) {
                            let tguild = client.guilds.cache.get('789874507665899560')
                            let role = tguild.roles.cache.find(role => role.name === rows[0].name)
                            let koks = tguild.members.cache.find(mem => mem.id === rows[0].userid)
                            koks.roles.add(role)
                            koks.send(`Twoje zgłoszenie na opiekuna ${rows1[0].name} zostało rozpatrzone pozytywnie! Rola została nadana!`)
                            con.query(`DELETE FROM dev_opened WHERE messageid = '${reaction.message.id}'`)
                            reaction.message.channel.delete()
                        } else {
                            reaction.message.reactions.resolve('💼').users.remove(ruser.id)
                        }
                    }
                });
            }
        });
    }
});

client.login(process.env.DJS_TOKEN);
