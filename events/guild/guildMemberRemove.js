const { EmbedBuilder } = require("discord.js");
const { MEMBER_JOINEDCH } = require("../../settings/config");

module.exports = async (client, oldMember) => {
  const channelID = client.channels.cache.get(MEMBER_JOINEDCH);
  let members = client.guilds.cache.reduce((a, b) => a + b.memberCount, 0);

  const embed = new EmbedBuilder()
    .setColor(client.color)
    .setDescription(
      `<@${oldMember.id}> telah keluar dari **${oldMember.guild.name}**`
    )
    .setTimestamp();

  await client.user.setPresence({
    activities: [
      {
        name: `with ${members} members`,
        type: 0,
      },
    ],
    status: "online",
  });
  return channelID.send({ embeds: [embed] });
};
