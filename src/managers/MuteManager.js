/*class MuteManager {
    check(client, time) {
        if(mongoose.connection.closed === false || mongoose.connection.destroyed === false) {
            setInterval(async () => {
                const users = await User.find({}).exec();
                for (const user of users) {
                    const dbGuild = await Guild.findOne({id: user.guildId})
                    const guild = client.guilds.cache.get(user.guildId)
                    const role = client.guilds.cache.get(user.guildId).roles.cache.get(dbGuild.muteRole)
                    const member = guild.members.cache.get(user.id);

                    if(!role || dbGuild.muteRole === "0") return;

                    if(Date.now() >= user.unmuteTime && user.unmuteTime !== 0) {
                        member.roles.remove(role)
                            .then(member.send('Срок мута с сервера `' + guild.name + '` `(' + guild.id + ')`' + ' истёк'))
                        await user.updateOne({
                            unmuteTime: 0
                        });
                    }
                }
            }, 5000)
        }
    }
}

module.exports = MuteManager;*/