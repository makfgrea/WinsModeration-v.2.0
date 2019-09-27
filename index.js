const { Client, RichEmbed } = require("discord.js");
const { config } = require("dotenv");

const client = new Client({
    disableEveryone: false
});

config({
    path: __dirname + "/.env"
});

client.on("ready", () => {
    console.log(`I am now online, my name is ${client.user.username}`);

    client.user.setPresence({
        status: "dnd",
        game: {
            name: "Wins Moderation",
            type: ""
        }
    });
});

client.on("message", async message => {
    const prefix = ">";

    if(message.author.bot) return;
    if(!message.guild) return;
    if(!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (cmd === "ping") {
        const msg = await message.channel.send(`**🌹 Pinging...**`);

        msg.edit(`**🌹 Pong\nLatency is ${Math.floor(msg.createdAt - message.createdAt)}\nAPI Latency ${Math.round(client.ping)}ms**`);
    }

    if (cmd === "say") {
        if (message.deletable) message.delete();

        if (args.length <1)
            return message.reply("Can you say something?").then(m => m.delete(5000));

        const roleColor = message.guild.me.displayHexColor === "#000000" ? "#ffffff" : message.guild.me.displayHexColor;

        if (args[0].toLowerCase() === "embed") {
            const embed = new RichEmbed()
                .setColor(roleColor)
                .setDescription(args.slice(1).join(" "))
                .setTimestamp()
                .setAuthor(message.author.username, message.author.displayAvatarURL)
                .setFooter(client.user.username, client.user.displayAvatarURL);

            message.channel.send(embed);
        } else {
            message.channel.send(args.join(" "));
        }
    }
});

client.login(process.env.TOKEN);