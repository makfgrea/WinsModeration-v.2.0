const { Client, RichEmbed, Collection } = require("discord.js");
const { config } = require("dotenv");
const serverStats = {
    guildID: '544122605628817411',
    totalUsersID: '627838843344912394',
    memberCountID: '627838893261193236',
    botCountID: '627838940535193610'
};

const client = new Client({
    disableEveryone: false
});

client.commands = new Collection();
client.aliases = new Collection();

config({
    path: __dirname + "/.env"
});

["command"].forEach(handler => {
    require(`./handler/${handler}`)(client);
});

client.on("ready", () => {
    console.log(`I am now online, my name is ${client.user.username}`);

client.on('guildMemberAdd', member => {
    if (member.guild.id !== serverStats.guildID) return;
    client.channels.get(serverStats.totalUsersID).setName(`Total Users: ${member.guild.memberCount}`);
    client.channels.get(serverStats.memberCountID).setName(`Member Count: ${member.guild.members.filter(m => !m.user.bot).size}`);
    client.channels.get(serverStats.botCountID).setName(`Bot Count: ${member.guild.members.filter(m => m.user.bot).size}`);
});

client.on('guildMemberRemove', member => {
    if (member.guild.id !== serverStats.guildID) return;
    client.channels.get(serverStats.totalUsersID).setName(`Total Users: ${member.guild.memberCount}`);
    client.channels.get(serverStats.memberCountID).setName(`Member Count: ${member.guild.members.filter(m => !m.user.bot).size}`);
    client.channels.get(serverStats.botCountID).setName(`Bot Count: ${member.guild.members.filter(m => m.user.bot).size}`);
});

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
    if(!message.member) message.member = await message.guild.fetchMember(message);

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (cmd.length === 0) return;

    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));

    if (command)
        command.run(client, message, args);
});

client.login(process.env.TOKEN);